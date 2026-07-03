/**
 * ==========================================================
 * Festival Registration System
 * File: routes/qr.js
 * ==========================================================
 */

const express = require("express");
const router = express.Router();

const {

    findTicket,
    useTicket

} = require("../database/database");

/* ==========================================================
   Middleware
========================================================== */

function isAdmin(req, res, next) {

    if (!req.session.admin) {

        return res.redirect("/auth/login");

    }

    next();

}

/* ==========================================================
   صفحة قارئ QR
========================================================== */

router.get("/", isAdmin, (req, res) => {

    res.render("qr-scanner");

});

/* ==========================================================
   التحقق من التذكرة
========================================================== */

router.post("/check", isAdmin, (req, res) => {

    const { ticketId } = req.body;

    if (!ticketId) {

        return res.json({

            success: false,

            status: "invalid",

            message: "لم يتم إرسال رقم التذكرة."

        });

    }

    findTicket(ticketId, (err, participant) => {

        if (err) {

            console.log(err);

            return res.json({

                success: false,

                status: "error",

                message: "خطأ في قاعدة البيانات."

            });

        }

        /* ==========================
           غير موجودة
        ========================== */

        if (!participant) {

            return res.json({

                success: false,

                status: "invalid",

                message: "التذكرة غير صالحة."

            });

        }

        /* ==========================
           مستخدمة
        ========================== */

        if (participant.used === 1) {

            return res.json({

                success: false,

                status: "used",

                message: "تم استخدام هذه التذكرة مسبقًا.",

                participant

            });

        }

        /* ==========================
           السماح بالدخول
        ========================== */

        useTicket(ticketId, (err) => {

            if (err) {

                console.log(err);

                return res.json({

                    success: false,

                    status: "error",

                    message: "تعذر تحديث حالة التذكرة."

                });

            }

            participant.used = 1;
            participant.checkInTime = new Date().toISOString();

            return res.json({

                success: true,

                status: "valid",

                message: "تم السماح بالدخول.",

                participant

            });

        });

    });

});

module.exports = router;