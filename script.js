const canvas = document.getElementById('canvas');
ctx = canvas.getContext('2d');

const clearCanvas = document.querySelector(".clear-canvas");
const slider = document.querySelector('#size-slider');
const tools = document.querySelectorAll(".tool");
const colorPicker = document.querySelector("#color-picker");
const fillColor = document.querySelector('#fill-color');
const colorBtns = document.querySelectorAll('.colors .option')
const undoBtn = document.querySelector('.undo-button');
const saveImg = document.querySelector(".save-img");
const popUp = document.querySelector("#myPopup");

canvas.width = canvas.offsetWidth;
canvas.height = canvas.offsetHeight;

const centerX = canvas.width / 2;
const centerY = canvas.height / 2;
const radius = 100;

let isDrawing = false;
let activeBtn = "brush";
let brushWidth;
let selectedColor;
let startX, startY, snapshot;
let snapshotUndo = [];

const startDraw = (e) => {
    snapshotUndo.push(ctx.getImageData(0, 0, canvas.width, canvas.height)); // remember prev canvas for undo
    isDrawing = true;
    ctx.beginPath();
    startX = e.offsetX;
    startY = e.offsetY;
    ctx.lineWidth = brushWidth; 
    ctx.strokeStyle = selectedColor;
    ctx.fillStyle = selectedColor;
    snapshot = ctx.getImageData(0, 0, canvas.width, canvas.height);
}

const undo = () => {
    console.log("im in undo")
    ctx.putImageData(snapshotUndo.pop(), 0, 0);
}

const drawRect = (e) => {
    if(fillColor.checked === false) {
        return ctx.strokeRect(e.offsetX, e.offsetY, startX-e.offsetX, startY-e.offsetY);
    }
    return ctx.fillRect(e.offsetX, e.offsetY, startX-e.offsetX, startY-e.offsetY);
}

const drawCircle = (e) => {
    ctx.beginPath();
    let radius = Math.sqrt(Math.pow((startX - e.offsetX), 2) + Math.pow((startY - e.offsetY), 2));
    ctx.arc(startX, startY, radius, 0, 2 * Math.PI); 
    if(fillColor.checked) ctx.fill();
    else ctx.stroke();
}

const drawTriangle = (e) => {
    ctx.beginPath(); 
    ctx.moveTo(startX, startY); 
    ctx.lineTo(e.offsetX, e.offsetY); 
    ctx.lineTo(startX * 2 - e.offsetX, e.offsetY); 
    ctx.closePath();
    if(fillColor.checked == true) ctx.fill();
    else ctx.stroke();

}

const drawing = (e) => {
    if (isDrawing == false) return;
    ctx.putImageData(snapshot, 0, 0);
    if (activeBtn === "brush" || activeBtn === "eraser") {
        if (activeBtn === "eraser") ctx.strokeStyle = "white"
        ctx.lineTo(e.offsetX, e.offsetY);
        ctx.stroke();
    }
    else if (activeBtn === "rectangle") { drawRect(e); }
    else if (activeBtn ==="circle") { drawCircle(e); }
    else { drawTriangle(e); }
    
}



for (let tool of tools) {
    tool.addEventListener("click", () => {
        document.querySelector(".options .active").classList.remove("active");
        tool.classList.add("active");
        activeBtn = tool.id;
        console.log(activeBtn)
    })
    
}

colorBtns.forEach(btn => {
    btn.addEventListener("click", () => {
        document.querySelector(".options .selected").classList.remove("selected");
        btn.classList.add("selected");
        selectedColor = window.getComputedStyle(btn).getPropertyValue("background-color");
    });
});

colorPicker.addEventListener("change", () => {
    colorPicker.parentElement.style.background = colorPicker.value;
    colorPicker.parentElement.click();
});

slider.addEventListener("input", () => ctx.lineWidth = slider.value);

clearCanvas.addEventListener("click", () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
});


saveImg.addEventListener("click", () => {
    const link = document.createElement("a");
    link.download = `${Date.now()}.jpg`;
    link.href = canvas.toDataURL();
    link.click(); 
});

addEventListener("load",() => {
    popUp.classList.toggle("show");
    setTimeout( () => {
        popUp.classList.toggle("show");
    },3000)
})

canvas.addEventListener("mousemove", drawing);
canvas.addEventListener("mousedown", startDraw);
canvas.addEventListener("mouseup", () => {
    isDrawing = false;
});
undoBtn.addEventListener("click", undo);