import { User } from "./User.js";

export class Customer extends User {
    // Atribut Private tambahan sesuai UML
    #noHP;
    #loyaltyPoints;

    constructor(idUser, nama, noHP, loyaltyPoints = 0) {
        super(idUser, nama);
        this.#noHP = noHP;
        this.#loyaltyPoints = loyaltyPoints;
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

    getLoyaltyPoints() {
        return this.#loyaltyPoints;
    }

    setLoyaltyPoints(points) {
        if (points < 0) throw new Error("Poin tidak boleh negatif.");
        this.#loyaltyPoints = points;
    }

    // Overriding Method display() untuk Polimorfisme
    display() {
        return `${super.display()} | No. HP: ${this.#noHP} | Points: ${this.#loyaltyPoints}`;
    }
}