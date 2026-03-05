import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";

// Import routes
import authRoutes from "./routes/auth";
import doctorsRoutes from "./routes/doctors";
import appointmentsRoutes from "./routes/appointments";
import medicinesRoutes from "./routes/medicines";
import kiosksRoutes from "./routes/kiosks";
import ordersRoutes from "./routes/orders";
import aiRoutes from "./routes/ai";
import userRoutes from "./routes/users";
import ambulanceRoutes from "./routes/ambulance";
import doctorRoutes from "./routes/doctors";
import seminarRoutes from "./routes/seminars";



dotenv.config();

const app = express();
const PORT = process.env.PORT || 5004;

// Middleware
app.use(cors({ 
  origin: process.env.ALLOWED_ORIGINS?.split(",") || "*",
  credentials: true 
}));
app.use(express.json({ limit: "10mb" })); // Handles JSON bodies with size limit
app.use(express.urlencoded({ extended: true, limit: "10mb" })); // Handles form submissions

app.use("/uploads", express.static("uploads"));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Root route
app.get("/", (req, res) => {
  res.json({ 
    message: "Welcome to e-Sehat Nabha API ",
    version: "1.0.0",
    timestamp: new Date().toISOString(),
    endpoints: {
      auth: "/api/auth",
      doctors: "/api/doctors",
      appointments: "/api/appointments",
      medicines: "/api/medicines",
      kiosks: "/api/kiosks",
      orders: "/api/orders",
      ai: "/api/ai",
      users: "/api/users",
      ambulance: "/api/ambulance",
      health: "/api/health"
    }
  });
});

// API Routes

app.use("/api/auth", authRoutes);
app.use("/api/doctors", doctorsRoutes);
app.use("/api/appointments", appointmentsRoutes);
app.use("/api/medicines", medicinesRoutes);
app.use("/api/kiosks", kiosksRoutes);
app.use("/api/orders", ordersRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/users", userRoutes);
app.use("/api/ambulance", ambulanceRoutes);
app.use("/api/doctors", doctorRoutes);
app.use("/api/seminars", seminarRoutes);




// Health check
app.get("/api/health", (req, res) => {
  res.json({ 
    status: "Healthy",
    message: "e-Sehat Nabha API is running!",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || "development"
  });
});

// 404 fallback for API routes
app.use("/api/*", (req, res) => {
  res.status(404).json({ 
    error: "API endpoint not found",
    path: req.originalUrl,
    method: req.method 
  });
});

// Global error handling middleware
app.use((error: any, req: any, res: any, next: any) => {
  console.error("Global Error Handler:", error);
  
  if (error.type === "entity.parse.failed") {
    return res.status(400).json({ 
      error: "Invalid JSON payload" 
    });
  }
  
  

  res.status(500).json({ 
    error: "Internal server error",
    message: process.env.NODE_ENV === "development" ? error.message : "Something went wrong"
  });
});

// Start server
const server = app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || "development"}`);
  console.log(`Started at: ${new Date().toISOString()}`);
});

// Graceful shutdown handling
process.on("SIGINT", () => {
  console.log("\n Received SIGINT signal");
  gracefulShutdown();
});

process.on("SIGTERM", () => {
  console.log(" Received SIGTERM signal");
  gracefulShutdown();
});

function gracefulShutdown() {
  console.log("Shutting down gracefully...");
  
  server.close((err) => {
    if (err) {
      console.error(" Error during shutdown:", err);
      process.exit(1);
    }
    
    console.log("Server closed successfully");
    process.exit(0);
  });
  
  // Force close after 10 seconds
  setTimeout(() => {
    console.log("Forcing shutdown after timeout");
    process.exit(1);
  }, 10000);
}

export default app;