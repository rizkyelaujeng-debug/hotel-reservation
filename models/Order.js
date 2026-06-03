export class Order {
    #idOrder;
    #customer; 
    #total;
    #status;
    #foods; 

    constructor(idOrder, customer, foods = [], status = "Pending") {
        this.#idOrder = idOrder;
        this.#customer = customer; 
        this.#foods = foods;
        this.#status = status;
        this.#total = this.hitungTotal();
    }

    getIdOrder() { return this.#idOrder; }
    getCustomer() { return this.#customer; } 
    getStatus() { return this.#status; }
    getFoods() { return this.#foods; }

    hitungTotal() {
        return this.#foods.reduce((sum, item) => sum + (item.food.getHarga() * item.quantity), 0);
    }

    prosesOrder() {
        this.#status = "Processed";
        this.#total = this.hitungTotal();
    }
}