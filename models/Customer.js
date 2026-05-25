import { User } from "./User.js";

export class Customer extends User {
    // Atribut Private tambahan sesuai UML (tanpa loyaltyPoints)
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

    // Overriding Method display() untuk Polimorfisme
    display() {
        return `${super.display()} | No. HP: ${this.#noHP}`;
    }
}