export class Food {
    #idFood;
    #nama;
    #harga;
    #imageUrl; // NEW PRIVATE ATTRIBUTE

    // Updated constructor
    constructor(idFood, nama, harga, imageUrl) {
        this.#idFood = idFood;
        this.#nama = nama;
        this.#harga = harga;
        this.#imageUrl = imageUrl; // Initialize
    }

    getIdFood() { return this.#idFood; }
    getNama() { return this.#nama; }
    getHarga() { return this.#harga; }

    setHarga(harga) {
        if (harga < 0) throw new Error("Food price cannot be negative.");
        this.#harga = harga;
    }

    // GETTER for the image
    getImageUrl() { return this.#imageUrl; }
}