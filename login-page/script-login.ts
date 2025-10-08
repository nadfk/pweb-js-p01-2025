(() => {
  const usernameInput = document.getElementById("username")! as HTMLInputElement;
  const passwordInput = document.getElementById("password")! as HTMLInputElement;
  const loginForm = document.getElementById("loginForm")! as HTMLFormElement;
  const statusEl = document.getElementById("status")! as HTMLElement;

  function handleLogin(event: Event): void {
      event.preventDefault();
      
      const identifier = usernameInput.value.trim();
      const password = passwordInput.value.trim();

      statusEl.style.color = "#333";
      statusEl.textContent = "";

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

      statusEl.innerHTML = `<span class="spinner"></span> Sedang memeriksa...`;

      fetch("https://dummyjson.com/users")
          .then(response => {
              if (!response.ok) {
                  throw new Error("Gagal mengambil data pengguna.");
              }
              return response.json();
          })
          .then(data => {
              const users = data.users;

              const foundUser = users.find((u: any) => 
                  u.username.toLowerCase() === identifier.toLowerCase() ||
                  u.email.toLowerCase() === identifier.toLowerCase()
              );

              if (!foundUser) {
                  statusEl.style.color = "red";
                  statusEl.textContent = "Username atau email tidak ditemukan.";
                  return;
              }

              localStorage.setItem("firstName", foundUser.firstName);

              statusEl.style.color = "green";
              statusEl.textContent = "Login berhasil! Mengarahkan...";
              setTimeout(() => {
                  window.location.href = "../main-page/recipes.html";
              }, 1000);
          })
          .catch(error => {
              console.error(error);
              statusEl.style.color = "red";
              statusEl.textContent = "Terjadi kesalahan koneksi ke server.";
          });
  }

  loginForm.addEventListener("submit", handleLogin);
})();