let Video = null
let canvas = null
let ctx = null

let scaler = 0.8 //scaler for video
let size = { x: 0, y: 0, width: 0, height: 0 }

let rows = 3
let cols = 3
let pieces = []

let selected_piece = null
let beat = new Audio('/success-fanfare-trumpets-6185.mp3');
let sound = new Audio('interface-124464.mp3');

function main() {
    canvas = document.getElementById("mycanvas")
    ctx = canvas.getContext("2d")
    addEventListeners()

    // Request access to user's camera
    let promise = navigator.mediaDevices.getUserMedia({ video: true });

    promise.then(function (signal) {
        Video = document.createElement("video")
        Video.srcObject = signal;
        Video.play();
        Video.onloadeddata = function () {

            handleResize();
            //enable below for responsive
            window.addEventListener('resize', handleResize)

            initialisePieces(rows, cols)
            updateCanvas();
        }
    }).catch(function (err) {
        alert("Camera error : " + err);
    });
    console.log("main")
}

function addEventListeners() {
    canvas.addEventListener("mousedown", onMouseDown)
    canvas.addEventListener("mouseup", onMouseUp)
    canvas.addEventListener("mousemove", onMouseMove)

    //mobile version
    canvas.addEventListener("touchstart", onTouchStart)
    canvas.addEventListener("touchend", onTouchEnd)
    canvas.addEventListener("touchmove", onTouchMove)
}

function onTouchStart(evt){
    let loc = {
        x:evt.touches[0].clientX,
        y:evt.touches[0].clientY
    }
    onMouseDown(loc)
} 
function onTouchEnd(){

    onMouseUp()
} 
function onTouchMove(evt){
    let loc = {
        x:evt.touches[0].clientX,
        y:evt.touches[0].clientY
    }
    onMouseMove(loc)
}   

function onMouseDown(evt) {
    selected_piece = getPressedPiece(evt);

    if (selected_piece != null) {
        
        const index = pieces.indexOf(selected_piece)
        if(index>-1){
            pieces.splice(index,1);
            //adding to end so that it will be drwn on top
            pieces.push(selected_piece)
        }
        selected_piece.offset = {
            x: evt.x - selected_piece.x,
            y: evt.y - selected_piece.y
        }
    }
}

function onMouseMove(evt) {
    if (selected_piece != null) {
        selected_piece.x = evt.x - selected_piece.offset.x,
            selected_piece.y = evt.y - selected_piece.offset.y
    }
}

function onMouseUp() {
    if(selected_piece != null){
        if (selected_piece.isClose()) {
            selected_piece.snap()
        }
    }
    selected_piece = null
}

function getPressedPiece(evt) {
    //iterating in reverse so that top element get selected not the below
    for (let i = pieces.length-1; i >=0; i--) {
        if (evt.x > pieces[i].x && evt.x < pieces[i].x + pieces[i].width &&
            evt.y > pieces[i].y && evt.y < pieces[i].y + pieces[i].height
        ) {
            return pieces[i]
        }
    }
    return null;
}

//resize happen when tab ratio changes
function handleResize() {
    //so this will also resize not just canvas area when chaniging ratio of tab
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    //to get min ratio screen size and video size
    let resizer = scaler *
        Math.min(
            window.innerWidth / Video.videoWidth,
            window.innerHeight / Video.videoHeight
        );

    size.width = resizer * Video.videoWidth,
        size.height = resizer * Video.videoHeight

    //starting point of video(setting video to he center)
    size.x = window.innerWidth / 2 - size.width / 2
    size.y = window.innerHeight / 2 - size.height / 2

}

//drwa the video upto the canvas
function updateCanvas() {

    ctx.clearRect(0, 0, canvas.width, canvas.height)

    ctx.globalAlpha = 0.5
    ctx.drawImage(Video,
        size.x, size.y,
        size.width, size.height);

    ctx.globalAlpha = 1
    //drwaing pieces(cells)
    for (let i = 0; i < pieces.length; i++) {
        pieces[i].draw(ctx)
    }

    //now to update frame , we will this function recursively
    window.requestAnimationFrame(updateCanvas)
}


function initialisePieces(row, col) {

    rows = row;
    cols = col;
    pieces = []
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            pieces.push(new Piece(i, j))
        }
    }
}

function randomizePieces() {
    for (let i = 0; i < pieces.length; i++) {
        let loc = {
            x: Math.random() * (window.innerWidth - pieces[i].width),
            y: Math.random() * (window.innerHeight - pieces[i].height)
        }
        pieces[i].x = loc.x
        pieces[i].y = loc.y
    }
}
class Piece {
    constructor(rowIndex, colIndex) {
        this.rowIndex = rowIndex
        this.colIndex = colIndex

        //calculating starting point of cell()
        this.x = size.x + size.width * this.colIndex / cols;
        this.y = size.y + size.height * this.rowIndex / rows;

        this.width = size.width / cols;
        this.height = size.height / rows;

        this.xCorrect = this.x
        this.yCorrect = this.y
    }

    draw(ctx) {
        ctx.beginPath();
        ctx.drawImage(Video,
            this.colIndex * Video.videoWidth / cols,
            this.rowIndex * Video.videoHeight / rows,
            Video.videoWidth / cols,
            Video.videoHeight / rows,
            this.x,
            this.y,
            this.width,
            this.height
        )

        ctx.rect(this.x, this.y, this.width, this.height)
        ctx.stroke()
    }

    //check readme for intuition
    isClose() {
        if (distance({ x: this.x, y: this.y },
            { x: this.xCorrect, y: this.yCorrect }) < this.width / 4) {
            return true;
        }

        return false;
    }

    snap() {
        this.x = this.xCorrect

        this.y = this.yCorrect
        if(checkComplete()){
            beat.play()
            return
        }
        sound.play()
    }
}

function checkComplete(){
    for(let i=0; i<pieces.length;i++){
        let cell = pieces[i]
        if(cell.x != cell.xCorrect || cell.y != cell.yCorrect){
            return false
        }
    }
    return true
}

function distance(p1, p2) {
    return Math.sqrt(
        (p1.x - p2.x) * (p1.x - p2.x) +
        (p1.y - p2.y) * (p1.y - p2.y)
    )
}



let diff =  document.getElementById("difficulty")
diff.addEventListener("change",() => {
    let difficulty = diff.value
    switch(difficulty) {
        case 'Easy' :
            rows = 3;
            cols = 3;

            break
        case 'Medium' :
            rows = 6;
            cols = 6;
            break;
        case 'Hard' :
            rows = 9;
            cols = 9;
            break;
        case 'Legend' :
            rows = 12;
            cols = 12;
            break

        default:
            console.log(difficulty)
    }
    initialisePieces(rows, cols)
    console.log(difficulty)
})

function reset(){
    randomizePieces()
}