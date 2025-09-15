import { makeAutoObservable } from "mobx";
import i18n from "../../translations";

export class VisibleStore {
    constructor() {
        makeAutoObservable(this);
        // Initialize language from localStorage or default to 'en'
        const savedLang = localStorage.getItem('selectedLanguage') || 'en';
        this.currentLang = savedLang;
        i18n.changeLanguage(savedLang);
    }
    
    currentLang = "en";
    visible = {
        something: false,
        createResumeModal: false,
        isResumeEditable: false,
        registerModal: false,
        applyModal: false,
        resumeSelect: false,
        loginModal: false,
    };

    setLang(lang: string) {
        this.currentLang = lang;
        i18n.changeLanguage(lang);
        localStorage.setItem('selectedLanguage', lang);
    }

    toglevisible = (key: keyof typeof this.visible) => {
        this.visible[key] = !this.visible[key];
    };

    show = (key: keyof typeof this.visible) => {
        this.visible[key] = true;
    };

    hide = (key: keyof typeof this.visible) => {
        this.visible[key] = false;
    };
}
