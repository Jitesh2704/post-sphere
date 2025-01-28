const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
const { ensureCounterExists } = require("./utils/counterUtil"); // Ensure the path is correct

// Route imports
const postRoutes = require("./routes/posts.routes");
const userPostRoutes = require("./routes/userPosts.routes");
const userCollectionRoutes = require("./routes/userCollections.routes");
const postLikeRoutes = require("./routes/postLikes.routes");

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const dbName = process.env.MONGO_DB_NAME;
const fallbackDbUri = `${process.env.MONGODB_URI}/${dbName}`;


const connectWithFallback = async () => {
    try {
      console.log("Attempting to connect to Post MongoDB");
      await mongoose.connect(fallbackDbUri);
      console.log('Connected to Post MongoDB');
      initializeApp() 
    } catch (fallbackErr) {
      console.error(`MongoDB Post connection error: ${fallbackErr}`);
    }
};

connectWithFallback()

// When the server starts
async function initializeApp() {
  await ensureCounterExists("postCounter");
}

// Use routes
app.use("/posts", postRoutes);
app.use("/userPosts", userPostRoutes);
app.use("/userCollections", userCollectionRoutes);
app.use("/postLikes", postLikeRoutes);

module.exports = app;
