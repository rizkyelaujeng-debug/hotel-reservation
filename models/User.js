export class User {
    // Atribut Private sesuai UML
    #idUser;
    #nama;

    constructor(idUser, nama) {
        // Simulasi Abstract Class secara profesional
        if (this.constructor === User) {
            throw new Error("Abstract class 'User' tidak boleh diinstansiasi langsung.");
        }
        this.#idUser = idUser;
        this.#nama = nama;
    }

    // Getters & Setters Konvensional sesuai Method di UML
    getIdUser() {
        return this.#idUser;
    }

    getNama() {
        return this.#nama;
    }

    setNama(nama) {
        if (!nama || nama.trim().length === 0) {
            throw new Error("Nama tidak boleh kosong.");
        }
        this.#nama = nama.trim();
    }

    displayInfo() {
        return `ID User: ${this.#idUser} | Nama: ${this.#nama}`;
    }
}