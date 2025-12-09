const container = document.querySelector(".container");
const finalImage = document.querySelector(".final-image");
const gameElements = document.querySelectorAll('.poi');

// Data Karakter Awal
let player = {
  hp: 100,
  xp: 50,
  // 0.05 sesuai dengan 5% radius di CSS
  visionRadius: 0.05 
};
let isGameOver = false;


// 1. Logika Pergerakan Mouse dan Interaksi
container.addEventListener("mousemove", (event) => {
  if (isGameOver) return;
  
  window.requestAnimationFrame(() => {
    const rect = container.getBoundingClientRect();
    // Koordinat relatif terhadap container
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    // Atur variabel CSS untuk clip-path (Efek Senter)
    finalImage.style.setProperty("--x", `${x}px`);
    finalImage.style.setProperty("--y", `${y}px`);

    // Cek interaksi game
    checkInteraction(x, y, rect.width);
  });
});


// 2. Logika Game (Deteksi Interaksi)
function checkInteraction(cursorX, cursorY, containerWidth) {
  // Hitung radius deteksi dalam piksel
  const radiusPx = containerWidth * player.visionRadius; 

  gameElements.forEach(element => {
    // Abaikan jika sudah berinteraksi
    if (element.classList.contains('revealed')) return;

    const rect = element.getBoundingClientRect();
    // Hitung koordinat tengah elemen POI relatif terhadap container
    const elementCenterX = rect.left + rect.width / 2 - container.getBoundingClientRect().left;
    const elementCenterY = rect.top + rect.height / 2 - container.getBoundingClientRect().top;
    
    // Perhitungan Jarak (Pythagoras)
    const distance = Math.sqrt(
      Math.pow(cursorX - elementCenterX, 2) + Math.pow(cursorY - elementCenterY, 2)
    );

    const name = element.getAttribute('data-name');

    // Jika jarak kursor ke POI kurang dari radius pandangan
    if (distance < radiusPx) {
      // INTERAKSI DITEMUKAN
      element.classList.add('revealed'); // Tandai sebagai sudah berinteraksi

      if (element.classList.contains('enemy-icon')) {
          // Musuh (Menerima Damage)
          player.hp -= 15;
          updateMessage(`Anda disergap oleh ${name}! Anda terluka (-15 HP).`, 'red');
      } else if (element.classList.contains('item-icon')) {
          // Item (Ambil HP/XP)
          player.hp = Math.min(100, player.hp + 20); // Maksimal HP 100
          updateMessage(`Anda menemukan ${name}. +20 HP!`, 'lime');
          player.xp += 10;
          // Item dihapus
          element.remove(); 
      }
      updateUI();
    }
  });
}

// 3. Logika UI RPG
function updateMessage(msg, color) {
  const messageBox = document.getElementById('game-messages');
  const newMessage = document.createElement('p');
  newMessage.innerHTML = `[${new Date().toLocaleTimeString()}] ${msg}`;
  newMessage.style.color = color || 'lightgray';
  
  // Masukkan pesan baru di atas
  messageBox.prepend(newMessage);
  
  // Batasi jumlah pesan
  while (messageBox.children.length > 10) {
      messageBox.removeChild(messageBox.lastChild);
  }
}

function updateUI() {
    document.getElementById('hp').textContent = `HP: ${player.hp}`;
    document.getElementById('xp').textContent = `XP: ${player.xp}`;

    if (player.hp <= 0 && !isGameOver) {
        isGameOver = true;
        player.hp = 0;
        document.getElementById('hp').textContent = `HP: ${player.hp}`;
        updateMessage("Kesehatan Anda habis! GAME OVER. Refresh untuk mulai lagi.", 'red');
        // Di sini Anda bisa menambahkan overlay Game Over
    }
}

// Inisialisasi UI saat game dimulai
updateUI();


// 4. Inisialisasi particles.js
particlesJS("particles-js", {
  particles: {
    number: { value: 52, density: { enable: true, value_area: 600 } },
    color: { value: "#fff" },
    shape: { type: "circle", stroke: { width: 0, color: "#000000" } },
    opacity: { value: 0.6, random: true, anim: { enable: false } },
    size: { value: 5, random: true, anim: { enable: false } },
    line_linked: { enable: false },
    move: { enable: true, speed: 2, direction: "bottom", random: false, straight: false, out_mode: "out", bounce: false, attract: { enable: false } }
  },
  interactivity: {
    detect_on: "canvas",
    events: { onhover: { enable: false }, onclick: { enable: true }, resize: true }
  },
  retina_detect: true
});
