var express = require("express");
var bodyParser = require("body-parser");
var cookieParser = require("cookie-parser");
var session = require("express-session");
var morgan = require("morgan");
var app = express();
const User = require('./models/User')
const Order=require('./models/Order')


//const admincontrol=require('./admincontrol')
app.set('view engine', 'ejs');

var path = require('path');
const { db } = require("./models/User");
app.use(express.static(path.join(__dirname, '/public/')));

// set our application port
app.set("port", 4000);

app.use(bodyParser.urlencoded({ extended: true }))
app.use(cookieParser())
app.use(
    session({
        key: 'user_sid',
        secret: "Randi",
        resave: false,
        saveUninitialized: false,
        cookie: {
            expires: 600000000
        }
    })
)

app.use((req, res, next) => {
    if (req.session.user && req.cookies.user_id) {
        res.redirect('/dashboard')
    }
    next()
})

var sessionChecker = (req, res, next) => {
    if (req.session.user && req.cookies.user_id) {
        res.redirect('/dashboard')
    }
    else {
        next()
    }
}

app.get("/", sessionChecker, (req, res) => {
    res.redirect("/login");
})

//login r

app
    .route("/login")
    .get(sessionChecker, (req, res) => {
        res.sendFile(__dirname + "/public/login.html");
    })
    .post(async (req, res) => {
        var username = req.body.username,
            password = req.body.password;
            if(username==="avi@admin"){
                res.redirect("admin.ejs")
            }


        try {
            var user = await User.findOne({ username: username }).exec();
            if (!user) {
                res.redirect("/login");
            }
            user.comparePassword(password, (error, match) => {
                if (!match) {
                    res.redirect("/login");
                }
            });
            req.session.user = user;
            res.redirect("/dashboard");
        } catch (error) {
            console.log(error)
        }
    });
//sign r
app
    .route("/signup")
    .get(sessionChecker, (req, res) => {
        res.sendFile(__dirname + "/public/signup.html");
    })
    .post((req, res) => {
        var user = new User({
            username: req.body.username,
            email: req.body.email,
            password: req.body.password,
        });
        user.save((err, docs) => {
            if (err) {
                res.redirect("/signup");
            } else {
                console.log(docs)
                req.session.user = docs;
                res.redirect("/dashboard");
            }
        });
    });

//dashy r

app.get("/dashboard", (req, res) => {
    if (req.session.user && req.cookies.user_sid) {
        res.sendFile(__dirname + "/public/dashboard.html");
    } else {
        res.redirect("/login");
    }
})

//logy not

app.get("/logout", (req, res) => {
    if (req.session.user && req.cookies.user_sid) {
        res.clearCookie("user_sid");
        res.redirect("/");
    } else {
        res.redirect("/login");
    }
});

//guitar form

app
    .route("/")
    .get(sessionChecker, (req, res) => {
        res.sendFile(__dirname + "/public/dasboard.html");
    })
    .post((req, res) => {
        var order = new Order({
            uname: req.body.nam,
            email: req.body.email,
            imodel: req.body.imodel,
        });
        order.save((err,docs) => {

            if (err) {
                console.log(err)
                res.redirect("/signup");
            } else {
                console.log(docs)
                res.redirect("/dashboard");
            }
        })
    });
//admin routes
app.get('/admin.ejs',(req, res) => {
    Order.find({}, function(err, movies) {
        res.render('admin.ejs', {
            moviesList: movies
        })
    })
})
app.post('/admin.ejs',(req,res)=>{
    if(req.body.orderid){
    db.collection("orders").deleteOne({ "uname" : req.body.orderid })
    res.redirect('/admin.ejs')
    }
    else{
        res.redirect('/login')
    }
})
app.listen(app.get("port"), () =>
    console.log(`App started on port ${app.get("port")}`)
);