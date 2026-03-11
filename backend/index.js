const express = require("express");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");

dotenv.config();

const authroutes = require("./routes/auth.routes");
const messageroutes = require("./routes/message.routes");
const userroutes = require("./routes/user.routes");
const connection = require("./config/connection");

const app = express();

app.use(express.json());
app.use(cookieParser());

// static folder for images
app.use("/uploads", express.static("uploads"));

// database connect
connection();

const PORT = process.env.PORT || 3000;

app.use("/api/auth", authroutes);
app.use("/api/message",messageroutes);
app.use("/api/user",userroutes)

app.listen(PORT, () => {
  console.log(`Server Running on Port ${PORT}`);
});