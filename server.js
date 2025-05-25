const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");

require("dotenv").config();

app.use(cors());
app.use(cookieParser());
app.use(express.json());

app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});
process.env.TZ = "Asia/Ho_Chi_Minh";
console.log("Server timezone set to:", process.env.TZ);

// Sử dụng biến môi trường cho chuỗi kết nối MongoDB
const db = process.env.MONGODB_URI;
mongoose
  .connect(db, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  })
  .then(() => console.log("MongoDB Connected...."))
  .catch((err) => console.log("MongoDB Connection Error:", err));

app.use("/uploads", express.static("uploads"));
app.use("/api/account", require("./routers/Account"));
app.use("/api/recruitment", require("./routers/Recruitment"));
app.use("/api/city", require("./routers/City"));
app.use("/api/career", require("./routers/Career"));
app.use("/api/profile", require("./routers/Profile"));
app.use("/api/cv", require("./routers/CV"));
app.use("/api/admin", require("./routers/Admin"));
app.use("/api/subscription-package", require("./routers/SubscriptionPackage"));
app.use(
  "/api/purchased-subscription",
  require("./routers/PurchasedSubscription")
);
app.use("/api/payment", require("./payment"));

if (process.env.NODE_ENV === "production") {
  app.use(express.static("./client/build"));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "./client", "build", "index.html"));
  });
}

// Sử dụng biến môi trường cho PORT
const PORT = process.env.PORT || 8000;
app.listen(PORT, console.log(`Server Run With Port ${PORT}`));
