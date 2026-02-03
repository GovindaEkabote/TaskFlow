import connectDB from "./config/db.js";
import app from "./app.js";

// Database connection
connectDB();

// start server
const PORT = process.env.PORT || 4000;

const server = app.listen(PORT, () => {
  console.log(`server is running on port ${PORT}`);
});

// error handling
process.on("unhandledRejection", (err) => {
  console.error(`Unhandled Rejection : ${err.message}`);
  process.exit(1);
});

export default server;
