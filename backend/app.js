
const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const cookieparser = require("cookie-parser");
const Blog = require('./models/blog')
const userRoute = require("./routes/user");
const blogRoute = require("./routes/blog");


const { checkForAuthenticationCookie } = require("./middlewares/authentication");
const app = express();


const PORT = 8004;
mongoose.connect("mongodb://127.0.0.1:27017/palka-blog").then(e => console.log("mongoDB connected"));
//form middleware
app.use(express.urlencoded({ extended: false }));
app.use(cookieparser());
app.use(checkForAuthenticationCookie("token"));
app.use(express.static(path.resolve("./public")));
//setting the view engine
app.set('view engine', 'ejs');
//to set the path we have to require the path
app.set("views", path.resolve("./views"));

//creating a simple route
app.get("/", async (req, res) => {
  const allblogs = await Blog.find({});
  res.render("home", {
    user: req.user,
    blogs: allblogs,
  });
})
app.use("/user", userRoute);
app.use("/blog", blogRoute);
app.listen(PORT, () => console.log(`server started at PORT:${PORT}`));
