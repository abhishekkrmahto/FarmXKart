const express = require("express");
const session = require("express-session");
const path = require("path");

const app = express();

// View engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// Static files
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));

// Sessions
app.use(
  session({
    secret: "farmxsecret",
    resave: false,
    saveUninitialized: true,
  })
);

// ------------------- ROUTES -------------------

let cart = []; // global cart (first version)

// Main pages
app.get("/", (req, res) => res.render("index"));
app.get("/login", (req, res) => res.render("login"));
app.get("/register", (req, res) => res.render("register"));
app.get("/profile", (req, res) => res.render("profile"));
app.get("/sell", (req, res) => res.render("sell"));
app.get("/shop", (req, res) => res.render("shop"));

// Add to cart (global array wala version)
app.post("/add-to-cart", (req, res) => {
  const { name, price, quantity, image } = req.body;
  cart.push({ name, price: Number(price), quantity: Number(quantity), image });
  res.redirect("/cartview");
});

// Cart view
app.get("/cartview", (req, res) => {
  let total = 0;
  cart.forEach((item) => (total += item.price));
  res.render("cart", { cart, total });
});

// Payment page
app.get("/payment", (req, res) => {
  const total = req.query.total;
  res.render("payment", { total });
});

// Govt schemes
app.get("/govtschemes", (req, res) => res.render("govtschemes"));

// Add to cart (session-based version)
app.post("/add-to-cart", (req, res) => {
  const { name, price, quantity } = req.body;

  if (!req.session.cart) req.session.cart = [];

  const existingItem = req.session.cart.find((item) => item.name === name);

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    req.session.cart.push({ name, price, quantity: 1 });
  }

  res.json({ success: true });
});

// Show cart
app.get("/cart", (req, res) => {
  const cart = req.session.cart || [];
  let total = 0;
  cart.forEach((item) => (total += item.price * item.quantity));
  res.render("cart", { cart, total });
});

// Orders
app.get("/myorders", (req, res) => {
  const orders = [
    {
      id: 1,
      item: "Apple",
      price: 300,
      quantity: 2,
      date: "2025-11-07",
      status: "Delivered",
    },
    {
      id: 2,
      item: "Carrot",
      price: 40,
      quantity: 5,
      date: "2025-11-05",
      status: "Pending",
    },
  ];
  res.render("myorders", { orders });
});

// Export for Vercel serverless
module.exports = app;
