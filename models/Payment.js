export class Payment {
    #idPayment;
    #totalBayar;
    #metode;

    constructor(idPayment, metode = "Cash") {
        this.#idPayment = idPayment;
        this.#metode = metode;
        this.#totalBayar = 0;
    }

    getIdPayment() { return this.#idPayment; }
    getMetode() { return this.#metode; }
    setMetode(metode) { this.#metode = metode; }
    getTotalBayar() { return this.#totalBayar; }

    hitungTotal(reservation, order = null) {
        let total = reservation.hitungBiaya();
        
        if (order) {
            total += order.hitungTotal();
        }
        
        this.#totalBayar = total;
        return this.#totalBayar;
    }

    prosesPembayaran() {
        if (this.#totalBayar <= 0) {
            // TRANSLATED: Error text
            throw new Error("Total payment has not been calculated or is 0.");
        }
        // TRANSLATED: Success notification
        return `Payment of Rp ${this.#totalBayar.toLocaleString('id-ID')} via ${this.#metode} successful!`;
    }
}