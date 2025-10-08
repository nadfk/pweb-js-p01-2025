// Ambil elemen-elemen dari halaman
var usernameInput = document.getElementById("username");
var passwordInput = document.getElementById("password");
var loginForm = document.getElementById("loginForm");
var statusEl = document.getElementById("status");
// Fungsi utama untuk login
function handleLogin(event) {
    event.preventDefault();
    var identifier = usernameInput.value.trim(); // bisa username atau email
    var password = passwordInput.value.trim();
    // Reset status
    statusEl.style.color = "#333";
    statusEl.textContent = "";
    // Validasi input
    if (identifier === "") {
        statusEl.style.color = "red";
        statusEl.textContent = "Username atau email tidak boleh kosong.";
        return;
    }
    if (password === "") {
        statusEl.style.color = "red";
        statusEl.textContent = "Password tidak boleh kosong.";
        return;
    }
    // Tampilkan loading
    statusEl.innerHTML = "<span class=\"spinner\"></span> Sedang memeriksa...";
    // Ambil data user dari API dummy
    fetch("https://dummyjson.com/users")
        .then(function (response) {
        if (!response.ok) {
            throw new Error("Gagal mengambil data pengguna.");
        }
        return response.json();
    })
        .then(function (data) {
        var users = data.users;
        // Cari user berdasarkan username atau email
        var foundUser = users.find(function (u) {
            return u.username.toLowerCase() === identifier.toLowerCase() ||
                u.email.toLowerCase() === identifier.toLowerCase();
        });
        if (!foundUser) {
            statusEl.style.color = "red";
            statusEl.textContent = "Username atau email tidak ditemukan.";
            return;
        }
        // Simpan firstName ke localStorage
        localStorage.setItem("firstName", foundUser.firstName);
        // Tampilkan sukses & redirect
        statusEl.style.color = "green";
        statusEl.textContent = "Login berhasil! Mengarahkan...";
        setTimeout(function () {
            window.location.href = "recipes.html";
        }, 1000);
    })
        .catch(function (error) {
        console.error(error);
        statusEl.style.color = "red";
        statusEl.textContent = "Terjadi kesalahan koneksi ke server.";
    });
}
// Pasang event listener ke form
loginForm.addEventListener("submit", handleLogin);
