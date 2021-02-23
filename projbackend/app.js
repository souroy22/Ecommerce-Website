require("dotenv").config();
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const PORT = process.env.PORT || 8000;
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors");

// routes
const authRoute = require("./routes/auth");
const userRoute = require("./routes/user");
const categoryRoute = require("./routes/category");
const productRoute = require("./routes/product");
const orderRoute = require("./routes/order");
const stripeRoutes = require("./routes/stripepayment");

// Connecting to the database(MongoDB)
mongoose
  .connect(process.env.DATABASE, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.log("MongoDb Connection Error ", err));

// Middlewares
app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors());

app.get("/", (req, res) => {
  res.send("Hello Programmer");
});

app.use("/api", authRoute);
app.use("/api", userRoute);
app.use("/api", categoryRoute);
app.use("/api", productRoute);
app.use("/api", orderRoute);
app.use("/api", stripeRoutes);

// Connection to the Server
app.listen(PORT, (err) => {
  if (err) {
    console.log("Error while listining the Port");
    return;
  }
  console.log("Server is running on Port", PORT);
});
