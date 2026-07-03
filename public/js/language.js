/**
 * ==========================================================
 * Festival Registration System
 * File: public/js/language.js
 * ==========================================================
 */

const translations = {

    ar: {

        register: "التسجيل",

        home: "الرئيسية",

        info: "المعلومات",

        festival2024: "مهرجان 2024",

        festival2026: "مهرجان 2026"

    },

    en: {

        register: "Register",

        home: "Home",

        info: "Information",

        festival2024: "Festival 2024",

        festival2026: "Festival 2026"

    }

};

let currentLanguage = "ar";

const languageButton = document.getElementById("languageBtn");

if (languageButton) {

    languageButton.addEventListener(

        "click",

        () => {

            currentLanguage =

                currentLanguage === "ar"

                    ? "en"

                    : "ar";

            document.documentElement.lang = currentLanguage;

            document.documentElement.dir =

                currentLanguage === "ar"

                    ? "rtl"

                    : "ltr";

            languageButton.textContent =

                currentLanguage === "ar"

                    ? "English"

                    : "العربية";

            // في النسخة القادمة سيتم تغيير جميع النصوص
            // باستخدام data-translate

        }

    );

}