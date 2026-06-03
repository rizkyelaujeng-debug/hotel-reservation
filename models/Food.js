export class Food {
    #idFood;
    #nama;
    #harga;
    #imageUrl; 

    constructor(idFood, nama, harga, imageUrl) {
        this.#idFood = idFood;
        this.#nama = nama;
        this.#harga = harga;
        this.#imageUrl = imageUrl; 
    }

    getIdFood() { return this.#idFood; }
    getNama() { return this.#nama; }
    getHarga() { return this.#harga; }

    setHarga(harga) {
        if (harga < 0) throw new Error("Food price cannot be negative.");
        this.#harga = harga;
    }

    getImageUrl() { return this.#imageUrl; }
}