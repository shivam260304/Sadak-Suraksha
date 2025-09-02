const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const mongoose = require('mongoose');
const authRoutes = require('./routes/auth');
const reportRoutes = require('./routes/report');
const myReportRoutes = require('./routes/myreport');
const chatbotRoutes = require('./routes/chatbotRoutes');
const complaintsRoutes = require('./routes/complaints');
const path = require('path');
const fs = require('fs');
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}


app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api/auth', authRoutes);
app.use('/api/report', reportRoutes);
app.use('/api/myReport', myReportRoutes);
app.use('/api/chatbot', chatbotRoutes);
app.use('/uploads', express.static(uploadsDir));
app.use('/api/complaints', complaintsRoutes);

app.get("/", (req, res) => {
  res.send("Sadak Surakhsha Backend is running!");
});

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('MongoDB connected');
  app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });
})
.catch((err) => {
  console.error('MongoDB connection error:', err);
});
