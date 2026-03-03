require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const postRoutes = require('./routes/postRoutes');

const app = express();

// Middleware to parse JSON
app.use(express.json());
app.use(cors());

// Use post routes
app.use('/api/posts', postRoutes);




const tempURI = "mongodb+srv://t687959_db_user:HyDtH3C81F1EP7n@cluster1.ozosmjt.mongodb.net/?appName=Cluster1";

mongoose.connect(tempURI)
  .then(() => console.log("Database connected successfully!"))
  .catch((err) => console.log("Connection error:", err));

app.get("/", (req, res) => {
  res.send("API is running...");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});