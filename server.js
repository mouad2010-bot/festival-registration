/**
 * ==========================================================
 * Festival Registration System
 * Main Server
 * ==========================================================
 */

const express = require("express");
const session = require("express-session");
const SQLiteStore = require("connect-sqlite3")(session);
const path = require("path");

const app = express();

const PORT = process.env.PORT || 8080;

/* ==============================
   View Engine
============================== */

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

/* ==============================
   Static Files
============================== */

app.use(express.static(path.join(__dirname, "public")));

/* ==============================
   Body Parser
============================== */

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

/* ==============================
   Sessions
============================== */

app.use(

    session({

        store: new SQLiteStore({

            db: "sessions.db",

            dir: "./database"

        }),

        secret: "CHANGE_THIS_SECRET",

        resave: false,

        saveUninitialized: false,

        cookie: {

            maxAge: 1000 * 60 * 60 * 24

        }

    })

);

/* ==============================
   Routes
============================== */

const indexRoute = require("./routes/index");

const registerRoute = require("./routes/register");

const authRoute = require("./routes/auth");

const adminRoute = require("./routes/admin");

const qrRoute = require("./routes/qr");

/* ==============================
   Use Routes
============================== */

app.use("/", indexRoute);

app.use("/register", registerRoute);

app.use("/auth", authRoute);

app.use("/admin", adminRoute);

app.use("/qr", qrRoute);

/* ==============================
   404
============================== */

app.use((req, res) => {

    res.status(404).render("404");

});

/* ==============================
   Server
============================== */

app.listen(PORT, () => {

    console.log("");

    console.log("====================================");

    console.log("Festival Server Running");

    console.log("http://localhost:" + PORT);

    console.log("====================================");

    console.log("");

});