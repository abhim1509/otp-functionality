const express = require("express");
const http = require("http");

const app = express();
let server;

// Counter to track active requests
let activeRequests = 0;
let shuttingDown = false;

// Middleware to track active requests
app.use((req, res, next) => {
  if (shuttingDown) {
    res.setHeader("Connection", "close"); // Notify clients of server shutdown
    return res.status(503).send("Server is shutting down");
  }

  activeRequests++;
  console.log(`Active requests: ${activeRequests}`);

  res.on("finish", () => {
    activeRequests--;
    console.log(`Request completed. Active requests: ${activeRequests}`);
  });

  next();
});

// Sample route
app.get("/", (req, res) => {
  setTimeout(() => res.send("Hello, world!"), 2000); // Simulate delay
});

// Start the server
server = http.createServer(app);
server.listen(3000, () => {
  console.log("Server is running on port 3000");
});

// Handle shutdown signals
const gracefulShutdown = () => {
  console.log(
    "Received shutdown signal. Waiting for ongoing requests to complete..."
  );

  shuttingDown = true;

  // Stop accepting new connections
  server.close(() => {
    console.log("Server closed to new connections");
  });

  // Wait for active requests to complete
  const checkRequests = setInterval(() => {
    if (activeRequests === 0) {
      console.log("All requests completed. Shutting down.");
      clearInterval(checkRequests);
      process.exit(0); // Exit gracefully
    } else {
      console.log(
        `Waiting for ${activeRequests} active request(s) to finish...`
      );
    }
  }, 100);
};

// Listen for termination signals
process.on("SIGTERM", gracefulShutdown);
process.on("SIGINT", gracefulShutdown);
