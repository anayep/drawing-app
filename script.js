const canvas = document.getElementById('canvas');
ctx = canvas.getContext('2d');
clearCanvas = document.querySelector(".clear-canvas");
slider = document.querySelector('#size-slider');
const tools = document.querySelectorAll(".tool");
const fillColor = document.querySelector('#fill-color');
const centerX = canvas.width / 2;
const centerY = canvas.height / 2;
const radius = 100;

let isDrawing = false;
let activeBtn = "brush";
canvas.width = canvas.offsetWidth;
canvas.height = canvas.offsetHeight;
let startX, startY, snapshot;

console.log(fillColor.checked)

const startDraw = (e) => {
    isDrawing = true;
    ctx.beginPath();
    startX = e.offsetX;
    startY = e.offsetY;
    snapshot = ctx.getImageData(0, 0, canvas.width, canvas.height);
}

const stopDraw = () => {
    isDrawing = false;
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
    if (activeBtn === "brush") {
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

slider.addEventListener("input", () => ctx.lineWidth = slider.value);

clearCanvas.addEventListener("click", () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
});


canvas.addEventListener("mousemove", drawing);
canvas.addEventListener("mousedown", startDraw);
canvas.addEventListener("mouseup", stopDraw);