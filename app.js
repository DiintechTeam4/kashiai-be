const express = require("express");
const passport = require("passport");
const session = require("express-session");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const poojaRoutes = require("./routes/poojaRoutes");
const categoryProductRoutes = require("./routes/categoryProductRoutes");
const astroRoutes = require("./routes/astroRoutes");
const darshanRoutes = require("./routes/darshanRoutes");
const useraccountRoutes = require("./routes/useraccountRoute");
const userauthRoutes = require("./routes/userauthRoutes");
const ondemandpoojaRoutes = require("./routes/ondemandpoojaRoutes");
const cartProductRoutes = require("./routes/cartProductRoutes");

const addressRoutes = require("./routes/addressRoutes");

const cartPoojaRoutes = require("./routes/cartPoojaRoutes");

const poojaPaymentRoutes = require("./routes/poojaPaymentRoutes");

const productPaymentRoutes = require("./routes/productPaymentRoutes");

const poojaorderhistoryRoutes = require("./routes/poojaorderhistoryRoutes");

const productorderhistoryRoutes = require("./routes/productorderhistoryRoutes");

const paymentstatusRoutes = require("./routes/paymentstatusRoutes");

const feedbackRoutes = require("./routes/feedbackRoutes");

const adminuserRoutes = require("./routes/adminuserRoutes");

const bannerRoutes = require("./routes/bannerRoutes");
const sliderRoutes = require("./routes/sliderRoutes");
const supportRoutes = require("./routes/supportRoutes");

const adminRoutes = require("./routes/adminRoutes");

const admindetailRoutes = require("./routes/admindetailRoutes");

const chatRoutes = require("./routes/chatRoutes");

const voiceChatRoutes = require("./routes/voiceChatRoutes");

const yatraRoutes = require("./routes/yatraRoutes");

const creditPlanRoutes = require("./routes/creditPlanRoutes");

const creditPaymentRoutes = require("./routes/creditPaymentRoutes");

const creditorderhistoryRoutes = require("./routes/creditorderhistoryRoutes");

const userProfileRoutes = require("./routes/userProfileRoutes");

const panditRoutes = require("./routes/panditRoutes");

const userActionRoutes = require("./routes/userActionRoutes");

const cors = require("cors");
const fs = require("fs");
const path = require("path");

dotenv.config();

connectDB();

const app = express();
app.use(cors());
app.use(express.json());
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use("/api/user-actions", userActionRoutes);

app.use("/api/ondemand-pooja", ondemandpoojaRoutes);

app.use("/api/pandit", panditRoutes);
app.use("/api/credit-plans", creditPlanRoutes);
app.use("/api/user/chat", chatRoutes);
app.use("/api/user/voice", voiceChatRoutes);
app.use("/api/admin", admindetailRoutes);

app.use("/api/banner", bannerRoutes);
app.use("/api/slider", sliderRoutes);

app.use("/api/auth", authRoutes);
app.use("/api/poojas", poojaRoutes);
app.use("/api", categoryProductRoutes);
app.use("/api/astro", astroRoutes);
app.use("/api/darshan", darshanRoutes);
app.use("/api/yatras", yatraRoutes);

app.use("/api/user/auth", userauthRoutes);

app.use("/api/user/addresses", addressRoutes);

app.use("/api/user/settings", useraccountRoutes);

app.use("/api/products/cart", cartProductRoutes);

app.use("/api/poojas/cart", cartPoojaRoutes);

app.use("/api/payment/pooja", poojaPaymentRoutes);

app.use("/api/payment/product", productPaymentRoutes);

app.use("/api/payment/credit", creditPaymentRoutes);

app.use("/api/orderhistory/pooja", poojaorderhistoryRoutes);

app.use("/api/orderhistory/product", productorderhistoryRoutes);

app.use("/api/orderhistory/credit", creditorderhistoryRoutes);

app.use("/api/paymentstatus", paymentstatusRoutes);

app.use("/api/admin/usersection", userProfileRoutes);

app.use("/api/user/feedback", feedbackRoutes);

app.use("/api/support", supportRoutes);

app.use("/api/userstatus", adminRoutes);

app.use("/api/admin/user", adminuserRoutes);

app.get("/", (req, res) => {
  res.send("Kashi AI Backend is running!");
});

const uploadDir = path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
  console.log("Uploads directory created");
}

module.exports = app;
