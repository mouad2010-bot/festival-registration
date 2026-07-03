/**
 * ==========================================================
 * Festival Registration System
 * File: routes/register.js
 * ==========================================================
 */

const express = require("express");

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

            gender

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

                        res.redirect(

                            "/register/success/" +

                            ticketId

                        );

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

router.get(

    "/success/:ticketId",

    (req, res) => {

        db.get(

            `

            SELECT *

            FROM registrations

            WHERE ticketId = ?

            `,

            [

                req.params.ticketId

            ],

            (err, participant) => {

                if (err || !participant) {

                    return res.redirect("/");

                }

                res.render(

                    "success",

                    {

                        participant

                    }

                );

            }

        );

    }

);

module.exports = router;