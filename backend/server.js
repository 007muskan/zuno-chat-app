const express = require("express");
const { chats } = require("./data/data");
const path = require("path");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const colors = require("colors");
const userRoutes = require("./routes/userRoutes");
const chatRoutes = require("./routes/chatRoutes");
const messageRoutes = require("./routes/messageRoutes");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");
const cors = require("cors");

const fs = require("fs");

dotenv.config();
connectDB();

const app = express();

app.use(cors());

app.use(express.json()); //to accept json data

// app.get("/", (req, res) => {
//   res.send("API is running");
// });

app.use("/api/user", userRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/message", messageRoutes);

//-----------------------Deployment-------------------------------

// const __dirname1 = path.resolve();
// if(process.env.NODE_ENV === 'production'){
//   app.use(express.static(path.join(__dirname1, 'frontend/dist')));
//   app.get('*', (req, res) => {
//     res.sendFile(path.resolve(__dirname1, 'frontend/dist', 'index.html'))
//   })
// }else{
//   app.get("/",(req,res) => {
//     res.send("API is Running Successfully!")
//   })
// }

const __dirname1 = path.resolve();

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname1, "../frontend/dist")));

  app.get("*", (req, res) =>
    res.sendFile(path.resolve(__dirname1, "../frontend", "dist", "index.html"))
  );
} else {
  app.get("/", (req, res) => {
    res.send("API is Running Successfully!");
  });
}
//-----------------------Deployment-------------------------------

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5001;
const server = app.listen(
  PORT,
  console.log(`Server started on PORT ${PORT}`.yellow.bold)
);

const io = require("socket.io")(server, {
  pingTimeout: 60000,
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
  },
});

io.on("connection", (socket) => {
  console.log("connected to socket.io");

  socket.on("setup", (userData) => {
    if (!userData || !userData._id) {
      console.log("Invalid userData for setup:", userData);
      return;
    }
    socket.join(userData._id);
    socket.emit("connected");
  });

  socket.on("join chat", (room) => {
    socket.join(room);
  });

  socket.on("new message", (newMessageReceived) => {
    var chat = newMessageReceived.chat;

    if (!chat.users) return console.log("chat.users not defined");

    chat.users.forEach((user) => {
      if (user._id == newMessageReceived.sender._id) return;

      socket.in(user._id).emit("message received", newMessageReceived);
    });
  });
});
