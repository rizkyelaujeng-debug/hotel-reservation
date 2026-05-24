import { Customer } from "./models/Customer.js";
import { Room } from "./models/Room.js";
import { Reservation } from "./models/Reservation.js";
import { HotelSystem } from "./models/HotelSystem.js";
import { Food } from "./models/Food.js";
import { Order } from "./models/Order.js";
import { Payment } from "./models/Payment.js";

const output = document.getElementById("output");
const bookBtn = document.getElementById("bookBtn");
const orderFoodBtn = document.getElementById("orderFoodBtn");

const hotel = new HotelSystem();
let editIndex = null; 

const formatRupiah = (angka) => {
    return "Rp " + angka.toLocaleString('id-ID');
};

// ==========================================
// ROOM PRICING & IMAGE LOGIC
// ==========================================
const roomAssets = {
    "Standard": { price: 2500000, imgUrl: "./img/standard.jpg" },
    "Deluxe":   { price: 5000000, imgUrl: "./img/deluxe.jpg" },
    "Suite":    { price: 12000000, imgUrl: "./img/suite.jpg" }
};

const roomTypeSelect = document.getElementById("roomType");
const roomPriceInput = document.getElementById("roomPrice");
const roomPreviewImg = document.getElementById("roomPreview"); 

const updateRoomUI = () => {
    const selectedType = roomTypeSelect.value;
    const assets = roomAssets[selectedType];
    roomPriceInput.value = formatRupiah(assets.price);
    roomPreviewImg.src = assets.imgUrl; 
};

updateRoomUI();
roomTypeSelect.addEventListener("change", updateRoomUI);

// ==========================================
// RESTAURANT MENU LOGIC
// ==========================================
// PERUBAHAN: Menghubungkan setiap makanan dengan file lokal persis seperti di screenshot
const foodMenuData = {
    "Breakfast": {
        "American Breakfast": { price: 85000, imgUrl: "./img/american-breakfast.jpg" },
        "Nasi Goreng Special": { price: 45000, imgUrl: "./img/nasi-goreng-special.jpg" },
        "Pancake Maple Syrup": { price: 55000, imgUrl: "./img/pancake-maple-syrup.jpg" },
        "Omelette Cheese": { price: 40000, imgUrl: "./img/omelette-cheese.jpg" },
        "Chicken Sausage & Toast": { price: 50000, imgUrl: "./img/chicken-sausage-toast.jpg" }
    },
    "Main Course": {
        "Chicken Steak": { price: 95000, imgUrl: "./img/chicken-steak.jpg" },
        "Beef Burger Deluxe": { price: 90000, imgUrl: "./img/beef-burger-deluxe.jpg" },
        "Spaghetti Carbonara": { price: 80000, imgUrl: "./img/spaghetti-carbonara.jpg" },
        "Nasi Goreng Seafood": { price: 70000, imgUrl: "./img/nasi-goreng-seafood.jpg" },
        "Mie Goreng Jawa": { price: 55000, imgUrl: "./img/mie-goreng-jawa.jpg" },
        "Ayam Bakar Madu": { price: 75000, imgUrl: "./img/ayam-bakar-madu.jpg" },
        "Grilled Salmon": { price: 120000, imgUrl: "./img/grilled-salmon.jpg" },
        "Chicken Fried Rice": { price: 60000, imgUrl: "./img/chicken-fried-rice.jpg" },
        "Beef Black Pepper": { price: 110000, imgUrl: "./img/beef-black-pepper.jpg" },
        "Fish and Chips": { price: 85000, imgUrl: "./img/fish-and-chips.jpg" }
    },
    "Soup & Appetizer": {
        "Cream Soup": { price: 35000, imgUrl: "./img/cream-soup.jpg" },
        "French Fries": { price: 30000, imgUrl: "./img/french-fries.jpg" },
        "Chicken Wings": { price: 50000, imgUrl: "./img/chicken-wings.jpg" },
        "Caesar Salad": { price: 45000, imgUrl: "./img/caesar-salad.jpg" }
    },
    "Dessert": {
        "Chocolate Lava Cake": { price: 50000, imgUrl: "./img/chocolate-lava-cake.jpg" },
        "Ice Cream Sundae": { price: 35000, imgUrl: "./img/icecreamsundae.jpg" },
        "Cheesecake": { price: 45000, imgUrl: "./img/cheesecake.jpg" },
        "Fruit Platter": { price: 40000, imgUrl: "./img/fruit-platter.jpg" }
    },
    "Drinks": {
        "Mineral Water": { price: 15000, imgUrl: "./img/mineral-water.jpg" },
        "Fresh Orange Juice": { price: 30000, imgUrl: "./img/fresh-orange-juice.jpg" },
        "Lemon Tea": { price: 25000, imgUrl: "./img/lemon-tea.jpg" },
        "Iced Coffee": { price: 35000, imgUrl: "./img/iced-coffee.jpg" },
        "Cappuccino": { price: 40000, imgUrl: "./img/cappuccino.jpg" },
        "Hot Chocolate": { price: 35000, imgUrl: "./img/hot-chocolate.jpg" },
        "Milkshake Vanilla": { price: 45000, imgUrl: "./img/milkshake-vanilla.jpg" },
        "Mango Smoothie": { price: 40000, imgUrl: "./img/mango-smoothie.jpg" }
    }
};

const foodMenuSelect = document.getElementById("foodMenu");
const foodPriceInput = document.getElementById("foodPrice");
const foodPreviewImg = document.getElementById("foodPreview"); 
const flatFoodData = {}; 

for (const [category, items] of Object.entries(foodMenuData)) {
    const optgroup = document.createElement("optgroup");
    optgroup.label = `🍽️ ${category}`;
    
    for (const [itemName, data] of Object.entries(items)) {
        flatFoodData[itemName] = data; 
        const option = document.createElement("option");
        option.value = itemName;
        option.textContent = `${itemName}`;
        optgroup.appendChild(option);
    }
    foodMenuSelect.appendChild(optgroup);
}

foodMenuSelect.addEventListener("change", function() {
    if (this.value === "") {
        foodPriceInput.value = "";
        // PERUBAHAN: Kembali ke gambar default dininginexp.jpg jika menu kosong
        foodPreviewImg.src = "./img/dininginexp.jpg";
    } else {
        const selectedFood = flatFoodData[this.value];
        foodPriceInput.value = formatRupiah(selectedFood.price);
        foodPreviewImg.src = selectedFood.imgUrl;
    }
});
// ==========================================


// RENDER RESERVATIONS
function renderReservations() {
    output.innerHTML = ""; 
    const selectCustomerOrder = document.getElementById("selectCustomerOrder");
    selectCustomerOrder.innerHTML = '<option value="">-- Select Customer / Room --</option>';

    const allReservations = hotel.getAllReservations();
    const allOrders = hotel.getAllOrders(); 

    if (allReservations.length === 0) {
        output.innerHTML = "<p style='text-align:center; color:gray;'>No active reservations.</p>";
        return;
    }

    allReservations.forEach((res, index) => {
        selectCustomerOrder.innerHTML += `<option value="${index}">${res.getCustomer().getNama()} - Room ${res.getRoom().getIdRoom()}</option>`;

        let orderHTML = "";
        let totalMakanan = 0;
        
        const customerOrders = allOrders.filter(o => o.getCustomer().getIdUser() === res.getCustomer().getIdUser());
        
        if (customerOrders.length > 0) {
            orderHTML += `<div class="card-food-list">
                            <strong>🍽️ In-Room Dining Orders:</strong><br>`;
            customerOrders.forEach(ord => {
                totalMakanan += ord.hitungTotal();
                ord.getFoods().forEach(item => {
                    const itemTotal = item.food.getHarga() * item.quantity;
                    orderHTML += `<div class="food-item-ordered">
                                    <img src="${item.food.getImageUrl()}" alt="${item.food.getNama()}">
                                    <span>${item.food.getNama()} (x${item.quantity}) : ${formatRupiah(itemTotal)}</span>
                                </div>`;
                });
            });
            orderHTML += `</div>`;
        }

        const totalKamar = res.hitungBiaya();
        const tagihanFinal = totalKamar + totalMakanan;

        output.innerHTML += `
        <div class="card" style="margin-top: 15px;">
            <img class="card-room-image" src="${res.getRoom().getImageUrl()}" alt="${res.getRoom().getType()}">
            
            <div class="card-content">
                <h2>Reservation Success</h2>
                
                <div class="card-details">
                    <p><i class="fa fa-user"></i> <strong>Name:</strong> ${res.getCustomer().getNama()}</p>
                    <p><i class="fa fa-phone"></i> <strong>Phone:</strong> ${res.getCustomer().getNoHP()}</p>
                    <p><i class="fa fa-hotel"></i> <strong>Room:</strong> ${res.getRoom().getIdRoom()} (${res.getRoom().getType()})</p>
                    <p><i class="fa fa-calendar-days"></i> <strong>Days:</strong> ${res.getDurasi()} days (${formatRupiah(totalKamar)})</p>
                </div>
                
                ${orderHTML}

                <p class="card-total-due">
                    <strong>Grand Total Due: ${formatRupiah(tagihanFinal)}</strong>
                </p>
                
                <div style="display: flex; gap: 10px; margin-top: 15px;">
                    <button class="edit-btn" data-index="${index}">Edit Room</button>
                    <button class="delete-btn" data-index="${index}">Checkout / Payment</button>
                </div>
            </div>
        </div>
        `;
    });

    document.querySelectorAll(".delete-btn").forEach(button => {
        button.addEventListener("click", function() {
            const indexToDelete = parseInt(this.getAttribute("data-index"));
            const res = hotel.getAllReservations()[indexToDelete];
            
            const customerOrders = hotel.getAllOrders().filter(o => o.getCustomer().getIdUser() === res.getCustomer().getIdUser());
            let totalMakanan = 0;
            customerOrders.forEach(ord => totalMakanan += ord.hitungTotal());
            const totalKamar = res.hitungBiaya();

            const pembayaran = new Payment(`PAY-${Date.now()}`, "Cash / Debit");
            
            const isConfirmed = confirm(`
            === HOTEL PAYMENT RECEIPT ===
            Customer   : ${res.getCustomer().getNama()}
            Room No.   : ${res.getRoom().getIdRoom()}
            -------------------------------------------------
            Room Cost  : ${formatRupiah(totalKamar)}
            Food Cost  : ${formatRupiah(totalMakanan)}
            -------------------------------------------------
            TOTAL DUE  : ${formatRupiah(totalKamar + totalMakanan)}
            
            Has the payment been received and do you want to proceed with Checkout?
            `);

            if (isConfirmed) {
                hotel.hapusData(indexToDelete); 
                renderReservations(); 
                alert(pembayaran.prosesPembayaran()); 
            }
        });
    });

    document.querySelectorAll(".edit-btn").forEach(button => {
        button.addEventListener("click", function() {
            const indexToEdit = parseInt(this.getAttribute("data-index"));
            const res = hotel.getAllReservations()[indexToEdit];
            
            document.getElementById("customerName").value = res.getCustomer().getNama();
            document.getElementById("customerPhone").value = res.getCustomer().getNoHP();
            document.getElementById("customerPoints").value = res.getCustomer().getLoyaltyPoints();
            document.getElementById("roomNumber").value = res.getRoom().getIdRoom();
            document.getElementById("days").value = res.getDurasi();
            
            document.getElementById("roomType").value = res.getRoom().getType();
            updateRoomUI();

            editIndex = indexToEdit;
            bookBtn.innerText = "Update Reservation";
            bookBtn.style.backgroundColor = "#eab308";
            bookBtn.style.color = "black";
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    });
}

bookBtn.addEventListener("click", () => {
    const name = document.getElementById("customerName").value;
    const phone = document.getElementById("customerPhone").value;
    const points = parseInt(document.getElementById("customerPoints").value);
    const roomNumber = parseInt(document.getElementById("roomNumber").value);
    const roomType = document.getElementById("roomType").value;
    const days = parseInt(document.getElementById("days").value);

    const roomPrice = roomAssets[roomType].price;

    if (!name || !phone || isNaN(points) || isNaN(roomNumber) || isNaN(days)) {
        alert("Please complete all room data with the correct format!"); return; 
    }
    if (days <= 0) {
        alert("Days of stay cannot be zero or negative!"); return;
    }

    let customer, room, reservation;
    
    if (editIndex !== null) {
        const resLama = hotel.getAllReservations()[editIndex];
        customer = new Customer(resLama.getCustomer().getIdUser(), name, phone, points);
        room = new Room(roomNumber, roomType, roomPrice, roomAssets[roomType].imgUrl); 
        reservation = new Reservation(resLama.getIdReservation(), customer, room, days);
        
        hotel.updateReservation(editIndex, reservation);
        editIndex = null;
        bookBtn.innerText = "Book Now";
        bookBtn.style.backgroundColor = "#2563eb";
        bookBtn.style.color = "white";
    } else {
        customer = new Customer(`CUST-${Date.now()}`, name, phone, points);
        room = new Room(roomNumber, roomType, roomPrice, roomAssets[roomType].imgUrl); 
        reservation = new Reservation(`RES-${Date.now()}`, customer, room, days);
        hotel.tambahReservation(reservation);
    }
    
    renderReservations();
    
    document.getElementById("customerName").value = "";
    document.getElementById("customerPhone").value = "";
    document.getElementById("customerPoints").value = "";
    document.getElementById("roomNumber").value = "";
    document.getElementById("days").value = "";
    
    document.getElementById("roomType").value = "Standard";
    updateRoomUI(); 
});

orderFoodBtn.addEventListener("click", () => {
    const resIndex = document.getElementById("selectCustomerOrder").value;
    const foodName = document.getElementById("foodMenu").value;
    const foodQty = parseInt(document.getElementById("foodQty").value);

    if (resIndex === "") {
        alert("Please select a customer/room first!"); return;
    }
    if (foodName === "") {
        alert("Please select a menu item!"); return;
    }
    if (isNaN(foodQty) || foodQty <= 0) {
        alert("Quantity must be greater than 0!"); return;
    }

    const selectedFoodData = flatFoodData[foodName];

    const selectedReservation = hotel.getAllReservations()[parseInt(resIndex)];
    const customer = selectedReservation.getCustomer();

    const food = new Food(`F-${Date.now()}`, foodName, selectedFoodData.price, selectedFoodData.imgUrl); 
    const order = new Order(`ORD-${Date.now()}`, customer, [ { food: food, quantity: foodQty } ]); 

    hotel.tambahOrder(order);
    renderReservations();

    document.getElementById("foodMenu").value = "";
    document.getElementById("foodPrice").value = "";
    document.getElementById("foodQty").value = "";
    // PERUBAHAN: Kembali ke gambar default setelah pesanan ditambah
    foodPreviewImg.src = "./img/dininginexp.jpg"; 
});

renderReservations();