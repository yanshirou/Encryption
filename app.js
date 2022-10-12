
require("dotenv").config();
const express = require("express");
const ejs = require("ejs");
const mongoose = require("mongoose");
const app = express();
const encrypt = require("mongoose-encryption");

app.set('view engine', 'ejs');
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

mongoose.connect("mongodb://localhost:27017/userDB");

const userSchema = new mongoose.Schema({
    email: String,
    password: String
});


//encryption
userSchema.plugin(encrypt, {secret: process.env.SECRET, encryptedFields: ['password']});



const User = mongoose.model("User", userSchema);



//router
app.get("/", (req, res) => {
    res.render("home");
})

app.get("/login", (req, res) => {
    res.render("login");
})

app.get("/register", (req, res) => {
    res.render("register");
})



app.post("/register", (req, res) => {
    const newUser = new User({
        email: req.body.username,
        password: req.body.password
    })
    newUser.save((err) => {
        if (err) {
            console.log(err);
        } else {
            res.render("secrets");
        }
    });

})

app.post("/login", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    
    User.findOne({ email: username }, (err, found) => {
        if (!err) {
            if (found) {
                if (found.password === password) {
                    res.render("secrets");
                } else {
                    res.send("Incorrect password");
                }
            } else {
                res.send("User not found.")
            }
        } else {
            console.log(err);
        }
    })
})



app.listen(3000, () => {
    console.log("Server running at port 3000");
});