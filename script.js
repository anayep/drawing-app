
const canvas = document.getElementById('canvas');
ctx = canvas.getContext('2d');
clearCanvas = document.querySelector(".clear-canvas");
slider = document.querySelector('#size-slider');
const centerX = canvas.width / 2;
const centerY = canvas.height / 2;
const radius = 100;

let isDrawing = false;

canvas.width  = canvas.offsetWidth;
canvas.height = canvas.offsetHeight; 

const startDraw = (e) => {
    isDrawing = true;
    ctx.beginPath();
} 

const stopDraw = () => {
    isDrawing = false;
}
const drawing = (e) => {
    if(isDrawing==false) return;
    ctx.lineTo(e.offsetX, e.offsetY);
    ctx.stroke();
}  

slider.addEventListener("input", () =>  ctx.lineWidth = slider.value);

clearCanvas.addEventListener("click", () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
});

canvas.addEventListener("mousemove", drawing);
canvas.addEventListener("mousedown", startDraw);
canvas.addEventListener("mouseup", stopDraw);