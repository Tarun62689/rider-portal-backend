import supabase from "../config/supabaseClient.js";

// Register Rider
export const registerRider = async (req, res) => {
  const { email, password, name } = req.body;

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { name }
    }
  });

  if (error) return res.status(400).json({ error: error.message });

  res.status(201).json({ message: "Rider registered successfully", user: data.user });
};

// Login Rider
export const loginRider = async (req, res) => {
  const { email, password } = req.body;

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) return res.status(400).json({ error: error.message });

  res.json({ message: "Login successful", session: data.session });
};

// Get Rider Profile
export const getProfile = async (req, res) => {
  const user = req.user;
  res.json({ user });
};
