const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");
const userRoutes = require("./routes/userRoutes");
const chatRoutes = require("./routes/chatRoutes");
const messageRoutes = require("./routes/messageRoutes");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");

dotenv.config();

// Debug logging
console.log("🔧 Environment check:");
console.log("PORT:", process.env.PORT);
console.log("NODE_ENV:", process.env.NODE_ENV);
console.log("MONGO_URI exists:", !!process.env.MONGO_URI);

connectDB();

const app = express();

// CORS configuration
const corsOptions = {
  origin: [
    process.env.FRONTEND_URL,
    "http://localhost:3000",
    "http://localhost:5173", // Vite dev server
    "https://zuno-chat-app.vercel.app", // Your Vercel URL
    /\.vercel\.app$/, // Allow all Vercel preview deployments
    /\.railway\.app$/ // Allow Railway deployments
  ],
  credentials: true,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Debug middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`, req.body ? 'with body' : 'no body');
  next();
});

// API Routes
app.use("/api/user", userRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/message", messageRoutes);

// API routes only - frontend will be served by Vercel
app.get("/", (req, res) => {
  res.status(200).json({ 
    message: "Zuno Chat API is running successfully! 🚀",
    status: "healthy",
    timestamp: new Date().toISOString(),
    endpoints: {
      health: "/health",
      users: "/api/user",
      chats: "/api/chat", 
      messages: "/api/message"
    }
  });
});

app.get("/health", (req, res) => {
  res.status(200).json({ status: "OK" });
});

// Error Handling middlewares
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on PORT ${PORT}`);
  console.log(`🌐 Health check available at: http://localhost:${PORT}/health`);
}).on('error', (err) => {
  console.error('❌ Server failed to start:', err);
  process.exit(1);
});

// Socket.io setup
const io = require("socket.io")(server, {
  pingTimeout: 60000,
  cors: {
    origin: [
      process.env.FRONTEND_URL,
      "http://localhost:3000",
      "http://localhost:5173",
      /\.vercel\.app$/,
      /\.railway\.app$/
    ],
    credentials: true,
  },
});

io.on("connection", (socket) => {
  console.log("Connected to socket.io");

  // User setup
  socket.on("setup", (userData) => {
    socket.join(userData._id);
    socket.emit("connected");
  });

  // Join chat room
  socket.on("join chat", (room) => {
    socket.join(room);
    console.log("User Joined Room: " + room);
  });

  // Typing indicators
  socket.on("typing", (room) => socket.in(room).emit("typing"));
  socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));

  // New message
  socket.on("new message", (newMessageReceived) => {
    var chat = newMessageReceived.chat;

    if (!chat.users) return console.log("chat.users not defined");

    chat.users.forEach((user) => {
      if (user._id == newMessageReceived.sender._id) return;

      socket.in(user._id).emit("message received", newMessageReceived);
    });
  });

  // Video call signaling
  socket.on("offer", ({ to, offer }) => {
    socket.to(to).emit("offer", { from: socket.id, offer });
  });

  socket.on("answer", ({ to, answer }) => {
    socket.to(to).emit("answer", { answer });
  });

  socket.on("ice-candidate", ({ target, candidate }) => {
    socket.to(target).emit("ice-candidate", { candidate });
  });

  // Disconnect
  socket.off("setup", () => {
    console.log("USER DISCONNECTED");
    socket.leave(userData._id);
  });
});
