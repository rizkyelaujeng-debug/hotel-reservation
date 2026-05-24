import { Customer } from "./Customer.js";
import { Room } from "./Room.js";
import { Reservation } from "./Reservation.js";

export class HotelSystem {
    #customers;
    #rooms;
    #reservations;
    #orders;
    #payments;

    constructor() {
        this.#customers = [];
        this.#rooms = [];
        this.#reservations = [];
        this.#orders = [];
        this.#payments = [];
        
        // Memuat data dari memori saat sistem dijalankan
        this.loadData();
    }

    getAllReservations() { return [...this.#reservations]; }
    getAllOrders() { return [...this.#orders]; }

    tambahCustomer(customer) { this.#customers.push(customer); }
    tambahRoom(room) { this.#rooms.push(room); }
    
    tambahReservation(reservation) {
        this.#reservations.push(reservation);
        reservation.konfirmasi(); 
        this.saveData(); 
    }

    updateReservation(index, updatedReservation) {
        if (index >= 0 && index < this.#reservations.length) {
            this.#reservations[index] = updatedReservation;
            this.saveData(); 
        }
    }

    hapusData(index) {
        if (index >= 0 && index < this.#reservations.length) {
            this.#reservations[index].batalkan(); 
            this.#reservations.splice(index, 1);
            this.saveData(); 
        }
    }

    tambahOrder(order) {
        this.#orders.push(order);
        order.prosesOrder();
    }

    // ==========================================
    // FITUR PENGELOLAAN DATA (UPDATED UNTUK GAMBAR)
    // ==========================================

    saveData() {
        const dataAman = this.#reservations.map(res => {
            return {
                idReservation: res.getIdReservation(),
                durasi: res.getDurasi(),
                status: res.getStatus(),
                customer: {
                    idUser: res.getCustomer().getIdUser(),
                    nama: res.getCustomer().getNama(),
                    noHP: res.getCustomer().getNoHP(),
                    loyaltyPoints: res.getCustomer().getLoyaltyPoints()
                },
                room: {
                    idRoom: res.getRoom().getIdRoom(),
                    type: res.getRoom().getType(),
                    price: res.getRoom().getPrice(),
                    imageUrl: res.getRoom().getImageUrl(), // PERUBAHAN: Kini menyimpan URL gambar
                    status: res.getRoom().getStatus()
                }
            };
        });
        localStorage.setItem("DATA_RESERVASI_HOTEL", JSON.stringify(dataAman));
    }

    loadData() {
        try {
            const dataTersimpan = localStorage.getItem("DATA_RESERVASI_HOTEL");
            if (dataTersimpan) {
                const parsedData = JSON.parse(dataTersimpan);
                this.#reservations = parsedData.map(data => {
                    const customer = new Customer(data.customer.idUser, data.customer.nama, data.customer.noHP, data.customer.loyaltyPoints);
                    
                    // PERUBAHAN: Mengambil gambar dari memori. Jika memori lama tidak punya gambar, gunakan Standard
                    const img = data.room.imageUrl ? data.room.imageUrl : "./img/standard.jpg"; 
                    
                    const room = new Room(data.room.idRoom, data.room.type, data.room.price, img, data.room.status);
                    return new Reservation(data.idReservation, customer, room, data.durasi, data.status);
                });
            }
        } catch (error) {
            // Menangkap error jika struktur data berubah secara drastis
            console.warn("Format data lama terdeteksi, membersihkan memori sementara...");
            localStorage.removeItem("DATA_RESERVASI_HOTEL");
        }
    }
}