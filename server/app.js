const express = require("express");
const nunjucks = require("nunjucks");
const logger = require("morgan");
const bodyParser = require("body-parser");

// DB
const db = require("./models");
db.sequelize
    .authenticate()
    .then(() => {
        console.log("Connection has been established successfully.");
        return db.sequelize.sync();
    })
    .then(() => {
        console.log("DB Sync complete");
    })
    .catch((err) => {
        console.log("Unable to connect to the database:", err);
    });

var admin = require("./routes/admin");

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

app.get("/", (req, res) => {
    res.send("first app");
});

// Routing
app.use("/admin", admin);

app.listen(port, () => {
    console.log("Express listening on port", port);
});
