import mongoose from "mongoose";

const connectDB = async () => {
  try {
    mongoose.set("strictQuery", true);

    const conn = await mongoose.connect(process.env.DATABASE_URL, {
      dbName: "PMS",
      autoIndex: false,          // disable in production
      maxPoolSize: 10,           // connection pool
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      family: 4,                 // IPv4
    });

    console.log(
      `🟢 MongoDB Connected: ${conn.connection.host}`
    );

    // Connection events (production-grade)
    mongoose.connection.on("error", (err) => {
      console.error("🔴 MongoDB error:", err);
    });

    mongoose.connection.on("disconnected", () => {
      console.warn("🟠 MongoDB disconnected");
    });

  } catch (error) {
    console.error("❌ MongoDB connection failed:", error.message);
    process.exit(1);
  }
};

// Graceful shutdown (VERY IMPORTANT)
const gracefulShutdown = async (signal) => {
  console.log(`📴 ${signal} received. Closing MongoDB connection...`);
  await mongoose.connection.close();
  process.exit(0);
};

process.on("SIGINT", gracefulShutdown);
process.on("SIGTERM", gracefulShutdown);

export default connectDB;
