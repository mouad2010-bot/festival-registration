/**
 * ==========================================================
 * Festival Registration System
 * File: routes/auth.js
 * ==========================================================
 */

const express = require("express");
const bcrypt = require("bcrypt");

const router = express.Router();

const { db } = require("../database/database");

/* ==========================================================
   صفحة تسجيل الدخول
========================================================== */

router.get("/login", (req, res) => {

    res.render("admin-login", {

        error: null

    });

});

/* ==========================================================
   تسجيل الدخول
========================================================== */

router.post("/login", (req, res) => {

    const {

        username,

        password

    } = req.body;

    db.get(

        `
        SELECT *

        FROM admins

        WHERE username = ?
        `,

        [

            username

        ],

        async (err, admin) => {

            if (err) {

                console.log(err);

                return res.sendStatus(500);

            }

            if (!admin) {

                return res.render(

                    "admin-login",

                    {

                        error: "اسم المستخدم أو كلمة المرور غير صحيحة."

                    }

                );

            }

            const match = await bcrypt.compare(

                password,

                admin.password

            );

            if (!match) {

                return res.render(

                    "admin-login",

                    {

                        error: "اسم المستخدم أو كلمة المرور غير صحيحة."

                    }

                );

            }

            req.session.admin = {

                id: admin.id,

                username: admin.username

            };

            res.redirect("/admin");

        }

    );

});

/* ==========================================================
   تسجيل الخروج
========================================================== */

router.get("/logout", (req, res) => {

    req.session.destroy(() => {

        res.redirect("/auth/login");

    });

});

module.exports = router;