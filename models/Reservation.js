export class Reservation {
    #idReservation;
    #durasi; // hari
    #status;
    #customer; // Relasi ke objek Customer
    #room;     // Relasi ke objek Room

    constructor(idReservation, customer, room, durasi, status = "Confirmed") {
        this.#idReservation = idReservation;
        this.#customer = customer;
        this.#room = room;
        this.#durasi = durasi;
        this.#status = status;
    }

    getIdReservation() { return this.#idReservation; }
    getDurasi() { return this.#durasi; }
    setDurasi(durasi) {
        if (durasi < 1) throw new Error("Durasi minimal 1 hari.");
        this.#durasi = durasi;
    }
    getStatus() { return this.#status; }
    setStatus(status) { this.#status = status; }
    getCustomer() { return this.#customer; }
    getRoom() { return this.#room; }

    hitungBiaya() {
        return this.#room.getPrice() * this.#durasi;
    }

    konfirmasi() {
        this.#status = "Confirmed";
        this.#room.setStatus("Terisi");
    }

    batalkan() {
        this.#status = "Cancelled";
        this.#room.setStatus("Tersedia");
    }
}