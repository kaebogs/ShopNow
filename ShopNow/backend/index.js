import express from "express";
const app = express();

import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { connectDatabase } from "./config/ConnectDB.js";

//importing all routes
import productRoutes from "./routes/product.js";
import authRoutes from "./routes/auth.js";
import orderRoutes from "./routes/order.js";
import paymentRoutes from "./routes/payment.js";
import cors from "cors";

//error middleware
import errorMiddleware from "./middleware/errors.js";

import path from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


// Handling uncaught exceptions to prevent crashes
process.on("uncaughtException", (err) => {
  console.log(`ERROR: ${err}`);
  console.log("Shutting down due to uncaught exception");
  process.exit(1);
});

if (process.env.NODE_ENV !== "PRODUCTION") {
  dotenv.config({ path: "backend/config/config.env" });
}

//connecting to database
connectDatabase();

//use to send json
app.use(
  express.json({
    limit: "10mb",
    verify: (req, res, buf) => {
      req.rawBody = buf.toString();
    },
  })
);

//use to work with cookies easily
app.use(cookieParser());

app.use(cors({
  origin: process.env.NODE_ENV === "PRODUCTION" 
    ? "https://shopna-6dym.onrender.com"  // Production URL
    : "http://localhost:3000",    // Development URL
  credentials: true, 
}));

//routes
app.use("/api/v1", productRoutes);
app.use("/api/v1", authRoutes);
app.use("/api/v1", orderRoutes);
app.use("/api/v1", paymentRoutes);

if(process.env.NODE_ENV === "PRODUCTION"){
  app.use(express.static(path.join(__dirname, "../frontend/dist")))
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "../frontend/dist/index.html"));
  });
}

// Middleware to handle errors globally
app.use(errorMiddleware);

// Start the server
const server = app.listen(process.env.PORT, () => {
  console.log(
    `listening on port: ${process.env.PORT} in ${process.env.NODE_ENV} mode`
  );
});

//unhandled promise rejection
process.on("unhandledRejection", (err) => {
  console.log(`ERROR: ${err}`);
  console.log("Server shutting down due to unhandled promise rejection");
  server.close(() => {
    process.exit(1);
  });
});
