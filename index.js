require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyparser = require("body-parser");
const http = require("http");
const mongoose = require("mongoose")
const app = express();
const PORT = 4000;
const apiRouter = require('./routes')

app.use(cors());
app.use(bodyparser.urlencoded({ extended: true }));
app.use(bodyparser.json({ limit: '50mb', extended: true }));

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    if ('OPTIONS' == req.method) {
        res.sendStatus(200);
    } else {
        next();
    }
});
app.use('/', apiRouter)

let server = http.createServer(app)

//config database
const database = require("./config/db");
mongoose.Promise = global.Promise;
mongoose.set("strictQuery", false);

// connecting to database
mongoose.connect(database.DB, {
    useNewUrlParser: true
}).then(() => {
    console.log("Successfully connected to the database")
}).catch(err => {
    console.log('Could not connect to the database. Exiting now...', err);
    process.exit();
})

server.listen(PORT, '0.0.0.0', function () {
    console.log("Express https server listening on *:" + PORT);
})