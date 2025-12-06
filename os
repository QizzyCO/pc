<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>Web OS Simple</title>
<style>
    body {
        margin: 0;
        overflow: hidden;
        font-family: Arial, sans-serif;
        background: url('https://wallpaperaccess.com/full/317501.jpg') center/cover no-repeat;
    }

    /* Taskbar */
    .taskbar {
        position: fixed;
        bottom: 0;
        left: 0;
        width: 100%;
        height: 40px;
        background: rgba(0,0,0,0.7);
        display: flex;
        align-items: center;
        color: white;
        padding: 0 10px;
    }

    .start-btn {
        background: rgba(255,255,255,0.2);
        padding: 5px 12px;
        border-radius: 5px;
        cursor: pointer;
        margin-right: 10px;
    }

    /* Icon Desktop */
    .icon {
        width: 80px;
        text-align: center;
        color: white;
        cursor: pointer;
        margin: 20px;
        display: inline-block;
    }

    .icon img {
        width: 60px;
    }

    /* Window */
    .window {
        width: 300px;
        height: 200px;
        background: white;
        position: absolute;
        top: 100px;
        left: 100px;
        border-radius: 6px;
        box-shadow: 0px 0px 10px black;
        display: none;
        flex-direction: column;
    }

    .window-header {
        background: #0078ff;
        color: white;
        padding: 5px 10px;
        cursor: move;
    }

    .window-body {
        flex: 1;
        padding: 10px;
    }

    .close-btn {
        float: right;
        cursor: pointer;
    }
</style>
</head>
<body>

<!-- Desktop Icons -->
<div class="icon" onclick="openWindow()">
    <img src="https://cdn-icons-png.flaticon.com/512/716/716784.png">
    <div>File</div>
</div>

<!-- Window App -->
<div class="window" id="appWindow">
    <div class="window-header" id="dragZone">
        File Explorer
        <span class="close-btn" onclick="closeWindow()">✖</span>
    </div>
    <div class="window-body">
        <p>Ini contoh jendela aplikasi.</p>
    </div>
</div>

<!-- Taskbar -->
<div class="taskbar">
    <div class="start-btn">Start</div>
    <div>Web OS</div>
</div>

<script>
    // Open & Close Window
    function openWindow() {
        document.getElementById("appWindow").style.display = "flex";
    }
    function closeWindow() {
        document.getElementById("appWindow").style.display = "none";
    }

    // Drag Window
    const win = document.getElementById("appWindow");
    const dragZone = document.getElementById("dragZone");

    let offsetX = 0, offsetY = 0, isDragging = false;

    dragZone.addEventListener('mousedown', (e) => {
        isDragging = true;
        offsetX = e.clientX - win.offsetLeft;
        offsetY = e.clientY - win.offsetTop;
    });

    document.addEventListener('mousemove', (e) => {
        if (isDragging) {
            win.style.left = (e.clientX - offsetX) + "px";
            win.style.top = (e.clientY - offsetY) + "px";
        }
    });

    document.addEventListener('mouseup', () => {
        isDragging = false;
    });
</script>

</body>
</html>
