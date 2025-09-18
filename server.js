// server.js
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import rideRoutes from "./src/routes/rideRoutes.js";
import riderRoutes from "./src/routes/riderRoutes.js";
import paymentRoutes from "./src/routes/paymentRoutes.js";


dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/riders", riderRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/rides", rideRoutes);

app.get("/", (req, res) => {
  res.send("🚀 Rider Portal Backend is running!");
});

app.get("/healthz", (req, res) => {
  res.status(200).send("OK");
});