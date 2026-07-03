/**
 * ==========================================================
 * Festival Registration System
 * File: routes/index.js
 * ==========================================================
 */

const express = require("express");
const router = express.Router();

const {

    getRemainingSeats

} = require("../database/database");

/**
 * ==========================================================
 * الصفحة الرئيسية
 * ==========================================================
 */

router.get("/", (req, res) => {

    getRemainingSeats((err, remainingSeats) => {

        if (err) {

            console.log(err);

            return res.status(500).send("Database Error");

        }

        res.render("index", {

            remainingSeats

        });

    });

});

module.exports = router;