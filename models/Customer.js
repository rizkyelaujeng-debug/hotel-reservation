import { User } from "./User.js";

export class Customer extends User {
    #noHP;

    constructor(idUser, nama, noHP) {
        super(idUser, nama);
        this.#noHP = noHP;
    }

    getNoHP() {
        return this.#noHP;
    }

    setNoHP(noHP) {
        if (!noHP || noHP.trim().length < 5) {
            throw new Error("Nomor HP tidak valid.");
        }
        this.#noHP = noHP.trim();
    }

    displayInfo() {
        return `${super.displayInfo()} | No. HP: ${this.#noHP}`;
    }
}