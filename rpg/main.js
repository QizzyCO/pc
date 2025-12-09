// =========================================================
// 1. VARIABEL GLOBAL
// =========================================================
let scene, camera, renderer;
let world; // Dunia fisika Cannon-es

// Karakter
let playerMesh; // Representasi visual (Three.js)
let playerBody; // Representasi fisika (Cannon-es)
const playerSpeed = 7;
const keys = {}; // Objek untuk melacak tombol yang ditekan

// =========================================================
// 2. INISIALISASI GAME
// =========================================================
function init() {
    // --- Setup Scene dan Renderer (THREE.js) ---
    scene = new THREE.Scene();
    
    // Gunakan kamera perspektif untuk efek 2.5D
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(10, 15, 10); // Posisi awal kamera
    camera.lookAt(0, 0, 0);
    
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    // --- Setup Cahaya ---
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(10, 20, 10);
    scene.add(directionalLight);

    // --- Setup Dunia Fisika (CANNON-ES) ---
    world = new CANNON.World();
    world.gravity.set(0, -9.82, 0); // Gravitasi ke bawah (sumbu Y)
    
    // Tambahkan komponen
    createGround();
    createPlayer();
    
    // --- Event Listeners (Input) ---
    window.addEventListener('keydown', (event) => keys[event.key.toLowerCase()] = true);
    window.addEventListener('keyup', (event) => keys[event.key.toLowerCase()] = false);
    window.addEventListener('resize', onWindowResize);
    
    // Mulai game loop
    animate();
}

// =========================================================
// 3. PEMBUATAN OBJEK (GROUND DAN PLAYER)
// =========================================================

function createGround() {
    // --- Grafis (Three.js) ---
    const groundGeometry = new THREE.PlaneGeometry(100, 100);
    // Material hijau untuk rumput
    const groundMaterial = new THREE.MeshLambertMaterial({ color: 0x66cc66 });
    const groundMesh = new THREE.Mesh(groundGeometry, groundMaterial);
    groundMesh.rotation.x = -Math.PI / 2; // Putar agar datar
    groundMesh.position.y = -0.5; // Sedikit di bawah sumbu Y=0
    scene.add(groundMesh);

    // --- Fisika (Cannon-es) ---
    const groundShape = new CANNON.Plane();
    const groundBody = new CANNON.Body({ mass: 0 }); // mass: 0 berarti tidak bergerak
    groundBody.addShape(groundShape);
    groundBody.quaternion.setFromEuler(-Math.PI / 2, 0, 0); // Putar agar datar
    world.addBody(groundBody);
}

function createPlayer() {
    // --- Fisika (Cannon-es) ---
    // Gunakan bentuk silinder/kapsul untuk simulasi karakter RPG
    const radius = 0.5;
    const height = 1.0;
    const playerShape = new CANNON.Cylinder(radius, radius, height, 16);
    
    playerBody = new CANNON.Body({ 
        mass: 5, // Massa karakter
        position: new CANNON.Vec3(0, 5, 0), // Posisi awal di udara
        shape: playerShape
    });
    // Atur damping agar karakter berhenti saat tidak ada input
    playerBody.linearDamping = 0.9;
    world.addBody(playerBody);
    
    // --- Grafis (Three.js) ---
    const playerGeometry = new THREE.CapsuleGeometry(radius, height);
    const playerMaterial = new THREE.MeshPhongMaterial({ color: 0x0077ff });
    playerMesh = new THREE.Mesh(playerGeometry, playerMaterial);
    scene.add(playerMesh);

    // Posisikan kamera di belakang karakter untuk efek 2.5D/RPG
    camera.position.set(playerBody.position.x + 8, playerBody.position.y + 10, playerBody.position.z + 8);
    camera.lookAt(playerBody.position.x, playerBody.position.y + 1, playerBody.position.z);
}

// =========================================================
// 4. GAME LOOP (ANIMASI DAN UPDATE FISIKA)
// =========================================================

function animate() {
    requestAnimationFrame(animate);

    // 1. Langkah Fisika (Sekitar 60 kali per detik)
    world.step(1/60); 

    // 2. Gerakan Karakter dan Input
    handlePlayerMovement();
    
    // 3. Sinkronisasi (Grafis mengikuti Fisika)
    playerMesh.position.copy(playerBody.position);
    playerMesh.quaternion.copy(playerBody.quaternion);

    // 4. Update Posisi Kamera (Mengikuti Karakter)
    updateCamera();

    // 5. Render Scene
    renderer.render(scene, camera);
}

function handlePlayerMovement() {
    const currentVelocity = playerBody.velocity;
    let desiredVelocityX = 0;
    let desiredVelocityZ = 0;

    // Gerakan Horizontal (X dan Z)
    if (keys.w) desiredVelocityZ = -playerSpeed; // Maju
    if (keys.s) desiredVelocityZ = playerSpeed;  // Mundur
    if (keys.a) desiredVelocityX = -playerSpeed; // Kiri
    if (keys.d) desiredVelocityX = playerSpeed;  // Kanan

    // Terapkan kecepatan, pertahankan kecepatan Y (vertikal) yang dikelola oleh gravitasi/fisika
    playerBody.velocity.set(desiredVelocityX, currentVelocity.y, desiredVelocityZ);

    // JIKA INGIN TAMBAH LOMPAT (HANYA JIKA KARAKTER DI TANAH)
    // if (keys[' ']) { // Spasi untuk lompat
    //    if (Math.abs(currentVelocity.y) < 0.01) { // Periksa apakah hampir diam di sumbu Y (di tanah)
    //         playerBody.velocity.y = 8; // Terapkan dorongan lompatan
    //    }
    // }
}

function updateCamera() {
    // Atur offset agar kamera berada di belakang dan atas karakter
    const offset = new THREE.Vector3(8, 10, 8);
    const targetPosition = playerBody.position.clone().add(offset);

    // Interpolasi halus (untuk kamera yang lebih mulus)
    camera.position.lerp(targetPosition, 0.1);

    // Arahkan kamera ke karakter
    camera.lookAt(playerBody.position.x, playerBody.position.y + 1, playerBody.position.z);
}

// Penyesuaian saat jendela diubah ukurannya
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

// Panggil fungsi inisialisasi untuk memulai game
init();
