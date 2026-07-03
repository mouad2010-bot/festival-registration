const express = require("express");
const router = express.Router();

const { db } = require("../database/database");

// ==============================
// Middleware
// ==============================

function requireAdmin(req, res, next) {

    if (!req.session.admin) {

        return res.redirect("/admin/login");

    }

    next();

}

// ==============================
// Dashboard
// ==============================

router.get("/", requireAdmin, (req, res) => {

    db.all(

        "SELECT * FROM registrations ORDER BY id DESC",

        [],

        (err, participants) => {

            if (err) return res.send(err.message);

            db.get(

                "SELECT COUNT(*) AS total FROM registrations",

                [],

                (err2, totalRow) => {

                    db.get(

                        "SELECT COUNT(*) AS used FROM registrations WHERE used=1",

                        [],

                        (err3, usedRow) => {

                            res.render("dashboard", {

                                participants,

                                total: totalRow.total,

                                used: usedRow.used,

                                remaining: 500 - totalRow.total

                            });

                        }

                    );

                }

            );

        }

    );

});

// ==============================
// Participant Details
// ==============================

router.get("/participant/:id", requireAdmin, (req, res) => {

    db.get(

        "SELECT * FROM registrations WHERE id=?",

        [req.params.id],

        (err, participant) => {

            if (!participant)

                return res.redirect("/admin");

            res.render(

                "participant-details",

                {

                    participant

                }

            );

        }

    );

});

// ==============================
// Edit Page
// ==============================

router.get("/edit/:id", requireAdmin, (req, res) => {

    db.get(

        "SELECT * FROM registrations WHERE id=?",

        [req.params.id],

        (err, participant) => {

            if (!participant)

                return res.redirect("/admin");

            res.render(

                "edit-participant",

                {

                    participant

                }

            );

        }

    );

});

// ==============================
// Save Edit
// ==============================

router.post("/edit/:id", requireAdmin, (req, res) => {

    const {

        fullName,

        email,

        phone,

        city,

        age,

        gender

    } = req.body;

    db.run(

        `UPDATE registrations
         SET fullName=?,
             email=?,
             phone=?,
             city=?,
             age=?,
             gender=?
         WHERE id=?`,

        [

            fullName,

            email,

            phone,

            city,

            age,

            gender,

            req.params.id

        ],

        () => {

            res.redirect("/admin");

        }

    );

});

// ==============================
// Delete
// ==============================

router.post("/delete/:id", requireAdmin, (req, res) => {

    db.run(

        "DELETE FROM registrations WHERE id=?",

        [req.params.id],

        () => {

            res.redirect("/admin");

        }

    );

});

// ==============================
// Export CSV
// ==============================

router.get("/export", requireAdmin, (req, res) => {

    db.all(

        "SELECT * FROM registrations",

        [],

        (err, rows) => {

            let csv =

                "ID,Name,Email,Phone,City,Age,Gender,Ticket,Used\n";

            rows.forEach(row => {

                csv +=

`${row.id},"${row.fullName}","${row.email}","${row.phone}","${row.city}",${row.age},"${row.gender}","${row.ticketId}",${row.used}\n`;

            });

            res.header(

                "Content-Type",

                "text/csv"

            );

            res.attachment(

                "registrations.csv"

            );

            res.send(csv);

        }

    );

});

module.exports = router;