const express = require("express");

var admin = require("./routes/admin");

const app = express();
const port = 3000;

app.get("/", (req, res) => {
    res.send("first app");
});

// Routing
app.use("/admin", admin);

app.listen(port, () => {
    console.log("Express listening on port", port);
});
