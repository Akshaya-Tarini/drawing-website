document.getElementById('PenBtn').addEventListener('click', function() {
    document.getElementById('PenContent').classList.toggle('show');
});

document.querySelectorAll('.Pen-content div').forEach(item => {
    item.addEventListener('click', function() {
        document.getElementById('PenBtn').innerHTML = this.innerHTML;
        document.getElementById('PenContent').classList.remove('show');
    });
});

var pensLi = document.querySelector('.pens');
var penMenu = document.querySelector('#PenMenu');

pensLi.addEventListener('click', function(event) {
    event.stopPropagation();

    if (penMenu.style.display === 'none' || penMenu.style.display === '') {
        penMenu.style.display = 'block';
    } else {
        penMenu.style.display = 'none';
    }
});

document.body.addEventListener('click', function(event) {
    var isClickInsidePenMenu = penMenu.contains(event.target); 

    if (!isClickInsidePenMenu) {
        penMenu.style.display = 'none';
    }
});

document.getElementById('ShapeBtn').addEventListener('click', function() {
    document.getElementById('ShapeContent').classList.toggle('show');
});

document.querySelectorAll('.Shape-content div').forEach(item => {
    item.addEventListener('click', function() {
        document.getElementById('ShapeBtn').innerHTML = this.innerHTML;
        document.getElementById('ShapeContent').classList.remove('show');
    });
});

var shapeLi = document.querySelector('.shapes');
var shapeMenu = document.querySelector('#ShapeMenu');

shapeLi.addEventListener('click', function(event) {
    event.stopPropagation();
    if (shapeMenu.style.display === 'none' || shapeMenu.style.display === '') {
        shapeMenu.style.display = 'block';
    } else {
        shapeMenu.style.display = 'none';
    }
});

document.body.addEventListener('click', function(event) {
    if (!shapeMenu.contains(event.target) && !shapeLi.contains(event.target)) {
        shapeMenu.style.display = 'none';
    }
});

document.getElementById('TextBtn').addEventListener('click', function() {
    document.getElementById('TextContent').classList.toggle('show');
});

document.querySelectorAll('.Text-content div').forEach(item => {
    item.addEventListener('click', function() {
        document.getElementById('TextBtn').innerHTML = this.innerHTML;
        document.getElementById('TextContent').classList.remove('show');
    });
});

var textLi = document.querySelector('.texts');
var textMenu = document.querySelector('#TextMenu');

textLi.addEventListener('click', function(event) {
    event.stopPropagation();
    if (textMenu.style.display === 'none' || textMenu.style.display === '') {
        textMenu.style.display = 'block';
    } else {
        textMenu.style.display = 'none';
    }
});

document.body.addEventListener('click', function(event) {
    if (!textMenu.contains(event.target) && !textLi.contains(event.target)) {
        textMenu.style.display = 'none';
    }
});

const eraserButton = document.querySelector('.erasers');
const eraserMenu = document.getElementById('EraserMenu');

eraserButton.addEventListener('click', function (event) {
    event.stopPropagation();
    eraserMenu.style.display = eraserMenu.style.display === 'none' || eraserMenu.style.display === '' ? 'block' : 'none';
});

document.addEventListener('click', function (event) {
    if (!eraserMenu.contains(event.target) && !eraserButton.contains(event.target)) {
        eraserMenu.style.display = 'none';
    }
});

const fillButton = document.querySelector('.fill');
const fillMenu = document.getElementById('FillMenu');

fillButton.addEventListener('click', function (event) {
    event.stopPropagation();
    fillMenu.style.display = fillMenu.style.display === 'none' || fillMenu.style.display === '' ? 'block' : 'none';
});

document.addEventListener('click', function (event) {
    if (!fillMenu.contains(event.target) && !fillButton.contains(event.target)) {
        fillMenu.style.display = 'none';
    }
});
const canvas = document.getElementById('drawCanvas');
const ctx = canvas.getContext('2d');
 
let painting = false;
let brushSize = 5;
let brushColor = '#000000';
let brushType = 'brush'; 
let tool = 'pen';
let shapeType , shapeColor;
let prevMouseX, prevMouseY;
let lastX, lastY; 

canvas.addEventListener('mousedown', startPainting);
canvas.addEventListener('mousemove', draw);
canvas.addEventListener('mouseup', stopPainting);
canvas.addEventListener('mouseleave', stopPainting);

const setCanvasBackground = () => {
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

window.addEventListener("load", () => {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    setCanvasBackground();
});

function startPainting(e) {
    painting = true;
    prevMouseX = e.offsetX; 
    prevMouseY = e.offsetY;
    const rect = canvas.getBoundingClientRect();
    lastX = (e.clientX - rect.left) ;
    lastY = (e.clientY - rect.top) ;
    ctx.beginPath();
    draw(e); 
}

let undoStack = [];
let redoStack = [];
let lastAction = null; 

function saveState() {
    let currentState = {
        tool: tool,
        brushType: brushType,
        brushSize: brushSize,
        brushColor: brushColor,
        shapeType: shapeType,
        shapeColor: shapeColor,
        prevState: ctx.getImageData(0, 0, canvas.width, canvas.height),
    };
    undoStack.push(currentState);
    redoStack = []; 
}

function undo() {
    if (undoStack.length > 0) {
        let currentState = undoStack.pop();
        redoStack.push(currentState);

        ctx.putImageData(currentState.prevState, 0, 0);
        lastAction = currentState; 
    }
}

function redo() {
    if (redoStack.length > 0) {
        let currentState = redoStack.pop();
        undoStack.push(currentState);

        ctx.putImageData(currentState.prevState, 0, 0);
        lastAction = currentState; 
    }
}

function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setCanvasBackground();
    undoStack = [];
    redoStack = [];
}


function draw(e) {
    if (!painting) return;

    saveState(); 
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left);
    const y = (e.clientY - rect.top);

    if (tool === 'pen') {
        ctx.lineWidth = brushSize;
        ctx.strokeStyle = brushColor;
        ctx.lineCap = 'round';

        if (brushType === 'brush') {
            ctx.lineTo(x, y);
            ctx.stroke();
            ctx.beginPath();
            ctx.fillStyle = brushColor;
            ctx.arc(x, y, brushSize / 2, 0, Math.PI * 2);
            ctx.fill();
            ctx.beginPath();
            ctx.moveTo(x, y);
        } 
        else if (brushType === 'square') {
            ctx.fillRect(x , y , brushSize * 2, brushSize * 2);
        } 
        else if (brushType === 'mirror') {
            const mirroredX = canvas.width - x;
            ctx.beginPath();
            ctx.arc(x, y, ctx.lineWidth / 2, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = brushColor;
            ctx.beginPath();
            ctx.arc(mirroredX, y, ctx.lineWidth / 2, 0, Math.PI * 2);
            ctx.fill();
        } 
        else if (brushType === 'pencil') {
            ctx.strokeStyle = brushColor;
            ctx.lineWidth = Math.max(1, brushSize - 15);
            ctx.lineCap = 'round';
            ctx.lineTo(x, y);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(x, y);
        } 
        else if (brushType === 'crayon') {
            ctx.fillStyle = brushColor;
            for (let i = 0; i < 15; i++) {
                const offsetX = Math.random() * brushSize - brushSize / 2;
                const offsetY = Math.random() * brushSize - brushSize / 2;
                ctx.fillRect(x + offsetX, y + offsetY, 1, 1);
            }
        }
    } 
    else if (tool === 'eraser') {
        ctx.globalCompositeOperation = 'destination-out';
        ctx.lineWidth = brushSize;
        ctx.lineCap = 'round';

        ctx.lineTo(x, y);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(x, y);

        ctx.globalCompositeOperation = 'source-over';
    }
    else if(tool == 'shapes'){
        ctx.strokeStyle = brushColor;
        ctx.fillStyle = shapeColor;
        if (shapeType === 'triangle') {
            drawTriangle(e);
        }
        else if(shapeType === 'rectangle'){
            drawRect(e);
        }
        else if(shapeType === 'circle'){
            drawCircle(e);
        }
        else if(shapeType === 'square'){
            drawSquare(e);
        }
        else if(shapeType === 'line'){
            drawLine(e);
        }
        else if(shapeType === 'arrow'){
            drawArrow(e);
        }
    }
   
}

function stopPainting() {
    painting = false;
    ctx.beginPath();
}

function changeBrushSize(size) {
    brushSize = size;
}

function changeBrushColor(color) {
    brushColor = color;
}

function changeShapeColor(color){
    shapeColor = color;
}

function activatePen() {
    tool = 'pen';
    brushSize = 5;
    brushColor = 'black';
}

document.getElementById('PenColor').addEventListener('input', (e) => {
    changeBrushColor(e.target.value);
});

document.querySelectorAll('.brush-option').forEach(option => {
    option.addEventListener('click', (e) => {
        brushType = e.target.closest('.brush-option').dataset.type;
    });
});

function activateEraser() {
    tool = 'eraser';
    brushSize = 5;
    brushColor = 'black';
}

function activateShapes(){
    tool = 'shapes';
    brushColor = 'black';
    shapeColor = 'white';
    brushSize = 5;
}

document.querySelectorAll('.shape-option').forEach(option => {
    option.addEventListener('click', (e) => {
        shapeType = e.target.closest('.shape-option').dataset.type;
    });
});

document.getElementById('ShapeColor').addEventListener('input', (e) => {
    changeShapeColor(e.target.value);
});

document.getElementById('ShapeOutline').addEventListener('input', (e) => {
    changeBrushColor(e.target.value);
});

function activateFill() {

    const fillColorInput = document.getElementById('FillColor');
    fillColorInput.addEventListener('input', function() {
        const color = fillColorInput.value;
        fillCanvas(color);
    });
}

function fillCanvas(color) {
    saveState();
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

document.getElementById('undoButton').addEventListener('click', undo);

document.getElementById('redoButton').addEventListener('click', redo);

document.getElementById('clearButton').addEventListener('click', clearCanvas);

const drawTriangle = (e) => {
    ctx.strokeStyle = brushColor;
    ctx.fillStyle = shapeColor;
    ctx.beginPath(); 
    ctx.moveTo(prevMouseX, prevMouseY);
    ctx.lineTo(e.offsetX, e.offsetY); 
    ctx.lineTo(prevMouseX * 2 - e.offsetX, e.offsetY); 
    ctx.closePath(); 
    ctx.fill();
    ctx.stroke();
}

const drawRect = (e) => {
    ctx.strokeStyle = brushColor;
    ctx.fillStyle = shapeColor;
    const width = prevMouseX - e.offsetX;
    const height = prevMouseY - e.offsetY;
    ctx.fillRect(e.offsetX, e.offsetY, width, height);
    ctx.fill();
    ctx.stroke();
}

const drawCircle = (e) => {
    ctx.strokeStyle = brushColor;
    ctx.fillStyle = shapeColor;
    ctx.beginPath();
    let radius = Math.sqrt(Math.pow((prevMouseX -
    e.offsetX), 2) 
    + Math.pow((prevMouseY - e.offsetY), 2));
    ctx.arc(prevMouseX, prevMouseY, radius, 0, 2 * Math.PI);
    ctx.fill();
    ctx.stroke();
}

const drawSquare = (e) => {
    ctx.strokeStyle = brushColor;
    ctx.fillStyle = shapeColor;
    const sideLength = Math.abs(prevMouseX - e.offsetX);
    ctx.beginPath();
    ctx.rect(e.offsetX, e.offsetY, sideLength, sideLength);
    ctx.fill();
    ctx.stroke();
}

const drawLine = (e) => {
    ctx.beginPath();
    ctx.moveTo(prevMouseX, prevMouseY);
    ctx.lineTo(e.offsetX, e.offsetY);
    ctx.stroke();
}

const drawArrow = (e) => {
    ctx.strokeStyle = brushColor;
    ctx.fillStyle = shapeColor;
    const headLength = 30;
    const angle = Math.atan2(e.offsetY - prevMouseY,
    e.offsetX - prevMouseX);
    ctx.beginPath();
    ctx.moveTo(prevMouseX, prevMouseY);
    ctx.lineTo(e.offsetX, e.offsetY);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(e.offsetX - headLength * 
    Math.cos(angle - Math.PI / 6), 
    e.offsetY - headLength * 
    Math.sin(angle - Math.PI / 6));
    ctx.lineTo(e.offsetX, e.offsetY);
    ctx.lineTo(e.offsetX - headLength * 
    Math.cos(angle + Math.PI / 6),
    e.offsetY - headLength * 
    Math.sin(angle + Math.PI / 6));
    ctx.closePath();
    ctx.stroke();
    ctx.fill();
}

let currentFont = 'Arial';
let currentColor = '#000000';
let currentOutline = '#000000';
let currentSize = 16;

document.addEventListener('DOMContentLoaded', () => {
    const textInput = document.getElementById('text-input');
    const addTextBtn = document.getElementById('add-text-btn');
    const textColorInput = document.getElementById('TextColor');
    const textOutlineInput = document.getElementById('TextBackground');
    const textSizeInput = document.getElementById('TextSize');
    const textMenu = document.getElementById('TextContent');
    let activeTextBox = null;
    let offsetX, offsetY;

    function createTextBox(text, left, top) {
        const textBox = document.createElement('div');
        textBox.classList.add('text-box');
        textBox.style.left = `${left}px`;
        textBox.style.top = `${top}px`;
        textBox.style.position = 'absolute';
        textBox.style.cursor = 'move';

        const span = document.createElement('span');
        span.textContent = text;
        applyTextStyles(span);

        const editButton = document.createElement('button');
        editButton.classList.add('edit-button');
        editButton.textContent = 'Change text';
        editButton.style.display = 'none';

        const deleteButton = document.createElement('button');
        deleteButton.classList.add('delete-button');
        deleteButton.textContent = 'Delete';
        deleteButton.style.display = 'none';

        textBox.appendChild(span);
        textBox.appendChild(editButton);
        textBox.appendChild(deleteButton);
        document.body.appendChild(textBox);

        textBox.addEventListener('mousedown', (e) => {
            if (e.target === span) {
                editButton.style.display = 'inline';
                deleteButton.style.display = 'inline';
                activeTextBox = textBox;
                offsetX = e.offsetX;
                offsetY = e.offsetY;
            }
        });

        textBox.addEventListener('mouseup', () => {
            activeTextBox = null;
        });

        textBox.addEventListener('mousemove', (e) => {
            if (activeTextBox) {
                activeTextBox.style.left = `${e.clientX - offsetX}px`;
                activeTextBox.style.top = `${e.clientY - offsetY}px`;
            }
        });

        textBox.addEventListener('click', (e) => {
            if (e.target === span) {
                editButton.style.display = 'inline';
                deleteButton.style.display = 'inline';
            }
        });

        editButton.addEventListener('click', () => {
            const input = document.createElement('input');
            input.type = 'text';
            input.value = span.textContent;
            textBox.replaceChild(input, span);
            input.focus();

            input.addEventListener('blur', () => {
                span.textContent = input.value;
                textBox.replaceChild(span, input);
                applyTextStyles(span);
                editButton.style.display = 'none';
                deleteButton.style.display = 'none';
            });

            input.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') {
                    span.textContent = input.value;
                    textBox.replaceChild(span, input);
                    applyTextStyles(span);
                    editButton.style.display = 'none';
                    deleteButton.style.display = 'none';
                }
            });
        });

        deleteButton.addEventListener('click', () => {
            document.body.removeChild(textBox);
        });
    }

    function applyTextStyles(span) {
        span.style.color = textColorInput.value;
        span.style.backgroundColor = textOutlineInput.value;
        span.style.fontSize =` ${textSizeInput.value}px`;
        span.style.fontFamily = getSelectedFont();
    }

    function getSelectedFont() {
        const selectedFont = textMenu.querySelector('.selected');
        return selectedFont ? selectedFont.textContent : 'Arial';
    }

    addTextBtn.addEventListener('click', () => {
        const text = textInput.value;
        if (text) {
            createTextBox(text, 50, 50);
            textInput.value = '';
        }
    });

    textMenu.addEventListener('click', (e) => {
        if (e.target !== textMenu) {
            Array.from(textMenu.children).forEach(child => child.classList.remove('selected'));
            e.target.classList.add('selected');
        }
    });

    textColorInput.value = '#000000';
    textOutlineInput.value = '#ffffff';
    textSizeInput.value = '16';
});

document.addEventListener('DOMContentLoaded', () => {
    if (typeof html2canvas === 'undefined') {
        console.error('html2canvas library is not loaded.');
        return;
    }

    document.getElementById('saveButton').addEventListener('click', function() {
        const captureArea = document.getElementById('captureArea');
        if (!captureArea) {
            console.error('Capture area not found.');
            return;
        }

        html2canvas(captureArea).then(canvas => {
            const imageSrc = canvas.toDataURL();
            const link = document.createElement('a');
            link.download = 'captured_image.png';
            link.href = imageSrc;
            link.click();

            const savedImages = JSON.parse(localStorage.getItem('savedImages')) || [];
            if (!savedImages.includes(imageSrc)) {
                savedImages.push(imageSrc);
                localStorage.setItem('savedImages', JSON.stringify(savedImages));
            }
            setTimeout(() => {
                window.location.href = './saved.html';
            }, 500); 
        }).catch(error => {
            console.error('Error capturing the area:', error);
        });
    });
});
