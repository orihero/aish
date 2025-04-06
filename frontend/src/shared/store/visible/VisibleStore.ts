import { makeAutoObservable } from "mobx";

export class VisibleStore {
    constructor() {
        makeAutoObservable(this);
    }

    visible = {
        something: false,
    };

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
