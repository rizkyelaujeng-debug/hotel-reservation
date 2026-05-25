// ==========================================
// 1. SISTEM LOGIN SEDERHANA
// ==========================================
const loginScreen = document.getElementById('loginScreen');
const appDashboard = document.getElementById('appDashboard');
const loginBtnSubmit = document.getElementById('loginBtnSubmit');
const loginError = document.getElementById('loginError');
const loginUsernameInput = document.getElementById('loginUsername');
const loginPasswordInput = document.getElementById('loginPassword');

function attemptLogin() {
    const user = loginUsernameInput.value;
    const pass = loginPasswordInput.value;

    if (user === 'admin' && pass === '1234') {
        sessionStorage.setItem('isAdminLoggedIn', 'true');
        loginScreen.style.display = 'none'; 
        appDashboard.style.display = 'block'; 
        loginError.style.display = 'none';
        loginUsernameInput.value = "";
        loginPasswordInput.value = "";
    } else {
        loginError.style.display = 'block'; 
    }
}

if (sessionStorage.getItem('isAdminLoggedIn') === 'true') {
    if(loginScreen && appDashboard) {
        loginScreen.style.display = 'none';
        appDashboard.style.display = 'block';
    }
}

if (loginBtnSubmit) loginBtnSubmit.addEventListener('click', attemptLogin);
if (loginPasswordInput) {
    loginPasswordInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') attemptLogin();
    });
}

// ==========================================
// 2. LOGIKA LOGOUT
// ==========================================
const logoutBtn = document.getElementById('logoutBtn');
if (logoutBtn) {
    logoutBtn.addEventListener('click', (e) => {
        e.preventDefault(); 
        const confirmLogout = confirm("Apakah Anda yakin ingin keluar dari sistem?");
        if (confirmLogout) {
            sessionStorage.removeItem('isAdminLoggedIn'); 
            appDashboard.style.display = 'none'; 
            loginScreen.style.display = 'flex'; 
            loginError.style.display = 'none'; 
        }
    });
}

// ==========================================
// 3. LOGIKA NAVIGASI SIDEBAR & MOBILE RESPONSIVE
// ==========================================
const navItems = document.querySelectorAll('.menu-item');
const pageTitle = document.getElementById('pageTitle');

const secDashboard = document.getElementById('sectionDashboard');
const secBookings = document.getElementById('sectionBookings');
const secRooms = document.getElementById('sectionRooms');
const secFood = document.getElementById('sectionFood');
const secSettings = document.getElementById('sectionSettings');

// Fitur Mobile Menu Sidebar
const mainSidebar = document.getElementById('mainSidebar');
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const closeMenuBtn = document.getElementById('closeMenuBtn');
const sidebarOverlay = document.getElementById('sidebarOverlay');

function toggleMobileMenu() {
    if (mainSidebar && sidebarOverlay) {
        mainSidebar.classList.toggle('show');
        sidebarOverlay.classList.toggle('show');
    }
}

if (mobileMenuBtn) mobileMenuBtn.addEventListener('click', toggleMobileMenu);
if (closeMenuBtn) closeMenuBtn.addEventListener('click', toggleMobileMenu);
if (sidebarOverlay) sidebarOverlay.addEventListener('click', toggleMobileMenu);

function hideAllSections() {
    if(secDashboard) secDashboard.style.display = 'none';
    if(secBookings) secBookings.style.display = 'none';
    if(secRooms) secRooms.style.display = 'none';
    if(secFood) secFood.style.display = 'none';
    if(secSettings) secSettings.style.display = 'none';
}

navItems.forEach(item => {
    item.addEventListener('click', function(e) {
        e.preventDefault(); 
        
        navItems.forEach(nav => nav.classList.remove('active'));
        this.classList.add('active');

        hideAllSections();

        const menuId = this.id;
        if (menuId === 'menuDashboard') {
            pageTitle.innerText = "Overview Dashboard";
            secDashboard.style.display = 'block';
        } else if (menuId === 'menuBookings') {
            pageTitle.innerText = "Active Bookings";
            secBookings.style.display = 'block';
        } else if (menuId === 'menuRooms') {
            pageTitle.innerText = "Room Reservations";
            secRooms.style.display = 'block';
        } else if (menuId === 'menuFood') {
            pageTitle.innerText = "In-Room Dining";
            secFood.style.display = 'block';
        } else if (menuId === 'menuSettings') {
            pageTitle.innerText = "System Settings";
            secSettings.style.display = 'block';
        } else {
            pageTitle.innerText = this.innerText;
            if(secDashboard) secDashboard.style.display = 'block'; 
        }

        // Auto-close menu on mobile after clicking an item
        if (window.innerWidth <= 768 && mainSidebar.classList.contains('show')) {
            toggleMobileMenu();
        }
    });
});

const newReservationBtn = document.getElementById('newReservationBtn');
if (newReservationBtn) {
    newReservationBtn.addEventListener('click', () => {
        document.getElementById('menuRooms').click(); 
        if (window.innerWidth <= 768 && mainSidebar.classList.contains('show')) toggleMobileMenu();
    });
}

// ==========================================
// 4. LOGIKA DARK MODE (MODE MALAM)
// ==========================================
const darkModeToggle = document.getElementById('darkModeToggle');
if (darkModeToggle) {
    darkModeToggle.addEventListener('change', function() {
        if (this.checked) {
            document.body.classList.add('dark-mode');
        } else {
            document.body.classList.remove('dark-mode');
        }
    });
}