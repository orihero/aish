import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import en from "./en.json";
import ru from "./ru.json";
import uz from "./uz.json";

i18n.use(LanguageDetector)

    .use(initReactI18next) // passes i18n down to react-i18next

    .init({
        debug: true,
        fallbackLng: "en",
        interpolation: {
            escapeValue: false,
        },
        resources: {
            en: {
                translation: en,
            },
            ru: {
                translation: ru,
            },
            uz: {
                translation: uz,
            },
        },
    });

export default i18n;
