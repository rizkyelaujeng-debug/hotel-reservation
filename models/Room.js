export class Room {
    #idRoom;
    #type;
    #price;
    #status;
    #imageUrl; 


    constructor(idRoom, type, price, imageUrl, status = "Tersedia") {
        this.#idRoom = idRoom;
        this.#type = type;
        this.#price = price;
        this.#status = status;
        this.#imageUrl = imageUrl; 
    }

    getIdRoom() { return this.#idRoom; }
    setIdRoom(idRoom) { this.#idRoom = idRoom; }

    getType() { return this.#type; }
    setType(type) { this.#type = type; }

    getPrice() { return this.#price; }
    setPrice(price) {
        if (price < 0) throw new Error("Price cannot be negative.");
        this.#price = price;
    }

    getStatus() { return this.#status; }
    setStatus(status) { this.#status = status; }


    getImageUrl() { return this.#imageUrl; }

    displayRoom() {
        return `Kamar #${this.#idRoom} [${this.#type}] - Rp ${this.#price.toLocaleString()} (${this.#status})`;
    }
}