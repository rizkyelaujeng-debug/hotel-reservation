import { Customer } from "./models/Customer.js";
import { Room } from "./models/Room.js";
import { Reservation } from "./models/Reservation.js";
import { HotelSystem } from "./models/HotelSystem.js";
import { Food } from "./models/Food.js";
import { Order } from "./models/Order.js";
import { Payment } from "./models/Payment.js";

const output = document.getElementById("output");
const bookBtn = document.getElementById("bookBtn");

const hotel = new HotelSystem();
let editIndex = null; 

let historicalRevenue = 0; 
let historicalCustomerCount = 0; 

const formatRupiah = (angka) => {
    return "Rp " + angka.toLocaleString('id-ID');
};

// ==========================================
// 0. CUSTOM ALERT POP-UP LOGIC
// ==========================================
const customAlertOverlay = document.getElementById("customAlertOverlay");
const customAlertMessage = document.getElementById("customAlertMessage");
const customAlertOkBtn = document.getElementById("customAlertOkBtn");

function showCustomAlert(message) {
    if (customAlertMessage && customAlertOverlay) {
        customAlertMessage.innerText = message;
        customAlertOverlay.style.display = "flex";
    } else {
        alert(message); // Fallback aman
    }
}

if (customAlertOkBtn) {
    customAlertOkBtn.addEventListener("click", () => {
        customAlertOverlay.style.display = "none";
    });
}

// ==========================================
// 1. UPDATE DATA DASHBOARD SECARA REAL-TIME
// ==========================================
function updateDashboardStats() {
    const allReservations = hotel.getAllReservations();
    const allOrders = hotel.getAllOrders();

    let activeRev = 0;
    
    let countStandard = 0;
    let countDeluxe = 0;
    let countSuite = 0;

    allReservations.forEach(res => {
        activeRev += res.hitungBiaya();
        const customerOrders = allOrders.filter(o => o.getCustomer().getIdUser() === res.getCustomer().getIdUser());
        customerOrders.forEach(ord => activeRev += ord.hitungTotal());

        const tRoom = res.getRoom().getType();
        if (tRoom === "Standard") countStandard++;
        else if (tRoom === "Deluxe") countDeluxe++;
        else if (tRoom === "Luxury Suite") countSuite++;
    });

    const grandTotalRevenue = historicalRevenue + activeRev;
    const totalCustomersDisplay = historicalCustomerCount + allReservations.length;

    const elTotalCust = document.getElementById('dashTotalCustomers');
    const elAvailRooms = document.getElementById('dashAvailableRooms');
    const elActiveRes = document.getElementById('dashActiveReservations');
    const elTotalRev = document.getElementById('dashTotalRevenue');
    const tbody = document.getElementById('dashRecentBookingsBody');

    if(elTotalCust) elTotalCust.innerText = totalCustomersDisplay.toLocaleString('id-ID');
    if(elAvailRooms) elAvailRooms.innerText = 520 - allReservations.length; 
    if(elActiveRes) elActiveRes.innerText = allReservations.length; 
    if(elTotalRev) elTotalRev.innerText = formatRupiah(grandTotalRevenue);

    const barStandard = document.getElementById('barStandard');
    const barDeluxe = document.getElementById('barDeluxe');
    const barSuite = document.getElementById('barSuite');
    
    const lblStandard = document.getElementById('lblStandard');
    const lblDeluxe = document.getElementById('lblDeluxe');
    const lblSuite = document.getElementById('lblSuite');

    if (barStandard && barDeluxe && barSuite) {
        lblStandard.innerText = `(${countStandard})`;
        lblDeluxe.innerText = `(${countDeluxe})`;
        lblSuite.innerText = `(${countSuite})`;

        const hStandard = Math.max(5, (countStandard / 300) * 100);
        const hDeluxe = Math.max(5, (countDeluxe / 200) * 100);
        const hSuite = Math.max(5, (countSuite / 20) * 100);

        barStandard.style.transition = "height 0.5s ease-out";
        barDeluxe.style.transition = "height 0.5s ease-out";
        barSuite.style.transition = "height 0.5s ease-out";

        barStandard.style.height = `${hStandard}%`;
        barDeluxe.style.height = `${hDeluxe}%`;
        barSuite.style.height = `${hSuite}%`;
    }

    if(tbody) {
        tbody.innerHTML = '';
        if(allReservations.length === 0) {
            tbody.innerHTML = '<tr><td colspan="5" style="text-align:center; padding:20px; color:#94a3b8;">No recent bookings.</td></tr>';
        } else {
            const recent = [...allReservations].reverse().slice(0, 4);
            recent.forEach(res => {
                const name = res.getCustomer().getNama().split(" | Req: ")[0];
                const displayType = res.getRoom().getType() === "Luxury Suite" ? "Luxury Suite" : res.getRoom().getType() + " Room";
                tbody.innerHTML += `
                    <tr>
                        <td style="font-weight:600; color:#64748b;">#${res.getRoom().getIdRoom()}</td>
                        <td style="font-weight:600; color:#0f172a;">${name}</td>
                        <td style="font-style:italic;">${displayType}</td>
                        <td>${res.getDurasi()} Nights</td>
                        <td><span class="status-badge-table">CONFIRMED</span></td>
                    </tr>
                `;
            });
        }
    }
}

const viewAllBtn = document.getElementById('dashViewAll');
if(viewAllBtn) {
    viewAllBtn.addEventListener('click', (e) => {
        e.preventDefault();
        document.getElementById("menuBookings").click();
    });
}

// ==========================================
// 2. ROOM PRICING LOGIC
// ==========================================
const roomAssets = {
    "Standard": { price: 2500000, imgUrl: "./img/standard.jpg" },
    "Deluxe":   { price: 5000000, imgUrl: "./img/deluxe.jpg" },
    "Luxury Suite": { price: 12000000, imgUrl: "./img/suite.jpg" }
};

const roomTypeSelect = document.getElementById("roomType");
const roomPriceInput = document.getElementById("roomPrice");
const roomPreviewImg = document.getElementById("roomPreview"); 
const roomNumberInput = document.getElementById("roomNumber");

const calculateSummaryTotal = () => {
    const days = parseInt(document.getElementById("days").value) || 0;
    const price = roomAssets[roomTypeSelect.value].price;
    if(document.getElementById("sumDays")) document.getElementById("sumDays").innerText = days;
    if(document.getElementById("sumTotal")) document.getElementById("sumTotal").innerText = formatRupiah(days * price);
};

const updateRoomUI = () => {
    const selectedType = roomTypeSelect.value;
    const assets = roomAssets[selectedType];
    
    roomPriceInput.value = formatRupiah(assets.price); 
    roomPreviewImg.src = assets.imgUrl; 
    
    if (selectedType === "Standard") roomNumberInput.placeholder = "Range: 1 - 300";
    else if (selectedType === "Deluxe") roomNumberInput.placeholder = "Range: 301 - 500";
    else if (selectedType === "Luxury Suite") roomNumberInput.placeholder = "Range: 501 - 520";

    const displayType = selectedType === "Luxury Suite" ? "Luxury Suite" : selectedType + " Room";
    if(document.getElementById("sumRoomType")) document.getElementById("sumRoomType").innerText = displayType;
    if(document.getElementById("sumPrice")) document.getElementById("sumPrice").innerText = formatRupiah(assets.price);
    
    calculateSummaryTotal(); 
};

updateRoomUI();
roomTypeSelect.addEventListener("change", updateRoomUI);
const daysInput = document.getElementById("days");
if(daysInput) daysInput.addEventListener("input", calculateSummaryTotal);

// ==========================================
// 3. RESTAURANT CART LOGIC
// ==========================================
const foodMenuData = {
    "Breakfast": {
        "American Breakfast": { price: 85000, imgUrl: "./img/american-breakfast.jpg", desc: "Eggs, bacon, toast, hash browns" },
        "Nasi Goreng Special": { price: 45000, imgUrl: "./img/nasi-goreng-special.jpg", desc: "Sunny side up, chicken satay, crackers" },
        "Pancake Maple Syrup": { price: 55000, imgUrl: "./img/pancake-maple-syrup.jpg", desc: "Fluffy pancakes, butter, maple syrup" },
        "Omelette Cheese": { price: 40000, imgUrl: "./img/omelette-cheese.jpg", desc: "Melted cheese, herbs, side salad" },
        "Chicken Sausage & Toast": { price: 50000, imgUrl: "./img/chicken-sausage-toast.jpg", desc: "Grilled sausage, toasted sourdough" }
    },
    "Main Course": {
        "Chicken Steak": { price: 95000, imgUrl: "./img/chicken-steak.jpg", desc: "Mushroom sauce, potato wedges" },
        "Beef Burger Deluxe": { price: 90000, imgUrl: "./img/beef-burger-deluxe.jpg", desc: "Wagyu beef patty, caramelized onion" },
        "Spaghetti Carbonara": { price: 80000, imgUrl: "./img/spaghetti-carbonara.jpg", desc: "Creamy sauce, smoked beef, parmesan" },
        "Nasi Goreng Seafood": { price: 70000, imgUrl: "./img/nasi-goreng-seafood.jpg", desc: "Shrimp, squid, fish ball, sunny side up" },
        "Mie Goreng Jawa": { price: 55000, imgUrl: "./img/mie-goreng-jawa.jpg", desc: "Traditional fried noodles with chicken" },
        "Ayam Bakar Madu": { price: 75000, imgUrl: "./img/ayam-bakar-madu.jpg", desc: "Honey glazed grilled chicken, rice, sambal" },
        "Grilled Salmon": { price: 120000, imgUrl: "./img/grilled-salmon.jpg", desc: "Pan-seared, wild asparagus, lemon butter" },
        "Chicken Fried Rice": { price: 60000, imgUrl: "./img/chicken-fried-rice.jpg", desc: "Classic fried rice with chicken chunks" },
        "Beef Black Pepper": { price: 110000, imgUrl: "./img/beef-black-pepper.jpg", desc: "Tender beef slices, bell peppers, onions" },
        "Fish and Chips": { price: 85000, imgUrl: "./img/fish-and-chips.jpg", desc: "Battered dory fish, tartar sauce, fries" }
    },
    "Soup & Appetizer": {
        "Cream Soup": { price: 35000, imgUrl: "./img/cream-soup.jpg", desc: "Rich mushroom cream soup, garlic bread" },
        "French Fries": { price: 30000, imgUrl: "./img/french-fries.jpg", desc: "Golden crinkle-cut fries, chili sauce" },
        "Chicken Wings": { price: 50000, imgUrl: "./img/chicken-wings.jpg", desc: "Spicy honey glazed wings, dip" },
        "Caesar Salad": { price: 45000, imgUrl: "./img/caesar-salad.jpg", desc: "Romaine lettuce, croutons, parmesan" }
    },
    "Dessert": {
        "Chocolate Lava Cake": { price: 50000, imgUrl: "./img/chocolate-lava-cake.jpg", desc: "Molten dark chocolate, vanilla ice cream" },
        "Ice Cream Sundae": { price: 35000, imgUrl: "./img/icecreamsundae.jpg", desc: "Three scoops, chocolate syrup, cherry" },
        "Cheesecake": { price: 45000, imgUrl: "./img/cheesecake.jpg", desc: "New York style, mixed berry compote" },
        "Fruit Platter": { price: 40000, imgUrl: "./img/fruit-platter.jpg", desc: "Seasonal fresh sliced fruits" }
    },
    "Drinks": {
        "Mineral Water": { price: 15000, imgUrl: "./img/mineral-water.jpg", desc: "Sparkling or Still 500ml" },
        "Fresh Orange Juice": { price: 30000, imgUrl: "./img/fresh-orange-juice.jpg", desc: "100% freshly squeezed oranges" },
        "Lemon Tea": { price: 25000, imgUrl: "./img/lemon-tea.jpg", desc: "Iced tea with a splash of fresh lemon" },
        "Iced Coffee": { price: 35000, imgUrl: "./img/iced-coffee.jpg", desc: "Cold brew single origin" },
        "Cappuccino": { price: 40000, imgUrl: "./img/cappuccino.jpg", desc: "Hot espresso, steamed milk, deep foam" },
        "Hot Chocolate": { price: 35000, imgUrl: "./img/hot-chocolate.jpg", desc: "Rich premium cocoa, marshmallows" },
        "Milkshake Vanilla": { price: 45000, imgUrl: "./img/milkshake-vanilla.jpg", desc: "Thick vanilla blend, whipped cream" },
        "Mango Smoothie": { price: 40000, imgUrl: "./img/mango-smoothie.jpg", desc: "Fresh mango blended with yogurt" }
    }
};

let currentCart = [];
let activeFoodTab = "Breakfast";

const foodCategoryTabs = document.getElementById("foodCategoryTabs");
const foodGridContainer = document.getElementById("foodGridContainer");

if(foodCategoryTabs) {
    foodCategoryTabs.innerHTML = ''; 
    Object.keys(foodMenuData).forEach((cat, index) => {
        const tab = document.createElement('div');
        tab.className = `food-tab ${index === 0 ? 'active' : ''}`;
        tab.innerText = cat;
        tab.addEventListener('click', () => {
            document.querySelectorAll('.food-tab').forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            activeFoodTab = cat;
            renderFoodGrid();
        });
        foodCategoryTabs.appendChild(tab);
    });
}

function renderFoodGrid() {
    if(!foodGridContainer) return;
    foodGridContainer.innerHTML = '';
    const items = foodMenuData[activeFoodTab];
    for (const [name, data] of Object.entries(items)) {
        foodGridContainer.innerHTML += `
            <div class="food-card">
                <img src="${data.imgUrl}" alt="${name}">
                <div class="food-card-info">
                    <h4 class="food-card-title">${name}</h4>
                    <p class="food-card-desc">${data.desc}</p>
                    <div class="food-card-bottom">
                        <span class="food-card-price">${formatRupiah(data.price)}</span>
                        <button class="btn-add-food" data-name="${name}" data-price="${data.price}" data-img="${data.imgUrl}" data-cat="${activeFoodTab}">
                            <i class="fa-solid fa-circle-plus"></i> ADD
                        </button>
                    </div>
                </div>
            </div>
        `;
    }
}
if(foodGridContainer) renderFoodGrid();

if(foodGridContainer) {
    foodGridContainer.addEventListener('click', (e) => {
        const btn = e.target.closest('.btn-add-food');
        if (btn) {
            const name = btn.dataset.name;
            const price = parseInt(btn.dataset.price);
            const img = btn.dataset.img;
            const cat = btn.dataset.cat;
            
            const existingItem = currentCart.find(i => i.name === name);
            if (existingItem) existingItem.qty += 1;
            else currentCart.push({ name, price, img, cat, qty: 1 });
            renderCart();
        }
    });
}

function renderCart() {
    const list = document.getElementById('orderItemsList');
    if(!list) return;
    list.innerHTML = '';
    let subtotal = 0;

    if (currentCart.length === 0) {
        list.innerHTML = '<p style="text-align: center; color: #94a3b8; font-size: 0.85rem; margin-top: 20px;">No items selected yet.</p>';
    } else {
        currentCart.forEach((item, index) => {
            subtotal += (item.price * item.qty);
            list.innerHTML += `
                <div class="cart-item">
                    <div class="cart-item-info">
                        <div class="cart-item-name">${item.name}</div>
                        <div class="cart-item-cat">${item.cat}</div>
                    </div>
                    <div class="cart-qty-control">
                        <button class="cart-qty-btn decrease-qty" data-index="${index}">-</button>
                        <span class="cart-qty-val">${item.qty}</span>
                        <button class="cart-qty-btn increase-qty" data-index="${index}">+</button>
                    </div>
                    <div class="cart-item-price">${formatRupiah(item.price * item.qty)}</div>
                </div>
            `;
        });
    }

    const serviceFee = subtotal * 0.03;
    const feeLabel = document.querySelector('.calc-row:nth-child(2) .calc-label');
    if(feeLabel) feeLabel.innerText = "Service Fee (3%)";

    document.getElementById('orderSubtotal').innerText = formatRupiah(subtotal);
    document.getElementById('orderServiceFee').innerText = formatRupiah(serviceFee);
    document.getElementById('orderTotalAmount').innerText = formatRupiah(subtotal + serviceFee);
}

const orderItemsList = document.getElementById('orderItemsList');
if(orderItemsList) {
    orderItemsList.addEventListener('click', (e) => {
        if (e.target.classList.contains('increase-qty')) {
            currentCart[e.target.dataset.index].qty += 1;
            renderCart();
        } else if (e.target.classList.contains('decrease-qty')) {
            currentCart[e.target.dataset.index].qty -= 1;
            if (currentCart[e.target.dataset.index].qty === 0) {
                currentCart.splice(e.target.dataset.index, 1);
            }
            renderCart();
        }
    });
}

// ==========================================
// 4. RENDER RESERVATIONS
// ==========================================
function renderReservations(searchQuery = "") {
    if(!output) return;
    output.innerHTML = ""; 
    const selectCustomerOrder = document.getElementById("selectCustomerOrder");
    if(selectCustomerOrder) selectCustomerOrder.innerHTML = '<option value="">Select Room...</option>';

    const allReservations = hotel.getAllReservations();
    const allOrders = hotel.getAllOrders(); 

    updateDashboardStats();

    if (allReservations.length === 0) {
        output.innerHTML = `
        <div style="text-align:center; padding: 50px; background: white; border-radius: 12px; box-shadow: 0 4px 15px rgba(0,0,0,0.05);">
            <i class="fa-regular fa-folder-open" style="font-size: 3rem; color: #d1d5db; margin-bottom: 15px;"></i>
            <p style="color:gray;">No active reservations at the moment.</p>
        </div>`;
        return;
    }

    allReservations.forEach((res, index) => {
        const rawString = res.getCustomer().getNama();
        const splitStr = rawString.split(" | Req: ");
        const guestName = splitStr[0];
        const specialReq = splitStr[1] || "";

        if (searchQuery !== "" && !guestName.toLowerCase().includes(searchQuery.toLowerCase())) {
            return; 
        }

        const displayType = res.getRoom().getType() === "Luxury Suite" ? "Luxury Suite" : res.getRoom().getType() + " Room";
        if(selectCustomerOrder) selectCustomerOrder.innerHTML += `<option value="${index}">${res.getRoom().getType()} ${res.getRoom().getIdRoom()} - ${guestName}</option>`;

        let orderHTML = "";
        let totalMakanan = 0;
        const customerOrders = allOrders.filter(o => o.getCustomer().getIdUser() === res.getCustomer().getIdUser());
        
        if (customerOrders.length > 0) {
            orderHTML += `<div class="bd-food-orders"><h6 class="bd-label" style="margin-bottom:10px;">IN-ROOM DINING ORDERS</h6>`;
            customerOrders.forEach(ord => {
                totalMakanan += ord.hitungTotal();
                ord.getFoods().forEach(item => {
                    const itemTotal = item.food.getHarga() * item.quantity;
                    orderHTML += `<div class="bd-food-item">
                                    <span class="food-name">${item.food.getNama()} (x${item.quantity})</span>
                                    <span>${formatRupiah(itemTotal)}</span>
                                  </div>`;
                });
            });
            orderHTML += `</div>`;
        }

        const totalKamar = res.hitungBiaya();
        const tagihanFinal = totalKamar + totalMakanan;

        let specialReqHTML = specialReq ? `
            <div class="special-req-box">
                <h6>SPECIAL REQUIREMENTS</h6>
                <p>"${specialReq}"</p>
            </div>
        ` : '';

        output.innerHTML += `
        <div class="booking-detail-card">
            <div class="bd-left">
                <div class="bd-main-img">
                    <span class="status-badge">CONFIRMED</span>
                    <img src="${res.getRoom().getImageUrl()}" alt="Suite View">
                </div>
                <div class="bd-thumb-grid">
                    <img src="./img/standard.jpg" alt="Interior">
                    <img src="./img/deluxe.jpg" alt="Bathroom">
                    <img src="./img/suite.jpg" alt="Balcony">
                </div>
            </div>
            
            <div class="bd-right">
                <div class="bd-info-grid">
                    <div class="bd-info-item">
                        <span class="bd-label">BOOKING REFERENCE</span>
                        <span class="bd-value-large">#${res.getRoom().getIdRoom()}</span>
                    </div>
                    <div class="bd-info-item">
                        <span class="bd-label">GUEST NAME</span>
                        <span class="bd-value"><i class="fa-regular fa-user"></i> ${guestName}</span>
                    </div>
                    <div class="bd-info-item">
                        <span class="bd-label">CONTACT PHONE</span>
                        <span class="bd-value"><i class="fa-solid fa-phone"></i> ${res.getCustomer().getNoHP()}</span>
                    </div>
                    <div class="bd-info-item">
                        <span class="bd-label">SUITE SELECTION</span>
                        <span class="bd-value"><i class="fa-solid fa-bed"></i> ${displayType}, Ocean View</span>
                    </div>
                    <div class="bd-info-item">
                        <span class="bd-label">DURATION OF STAY</span>
                        <span class="bd-value"><i class="fa-regular fa-calendar"></i> ${res.getDurasi()} Nights <span style="font-size:0.75rem; color:#94a3b8; margin-left:5px;">(${formatRupiah(res.getRoom().getPrice())} / night)</span></span>
                    </div>
                </div>
                
                <div class="bd-total-section">
                    <span class="bd-label">TOTAL INVESTMENT</span>
                    <span class="bd-total-val">${formatRupiah(tagihanFinal)} <span class="paid-badge">UNPAID</span></span>
                </div>
                
                <div class="bd-actions">
                    <button class="btn-process delete-btn" data-index="${index}"><i class="fa-solid fa-credit-card"></i> PROCESS PAYMENT</button>
                    <button class="btn-edit edit-btn" data-index="${index}"><i class="fa-solid fa-pen"></i> EDIT</button>
                </div>
                
                ${specialReqHTML}
                ${orderHTML}
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

            const tagihanFinal = totalKamar + totalMakanan;
            const pembayaran = new Payment(`PAY-${Date.now()}`, "Cash / Debit");
            
            const isConfirmed = confirm(`Has the payment been received and do you want to proceed with Checkout?`);

            if (isConfirmed) {
                historicalRevenue += tagihanFinal;
                historicalCustomerCount += 1;

                hotel.hapusData(indexToDelete); 
                renderReservations(); 
                showCustomAlert(pembayaran.prosesPembayaran()); // Menggunakan Custom Alert
            }
        });
    });

    document.querySelectorAll(".edit-btn").forEach(button => {
        button.addEventListener("click", function() {
            const indexToEdit = parseInt(this.getAttribute("data-index"));
            const res = hotel.getAllReservations()[indexToEdit];
            const splitStr = res.getCustomer().getNama().split(" | Req: ");
            
            document.getElementById("customerName").value = splitStr[0];
            document.getElementById("specialRequest").value = splitStr[1] || "";
            document.getElementById("customerPhone").value = res.getCustomer().getNoHP();
            document.getElementById("roomNumber").value = res.getRoom().getIdRoom();
            document.getElementById("days").value = res.getDurasi();
            
            document.getElementById("roomType").value = res.getRoom().getType();
            updateRoomUI();

            editIndex = indexToEdit;
            bookBtn.innerText = "Update Reservation";
            document.getElementById("menuRooms").click();
        });
    });
}

// ==========================================
// 5. FITUR PENCARIAN DI MENU BOOKINGS
// ==========================================
const searchInputBookings = document.getElementById("searchInputBookings");
if (searchInputBookings) {
    searchInputBookings.addEventListener("input", function() {
        const query = this.value;
        renderReservations(query);
    });
}

// ==========================================
// 6. SUBMIT BOOKING (DENGAN CUSTOM ALERT)
// ==========================================
if(bookBtn) {
    bookBtn.addEventListener("click", () => {
        const rawName = document.getElementById("customerName").value;
        const phone = document.getElementById("customerPhone").value;
        const roomNumber = parseInt(document.getElementById("roomNumber").value);
        const roomType = document.getElementById("roomType").value;
        const days = parseInt(document.getElementById("days").value);
        const roomPrice = roomAssets[roomType].price;
        const specialReq = document.getElementById("specialRequest").value;

        if (!rawName || !phone || isNaN(roomNumber) || isNaN(days)) {
            showCustomAlert("Please complete all room data with the correct format!"); return; 
        }
        if (days <= 0) {
            showCustomAlert("Days of stay cannot be zero or negative!"); return;
        }

        let isRoomValid = false;
        if (roomType === "Standard" && roomNumber >= 1 && roomNumber <= 300) isRoomValid = true;
        else if (roomType === "Deluxe" && roomNumber >= 301 && roomNumber <= 500) isRoomValid = true;
        else if (roomType === "Luxury Suite" && roomNumber >= 501 && roomNumber <= 520) isRoomValid = true;

        if (!isRoomValid) {
            showCustomAlert(`Nomor kamar tidak sesuai dengan tipe ${roomType} yang Anda pilih!\nStandard: 1 - 300\nDeluxe: 301 - 500\nLuxury Suite: 501 - 520`);
            return; 
        }

        // Validasi Double Booking
        const isRoomAlreadyTaken = hotel.getAllReservations().some((res, idx) => {
            if (editIndex !== null && idx === editIndex) return false;
            return res.getRoom().getIdRoom() === roomNumber;
        });

        if (isRoomAlreadyTaken) {
            showCustomAlert(`Maaf, Kamar Nomor ${roomNumber} saat ini sedang terisi oleh tamu lain!\nSilakan gunakan nomor kamar lain yang masih kosong.`);
            return; 
        }

        const finalCustomerName = specialReq ? `${rawName} | Req: ${specialReq}` : rawName;

        let customer, room, reservation;
        if (editIndex !== null) {
            const resLama = hotel.getAllReservations()[editIndex];
            customer = new Customer(resLama.getCustomer().getIdUser(), finalCustomerName, phone, 0);
            room = new Room(roomNumber, roomType, roomPrice, roomAssets[roomType].imgUrl); 
            reservation = new Reservation(resLama.getIdReservation(), customer, room, days);
            
            hotel.updateReservation(editIndex, reservation);
            editIndex = null;
            bookBtn.innerText = "Book Reservation";
        } else {
            customer = new Customer(`CUST-${Date.now()}`, finalCustomerName, phone, 0);
            room = new Room(roomNumber, roomType, roomPrice, roomAssets[roomType].imgUrl); 
            reservation = new Reservation(`RES-${Date.now()}`, customer, room, days);
            hotel.tambahReservation(reservation);
        }
        
        renderReservations();
        
        document.getElementById("customerName").value = "";
        document.getElementById("customerPhone").value = "";
        document.getElementById("roomNumber").value = "";
        document.getElementById("days").value = "";
        document.getElementById("specialRequest").value = "";
        document.getElementById("roomType").value = "Standard";
        updateRoomUI(); 
        
        showCustomAlert("Booking Success!");
        document.getElementById("menuBookings").click();
    });
}

// ==========================================
// 7. SUBMIT FOOD ORDER (DENGAN CUSTOM ALERT)
// ==========================================
const orderFoodBtn = document.getElementById("orderFoodBtn");
if(orderFoodBtn) {
    orderFoodBtn.addEventListener("click", () => {
        const resIndex = document.getElementById("selectCustomerOrder").value;
        
        if (resIndex === "") {
            showCustomAlert("Please select a room/customer first!"); return;
        }
        if (currentCart.length === 0) {
            showCustomAlert("Please add at least one item to the order."); return;
        }

        const selectedReservation = hotel.getAllReservations()[parseInt(resIndex)];
        const customer = selectedReservation.getCustomer();
        const specialInst = document.getElementById("foodSpecialReq").value;

        const orderItems = currentCart.map(item => {
            const foodName = specialInst && item === currentCart[0] ? `${item.name} (Note: ${specialInst})` : item.name;
            const foodObj = new Food(`F-${Date.now()}-${Math.random()}`, foodName, item.price, item.img);
            return { food: foodObj, quantity: item.qty };
        });

        const order = new Order(`ORD-${Date.now()}`, customer, orderItems); 

        hotel.tambahOrder(order);
        renderReservations();

        currentCart = [];
        document.getElementById("foodSpecialReq").value = "";
        renderCart();
        
        showCustomAlert("Order successfully placed!");
        document.getElementById("menuBookings").click();
    });
}

renderReservations();