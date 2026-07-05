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

router.get("/change-account", (req, res) => {

    res.render("change-account");

});

/* ==========================================================
   تغيير بيانات المدير
========================================================== */

router.post("/change-account", async (req, res) => {

    const {

        currentPassword,

        newUsername,

        newPassword

    } = req.body;

    db.get(

        "SELECT * FROM admins LIMIT 1",

        async (err, admin) => {

            if (err) {

                return res.sendStatus(500);

            }

            const match = await bcrypt.compare(

                currentPassword,

                admin.password

            );

            if (!match) {

                return res.send("كلمة المرور الحالية غير صحيحة.");

            }

            // إذا ترك اسم المستخدم فارغ يبقى القديم
            const username = newUsername && newUsername.trim() !== ""
                ? newUsername.trim()
                : admin.username;

            // إذا ترك كلمة المرور فارغة تبقى القديمة
            let passwordHash = admin.password;

            if (newPassword && newPassword.trim() !== "") {

                passwordHash = await bcrypt.hash(

                    newPassword,

                    10

                );

            }

            db.run(

                `
                UPDATE admins

                SET

                username = ?,

                password = ?

                WHERE id = ?
                `,

                [

                    username,

                    passwordHash,

                    admin.id

                ],

                (err) => {

                    if (err) {

                        console.log(err);

                        return res.send("حدث خطأ أثناء تحديث البيانات.");

                    }

                    // تحديث اسم المستخدم داخل الـ Session
                    req.session.admin.username = username;

                    res.send("تم تحديث بيانات الإدارة بنجاح.");

                }

            );

        }

    );

});


module.exports = router;