const express = require("express");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const cors = require("cors");

dotenv.config();

const authroutes = require("./routes/auth.routes");
const messageroutes = require("./routes/message.routes");
const userroutes = require("./routes/user.routes");

const connection = require("./config/connection");

const app = express();

// CORS configuration
app.use(cors({
  origin: true,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(cookieParser());

// static folder for images
app.use("/uploads", express.static("uploads"));

// database connect
connection();

const PORT = process.env.PORT || 3000;

app.use("/api/auth", authroutes);
app.use("/api/messages", messageroutes);
app.use("/api/users", userroutes);

app.listen(PORT, () => {
  console.log(`Server Running on Port ${PORT}`);
});