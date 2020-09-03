const express = require("express");
const nunjucks = require("nunjucks");
const logger = require("morgan");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const path = require("path");
var dotenv = require("dotenv");

// flash 메시지 관련
const flash = require("connect-flash");

// passport 로그인 관련
const passport = require("passport");
const session = require("express-session");

// DB
const db = require("./models");
db.sequelize
    .authenticate()
    .then(() => {
        console.log("Connection has been established successfully.");
        return db.sequelize.sync();
        // return db.sequelize.drop();
    })
    .then(() => {
        console.log("DB Sync complete");
    })
    .catch((err) => {
        console.log("Unable to connect to the database:", err);
    });

var admin = require("./routes/admin");
const accounts = require("./routes/accounts");

const app = express();
const port = 8080;

nunjucks.configure("server/template", {
    autoescape: true,
    express: app,
});

// MiddleWare
app.use(logger("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// 업로드 path 추가
app.use("/uploads", express.static(path.resolve(__dirname, "uploads")));

//session 관련 셋팅
app.use(
    session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: true,
        cookie: {
            maxAge: 2000 * 60 * 60, //지속시간 2시간
        },
    })
);

//passport 적용
app.use(passport.initialize());
app.use(passport.session());

//플래시 메시지 관련
app.use(flash());

app.get("/", (req, res) => {
    res.send("first app");
});

// Routing
app.use("/admin", admin);
app.use("/accounts", accounts);

app.listen(port, () => {
    console.log("Express listening on port", port);
});
