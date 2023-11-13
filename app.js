const express = require("express");
const path = require("path")
const app = express();
// const dotenv = require("dotenv").config();
const cookieParser = require("cookie-parser");
const port = 4000;
app.use(express.static("public"));
app.use(express.urlencoded({ extended: false }))
app.use(express.json());
app.use(cookieParser());
app.set('views', path.join(__dirname , 'views'));
app.set('view engine', 'ejs');

// Define Routes
app.use('/', require('./routes/pages'));
app.use('/auth', require('./routes/auth'));


app.listen(port, () => {
    console.log("App listenting on port " + port)
});