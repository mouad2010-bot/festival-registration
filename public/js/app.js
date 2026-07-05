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

                "نعتذر لا يوجد تحميل PDF حاليا المرجو اخد لقطة شاشة لل QR Code الخاص بك وعدم اضاعته "

            );

        });

    }

});

/* ===========================================
   Hero Slider Fade
=========================================== */

const bg1 = document.querySelector(".hero-bg-1");
const bg2 = document.querySelector(".hero-bg-2");

if(bg1 && bg2){

    const images = [

        "/images/hero1.jpg",
        "/images/hero2.jpg",
        "/images/hero3.jpg",
        "/images/hero4.jpg",
        "/images/hero5.jpg",
        "/images/hero6.jpg",
        "/images/hero7.jpg",
        "/images/hero8.jpg"

    ];

    let current = 0;

    let showingFirst = true;

    bg1.style.backgroundImage = `url('${images[0]}')`;

    setInterval(()=>{

        current++;

        if(current >= images.length){

            current = 0;

        }

        if(showingFirst){

            bg2.style.backgroundImage = `url('${images[current]}')`;

            bg2.style.opacity = "1";

            bg1.style.opacity = "0";

        }

        else{

            bg1.style.backgroundImage = `url('${images[current]}')`;

            bg1.style.opacity = "1";

            bg2.style.opacity = "0";

        }

        showingFirst = !showingFirst;

    },3000);

}

/* ======================================
   Language Menu
====================================== */

const languageBtn = document.querySelector(".language-btn");
const languageDropdown = document.querySelector(".language-dropdown");

if(languageBtn && languageDropdown){

    languageBtn.addEventListener("click",(e)=>{

        e.stopPropagation();

        languageDropdown.classList.toggle("open");

    });

    document.addEventListener("click",()=>{

        languageDropdown.classList.remove("open");

    });

}