const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
const { ensureCounterExists } = require("./utils/counterUtil"); // Adjust the path as necessary

// Route imports
const forumsRoutes = require("./routes/forums.routes");
const forumThreadsRoutes = require("./routes/forum.threads.routes");
const upvoteByRoutes = require("./routes/upvotes.by.routes");
const threadRepliesRoutes = require("./routes/thread.replies.routes");
// Import other routes as needed
const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const dbName = process.env.MONGO_DB_NAME;
const fallbackDbUri = `${process.env.MONGODB_URI}/${dbName}`;

const connectWithFallback = async () => {
    try {
      console.log("Attempting to connect to Forum MongoDB");
      await mongoose.connect(fallbackDbUri);
      console.log('Connected to Forum MongoDB');
      initializeApp() 
    } catch (fallbackErr) {
      console.error(`MongoDB Forum connection error: ${fallbackErr}`);
    }
};

connectWithFallback()

// When the server starts
async function initializeApp() {
  await ensureCounterExists("forumCounter");
}

// Use Routes
app.use("/forums", forumsRoutes);
app.use("/threads", forumThreadsRoutes);
app.use("/upvotes", upvoteByRoutes);
app.use("/replies", threadRepliesRoutes);

module.exports = app;
