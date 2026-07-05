/**
 * ==========================================================
 * Festival Registration System
 * File: routes/register.js
 * ==========================================================
 */

const express = require("express");

const axios = require("axios");

const router = express.Router();

const QRCode = require("qrcode");

const { v4: uuid } = require("uuid");


const {

    db,

    getRemainingSeats

} = require("../database/database");

/* ==========================================================
   صفحة التسجيل
========================================================== */

router.get("/", (req, res) => {

    getRemainingSeats((err, remainingSeats) => {

        if (err) {

            console.log(err);

            return res.sendStatus(500);

        }

        res.render("register", {

            remainingSeats,

            error: null

        });

    });

});

router.get("/en", (req, res) => {

    getRemainingSeats((err, remainingSeats) => {

        if (err) {

            return res.sendStatus(500);

        }

        res.render("register-en", {

            remainingSeats,

            error: null

        });

    });

});

router.get("/fr", (req, res) => {

    getRemainingSeats((err, remainingSeats) => {

        if (err) {

            return res.sendStatus(500);

        }

        res.render("register-fr", {

            remainingSeats,

            error: null

        });

    });

});

/* ==========================================================
   استقبال التسجيل
========================================================== */

router.post("/", async (req, res) => {

    try {

        const {

    fullName,

    email,

    phone,

    city,

    age,

    gender,

    lang

} = req.body;

        /* ===========================
           تحقق من العدد
        =========================== */

        db.get(

            "SELECT COUNT(*) AS total FROM registrations",

            async (err, row) => {

                if (err) {

                    return res.sendStatus(500);

                }

                if (row.total >= 500) {

                    return res.render("register", {

                        remainingSeats: 0,

                        error: "اكتمل العدد."

                    });

                }

                /* ===========================
                   إنشاء Ticket ID
                =========================== */

                const ticketId =

                    "HW-" +

                    uuid()

                        .replace(/-/g, "")

                        .substring(0, 12)

                        .toUpperCase();

                /* ===========================
                   إنشاء QR
                =========================== */

                const qrCode = await QRCode.toDataURL(ticketId);

                /* ===========================
                   حفظ البيانات
                =========================== */

                db.run(

                    `
                    INSERT INTO registrations (

                        fullName,

                        email,

                        phone,

                        city,

                        age,

                        gender,

                        ticketId,

                        qrCode

                    )

                    VALUES (?,?,?,?,?,?,?,?)

                    `,

                    [

                        fullName,

                        email,

                        phone,

                        city,

                        age,

                        gender,

                        ticketId,

                        qrCode

                    ],

                    function (err) {

                        if (err) {

                            console.log(err);

                            return res.render("register", {

                                remainingSeats: 500,

                                error: "حدث خطأ أثناء التسجيل."

                            });

                        }

                        if (lang === "en") {

    return res.redirect("/register/en/success/" + ticketId);

    }

          if (lang === "fr")  {

                        return res.redirect("/register/fr/success/" + ticketId);

                    }

                        return res.redirect("/register/success/" + ticketId);

                    }

                );

            }

        );

    }

    catch (err) {

        console.log(err);

        res.sendStatus(500);

    }

});

/* ==========================================================
   صفحة نجاح التسجيل
========================================================== */

/* ==========================================================
   صفحة نجاح التسجيل (العربية)
========================================================== */

router.get("/success/:ticketId", (req, res) => {

    db.get(

        "SELECT * FROM registrations WHERE ticketId = ?",

        [req.params.ticketId],

        (err, participant) => {

            if (err || !participant) {

                return res.redirect("/");

            }

            res.render("success", {

                participant

            });

        }

    );

});

/* ==========================================================
   Success Page (English)
========================================================== */

router.get("/en/success/:ticketId", (req, res) => {

    db.get(

        "SELECT * FROM registrations WHERE ticketId = ?",

        [req.params.ticketId],

        (err, participant) => {

            if (err || !participant) {

                return res.redirect("/en");

            }

            res.render("success-en", {

                participant

            });

        }

    );

});

/* ==========================================================
   Page de succès (Français)
========================================================== */

router.get("/fr/success/:ticketId", (req, res) => {

    db.get(

        "SELECT * FROM registrations WHERE ticketId = ?",

        [req.params.ticketId],

        (err, participant) => {

            if (err || !participant) {

                return res.redirect("/fr");

            }

            res.render("success-fr", {

                participant

            });

        }

    );

});

module.exports = router;