const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
// const cors = require("cors");
// const passport = require("passport");
const mongoose = require("mongoose");

const app = express();

// Set Static Folder
app.use(express.static(path.join(__dirname, "public")));

// Connect To Database
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useFindAndModify: false,
  useCreateIndex: true,
  useUnifiedTopology: true,
});

// On Connection
mongoose.connection.on("connected", () => {
  console.log("Connected to database " + process.env.MONGO_URI);
});

// On Error
mongoose.connection.on("error", (err) => {
  console.log("Database error " + err);
});

// Port number
const port = process.env.PORT || 3000;

// Maintenance Middleware
// app.use((req, res, next) => {
//   res.status(503).send("Site is currently down. Check back soon!");
// });

// Body Parse Middleware
app.use(bodyParser.json());

// // CORS Middleware
// app.use(
//   cors({
//     allowedHeaders: ["token", "Content-Type", "Authorization"],
//     exposedHeaders: ["token"],
//   })
// );

// // Passport Middleware
// app.use(passport.initialize());
// app.use(passport.session());

// require("./config/passport")(passport);

const users = require("./routes/users");
const products = require("./routes/products");
const cart = require("./routes/shoppingcart");

app.use("/users", users);
app.use("/products", products);
app.use("/cart", cart);

// 404 Page not found!
app.get("*", (req, res) => {
  res.send("404 Page not found!");
});

// Start serve
app.listen(port, () => {
  console.log("Server started on port: " + port);
});
