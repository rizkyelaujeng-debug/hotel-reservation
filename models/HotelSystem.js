import { Customer } from "./Customer.js";
import { Room } from "./Room.js";
import { Reservation } from "./Reservation.js";
import { Order } from "./Order.js";
import { Food } from "./Food.js";

export class HotelSystem {
    constructor() {
        this.reservations = [];
        this.orders = [];
        this.loadData(); // Otomatis menarik data dari memori browser saat web dibuka
    }

    getAllReservations() { return this.reservations; }
    getAllOrders() { return this.orders; }

    tambahReservation(reservation) {
        this.reservations.push(reservation);
        this.saveData(); // Simpan ke browser tiap ada booking baru
    }

    updateReservation(index, newReservation) {
        if(index >= 0 && index < this.reservations.length) {
            this.reservations[index] = newReservation;
            this.saveData();
        }
    }

    tambahOrder(order) {
        this.orders.push(order);
        this.saveData();
    }

    hapusData(index) {
        if (index >= 0 && index < this.reservations.length) {
            this.reservations.splice(index, 1);
            this.saveData();
        }
    }

    resetSemuaData() {
        this.reservations = [];
        this.orders = [];
        this.saveData(); 
    }

    saveData() {
        try {
            const dataToSave = {
                reservations: this.reservations.map(res => ({
                    idReservation: res.getIdReservation(),
                    durasi: res.getDurasi(),
                    customer: {
                        idUser: res.getCustomer().getIdUser(),
                        nama: res.getCustomer().getNama(),
                        noHP: res.getCustomer().getNoHP()
                        
                    },
                    room: {
                        idRoom: res.getRoom().getIdRoom(),
                        type: res.getRoom().getType(),
                        price: res.getRoom().getPrice(),
                        imageUrl: res.getRoom().getImageUrl()
                    }
                })),
                orders: this.orders.map(ord => ({
                    idOrder: ord.idOrder,
                    customer: {
                        idUser: ord.getCustomer().getIdUser(),
                        nama: ord.getCustomer().getNama(),
                        noHP: ord.getCustomer().getNoHP()
                    },
                    items: ord.getFoods().map(item => ({
                        food: {
                            idFood: item.food.getIdFood(),
                            nama: item.food.getNama(),
                            harga: item.food.getHarga(),
                            imageUrl: item.food.getImageUrl()
                        },
                        quantity: item.quantity
                    }))
                }))
            };
            localStorage.setItem('hotelData', JSON.stringify(dataToSave));
        } catch (error) {
            console.error("Gagal menyimpan data:", error);
        }
    }

    loadData() {
        try {
            const savedData = localStorage.getItem('hotelData');
            if (savedData) {
                const parsedData = JSON.parse(savedData);
                
                if (parsedData.reservations) {
                    this.reservations = parsedData.reservations.map(resData => {
                        const cust = new Customer(resData.customer.idUser, resData.customer.nama, resData.customer.noHP);
                        const rm = new Room(resData.room.idRoom, resData.room.type, resData.room.price, resData.room.imageUrl);
                        return new Reservation(resData.idReservation, cust, rm, resData.durasi);
                    });
                }

                if (parsedData.orders) {
                    this.orders = parsedData.orders.map(ordData => {
                        const cust = new Customer(ordData.customer.idUser, ordData.customer.nama, ordData.customer.noHP);
                        const orderItems = ordData.items.map(itemData => {
                            const fd = new Food(itemData.food.idFood, itemData.food.nama, itemData.food.harga, itemData.food.imageUrl);
                            return { food: fd, quantity: itemData.quantity };
                        });
                        return new Order(ordData.idOrder, cust, orderItems);
                    });
                }
            }
        } catch (error) {
            console.error("Gagal memuat data:", error);
            this.reservations = [];
            this.orders = [];
        }
    }
}