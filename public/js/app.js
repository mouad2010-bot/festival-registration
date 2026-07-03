/**
 * ==========================================================
 * Festival Registration System
 * File: public/js/app.js
 * ==========================================================
 */

document.addEventListener("DOMContentLoaded", () => {

    /* ===========================================
       Navbar عند النزول
    =========================================== */

    const navbar = document.querySelector(".navbar");

    if (navbar) {

        window.addEventListener("scroll", () => {

            if (window.scrollY > 40) {

                navbar.style.background = "#163B65";

                navbar.style.boxShadow =
                    "0 10px 30px rgba(0,0,0,.25)";

            } else {

                navbar.style.background =
                    "rgba(22,59,101,.95)";

                navbar.style.boxShadow = "none";

            }

        });

    }

    /* ===========================================
       Smooth Scroll
    =========================================== */

    document
        .querySelectorAll('a[href^="#"]')
        .forEach(link => {

            link.addEventListener("click", e => {

                const target = document.querySelector(

                    link.getAttribute("href")

                );

                if (!target) return;

                e.preventDefault();

                target.scrollIntoView({

                    behavior: "smooth"

                });

            });

        });

    /* ===========================================
       تأكيد حذف مشارك
    =========================================== */

    document
        .querySelectorAll(".delete-btn")
        .forEach(btn => {

            btn.addEventListener("click", e => {

                const ok = confirm(

                    "هل أنت متأكد من حذف هذا المشارك؟"

                );

                if (!ok) {

                    e.preventDefault();

                }

            });

        });

    /* ===========================================
       طباعة التذكرة
    =========================================== */

    const printBtn = document.getElementById("printTicket");

    if (printBtn) {

        printBtn.addEventListener("click", () => {

            window.print();

        });

    }

    /* ===========================================
       تحميل التذكرة
    =========================================== */

    const downloadBtn =
        document.getElementById("downloadTicket");

    if (downloadBtn) {

        downloadBtn.addEventListener("click", () => {

            alert(

                "سيتم إضافة تحميل PDF لاحقًا."

            );

        });

    }

});