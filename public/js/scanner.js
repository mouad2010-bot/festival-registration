/**
 * ==========================================================
 * Festival Registration System
 * File: public/js/scanner.js
 * ==========================================================
 */

const resultBox = document.getElementById("scanResult");

let scanner;

/* ==========================================================
   عرض النتيجة
========================================================== */

function showResult(type, message) {

    if (!resultBox) return;

    resultBox.className = "scan-result";

    switch (type) {

        case "valid":

            resultBox.classList.add("qr-valid");

            break;

        case "used":

            resultBox.classList.add("qr-used");

            break;

        default:

            resultBox.classList.add("qr-invalid");

    }

    resultBox.innerHTML = message;

}

/* ==========================================================
   تشغيل صوت
========================================================== */

function playBeep(success = true) {

    const audio = new Audio(

        success
            ? "/sounds/success.mp3"
            : "/sounds/error.mp3"

    );

    audio.play().catch(() => {});

}

/* ==========================================================
   إرسال Ticket ID إلى الخادم
========================================================== */

async function verifyTicket(ticketId) {

    try {

        const response = await fetch(

            "/qr/check",

            {

                method: "POST",

                headers: {

                    "Content-Type": "application/json"

                },

                body: JSON.stringify({

                    ticketId

                })

            }

        );

        const data = await response.json();

        if (data.status === "valid") {

            playBeep(true);

            showResult(

                "valid",

                `
                <h2>✅ تم السماح بالدخول</h2>

                <p><strong>${data.participant.fullName}</strong></p>

                <p>${data.participant.ticketId}</p>
                `

            );

        }

        else if (data.status === "used") {

            playBeep(false);

            showResult(

                "used",

                `
                <h2>⚠️ التذكرة مستخدمة مسبقًا</h2>

                <p>${data.participant.fullName}</p>
                `

            );

        }

        else {

            playBeep(false);

            showResult(

                "invalid",

                `
                <h2>❌ التذكرة غير صالحة</h2>
                `

            );

        }

    }

    catch (err) {

        console.error(err);

        playBeep(false);

        showResult(

            "invalid",

            "<h2>حدث خطأ أثناء الاتصال بالخادم.</h2>"

        );

    }

}

/* ==========================================================
   بدء الماسح
========================================================== */

function startScanner() {

    scanner = new Html5Qrcode("reader");

    scanner.start(

        {

            facingMode: "environment"

        },

        {

            fps: 10,

            qrbox: {

                width: 280,

                height: 280

            }

        },

        async (decodedText) => {

            await scanner.pause();

            await verifyTicket(decodedText);

            setTimeout(() => {

                scanner.resume();

            }, 3000);

        },

        () => {

            // تجاهل أخطاء القراءة المؤقتة

        }

    );

}

/* ==========================================================
   تشغيل عند فتح الصفحة
========================================================== */

document.addEventListener(

    "DOMContentLoaded",

    () => {

        const reader = document.getElementById("reader");

        if (reader) {

            startScanner();

        }

    }

);