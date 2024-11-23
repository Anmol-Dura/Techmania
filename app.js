var express = require("express");
var mongoose = require("mongoose");
var path = require("path");
var bodyParser = require("body-parser");
var session = require("express-session");

var app = express();

// Body parser middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Session settings
app.use(
  session({
    secret: "TechManiaKey123",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
  })
);

// Static files
app.use(express.static(path.join(__dirname, "public")));

// Set views and template engine
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// MongoDB connection
mongoose.connect("mongodb://127.0.0.1:27017/techmania", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", function () {
  console.log("We are connected to MongoDB...");
});

// Authentication middleware
function isAuthenticated(req, res, next) {
  if (req.session && req.session.username) {
    return next();
  }
  req.session.errorMessage = "Please Login!";
  return res.redirect("/");
}

// Import controllers
const userController = require("./controllers/userController");

// Log each request
app.use((req, res, next) => {
  console.log(`Request received: ${req.method} ${req.url}`);
  next();
});

// Routes
app.get("/", userController.homepage);

// Specific routes for options and CRUD operations
app.get("/options", (req, res) => {
  res.render("options");
});
app.get("/seeAllProducts", (req, res) => {
  res.render("seeAllProducts");
});
app.get("/addProduct", (req, res) => {
  res.render("addProduct");
});
app.get("/updateProduct", (req, res) => {
  res.render("updateProduct");
});
app.get("/deleteProduct", (req, res) => {
  res.render("deleteProduct");
});

// Wildcard routes (must be at the end to avoid conflicts)
app.get("/:file", isAuthenticated, (req, res, next) => {
  const filePath = path.join(__dirname, "views", `${req.params.file}.ejs`);
  if (require("fs").existsSync(filePath)) {
    res.render(req.params.file);
  } else {
    next();
  }
});

app.get("/:folder/:file", isAuthenticated, (req, res, next) => {
  const filePath = path.join(
    __dirname,
    "views",
    req.params.folder,
    `${req.params.file}.ejs`
  );
  if (require("fs").existsSync(filePath)) {
    res.render(`${req.params.folder}/${req.params.file}`);
  } else {
    next();
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).render("500", { error: err });
});

// 404 handler for unmatched routes
app.use((req, res) => {
  res.status(404).render("404", { url: req.url });
});

// Start the server
app.listen(3000, () => {
  console.log("Server running on http://localhost:3000/");
});
