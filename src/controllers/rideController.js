// src/controllers/rideController.js
import { getRoute } from "../services/mapService.js";
import supabase from "../config/supabaseClient.js";
import stripe from "../utils/stripe.js";

// Get route + calculate fare
export const getRideRoute = async (req, res) => {
  try {
    const { originLat, originLng, destLat, destLng } = req.query;

    if (!originLat || !originLng || !destLat || !destLng) {
      return res.status(400).json({ message: "Missing coordinates" });
    }

    const routeData = await getRoute(
      { lat: originLat, lng: originLng },
      { lat: destLat, lng: destLng }
    );

    console.log("Route data:", routeData);

    // Geoapify returns distance in meters at: features[0].properties.distance
    const distanceInKm = routeData.features[0].properties.distance / 1000;
    const fare = Math.round(distanceInKm * 2 * 100); // $2 per km, in cents

    res.json({ route: routeData, fare });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create ride + Stripe payment
export const createRidePayment = async (req, res) => {
  try {
    const { riderId, origin, destination, fare, currency } = req.body;

    if (!riderId || !origin || !destination || !fare) {
      return res.status(400).json({ message: "Missing ride info" });
    }

    const { data: ride, error } = await supabase
      .from("rides")
      .insert([
        {
          rider_id: riderId,
          origin,
          destination,
          fare,
          status: "pending",
        },
      ])
      .select()
      .single();

    if (error) return res.status(500).json({ message: error.message });

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: currency || "usd",
            product_data: { name: "Ride Fare" },
            unit_amount: fare, // in cents
          },
          quantity: 1,
        },
      ],
      success_url: "http://localhost:5173/payments/success",
      cancel_url: "http://localhost:5173/payments/cancel",
      metadata: { ride_id: ride.id },
    });

    await supabase
      .from("rides")
      .update({ payment_id: session.id })
      .eq("id", ride.id);

    res.json({ url: session.url });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Stripe webhook handler
export const handleStripeWebhook = async (req, res) => {
  const event = req.body;

  try {
    if (event.type === "checkout.session.completed") {
      const session = event.data.object;
      const rideId = session.metadata.ride_id;

      await supabase
        .from("rides")
        .update({ status: "paid" })
        .eq("id", rideId);

      console.log("✅ Payment successful for ride:", rideId);
    }

    res.status(200).json({ received: true });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
