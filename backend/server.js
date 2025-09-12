import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import Razorpay from "razorpay";

import paymentRoutes from "./routes/payment.js";
import busRoutes from "./routes/buses.js";
import authRoutes from "./routes/auth.js";
import hotelRoutes from "./routes/hotels.js";
import bookingsRoutes from "./routes/bookings.js";
import trainRoutes from "./routes/trains.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// ✅ Razorpay instance
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// ✅ Middleware
app.use(cors({ origin: "http://192.168.241.222:5173", credentials: true }));
app.use(express.json());
app.use(bodyParser.json());

// ✅ Routes
app.use("/api/buses", busRoutes);
app.use("/api/trains", trainRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/hotels", hotelRoutes);
app.use("/api/hotel-booking", bookingsRoutes);

// ✅ Payment routes (bus, cab, hotel, flight)
app.use("/api/payment", paymentRoutes(razorpay));

app.listen(port, "0.0.0.0", () => {
  console.log(`Server running at http://192.168.241.222:${port}`);
});
