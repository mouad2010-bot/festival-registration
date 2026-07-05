/**
 * ==========================================================
 * Festival Registration System
 * File: database/database.js
 * ==========================================================
 */

const sqlite3 = require("sqlite3").verbose();
const path = require("path");

// ==========================================================
// إنشاء قاعدة البيانات
// ==========================================================

const databasePath = path.join(
    __dirname,
    "festival.db"
);

const db = new sqlite3.Database(databasePath, (err) => {

    if (err) {

        console.log(err);

    } else {

        console.log("SQLite Connected");

    }

});

// ==========================================================
// جدول المشاركين
// ==========================================================

db.serialize(() => {

    db.run(

        `
        CREATE TABLE IF NOT EXISTS registrations (

            id INTEGER PRIMARY KEY AUTOINCREMENT,

            fullName TEXT NOT NULL,

            email TEXT UNIQUE NOT NULL,

            phone TEXT NOT NULL,

            city TEXT NOT NULL,

            age INTEGER NOT NULL,

            gender TEXT NOT NULL,

            ticketId TEXT,

            qrCode TEXT,

            used INTEGER DEFAULT 0,

            checkInTime TEXT,

            createdAt DATETIME DEFAULT CURRENT_TIMESTAMP

        )
        `

    );

});

// ==========================================================
// جدول المدير
// ==========================================================

db.serialize(() => {

    db.run(

        `
        CREATE TABLE IF NOT EXISTS admins (

            id INTEGER PRIMARY KEY AUTOINCREMENT,

            username TEXT UNIQUE,

            password TEXT

        )
        `

    );

});

// ==========================================================
// إنشاء حساب المدير لأول مرة
// ==========================================================

const bcrypt = require("bcrypt");

db.get(

    `
    SELECT *
    FROM admins
    LIMIT 1
    `,

    async (err, admin) => {

        if (err) {

            return console.log(err);

        }

        if (!admin) {

            const passwordHash =
                await bcrypt.hash(

                    "123qwerasd",

                    10

                );

            db.run(

                `
                INSERT INTO admins (

                    username,

                    password

                )

                VALUES (?,?)
                `,

                [

                    "identities.festival",

                    passwordHash

                ]

            );

            console.log("");

            console.log("================================");

            console.log("Admin Created");

            console.log("Username : identities.festival");

            console.log("Password : 123qwerasd");

            console.log("================================");

            console.log("");

        }

    }

);

// ==========================================================
// عدد المسجلين
// ==========================================================

function getTotalRegistrations(callback){

    db.get(

        `
        SELECT COUNT(*) AS total
        FROM registrations
        `,

        (err,row)=>{

            if(err){

                return callback(err);

            }

            callback(

                null,

                row.total

            );

        }

    );

}

// ==========================================================
// عدد التذاكر المستخدمة
// ==========================================================

function getUsedTickets(callback){

    db.get(

        `
        SELECT COUNT(*) AS total

        FROM registrations

        WHERE used = 1
        `,

        (err,row)=>{

            if(err){

                return callback(err);

            }

            callback(

                null,

                row.total

            );

        }

    );

}

// ==========================================================
// الأماكن المتبقية
// ==========================================================

function getRemainingSeats(callback){

    getTotalRegistrations(

        (err,total)=>{

            if(err){

                return callback(err);

            }

            callback(

                null,

                500-total

            );

        }

    );

}

// ==========================================================
// البحث بواسطة Ticket ID
// ==========================================================

function findTicket(ticketId,callback){

    db.get(

        `
        SELECT *

        FROM registrations

        WHERE ticketId = ?
        `,

        [

            ticketId

        ],

        callback

    );

}

// ==========================================================
// تحديث حالة التذكرة
// ==========================================================

function useTicket(ticketId,callback){

    db.run(

        `
        UPDATE registrations

        SET

        used = 1,

        checkInTime = datetime('now')

        WHERE ticketId = ?
        `,

        [

            ticketId

        ],

        callback

    );

}

// ==========================================================
// التصدير
// ==========================================================

module.exports={

    db,

    getTotalRegistrations,

    getUsedTickets,

    getRemainingSeats,

    findTicket,

    useTicket

};