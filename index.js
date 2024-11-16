const express = require("express");
const path = require("path");
const userModel = require("./models/user.js");
const mongo = require("mongoose")
const userRoutes = require("./routes/userRoutes.js")
const blogRoute = require("./routes/blogRoutes.js");
const cookieParser = require("cookie-parser");
const checkUserAuthentication = require("./middlewares/auth.js");

const app = express();

mongo.connect("mongodb://127.0.0.1:27017/blogify")
.then(() => console.log("DATABASE CONNECTED"));

app.set("view engine","ejs");
app.set("views", path.resolve("./views"));
app.use(express.urlencoded({extended:false}));
app.use(express.static(path.resolve("./public")));
app.use(cookieParser());
app.use(checkUserAuthentication("uid"));


app.use("/",userRoutes);

app.use("/blog",blogRoute);

app.use(express.static(path.join(__dirname, 'public')));




app.listen("8000",() => console.log("Server started"));