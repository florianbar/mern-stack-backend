const fs = require("fs");
const path = require("path");

const express = require("express");
const bodyParser = require("body-parser");
// const mongoose = require("mongoose");

const placesRoutes = require("./routes/places-routes");
const usersRoutes = require("./routes/users-routes");
const HttpError = require("./models/http-error");

const app = express();

app.use(bodyParser.json());

// Serve static files from the uploads folder
app.use("/uploads/images", express.static(path.join("uploads", "images")));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*"); // allow any domain to send requests
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization" // allow these headers
  );
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE"); // allow these methods
  next();
});

app.get("/", (req, res) => {
  res.send("Express on Vercel" + process.env.PORT + process.env.MONGODB_URI);
});
// app.use("/api/places", placesRoutes);
// app.use("/api/users", usersRoutes);

app.use((req, res, next) => {
  const error = new HttpError("Could not find this route.", 404);
  throw error;
});

app.use((error, req, res, next) => {
  // Rollback file upload if an error occurred
  if (req.file) {
    fs.unlink(req.file.path, (err) => {
      console.log(err);
    });
  }
  if (res.headerSent) {
    return next(error);
  }
  res.status(error.code || 500);
  res.json({ message: error.message || "An unknown error occurred!" });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
// FLO TODO: Uncomment this code and remove the above code to connect to the database
// mongoose
//   .connect(
//     process.env.MONGODB_URI ||
//       `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.pvm3scx.mongodb.net/${process.env.DB_NAME}`
//   )
//   .then(() => {
//     app.listen(process.env.PORT || 5000);
//   })
//   .catch((error) => {
//     console.log(error);
//   });

module.exports = app;
