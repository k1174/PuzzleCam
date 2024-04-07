let Video = null
let canvas = null
let ctx = null

function main() {
    canvas = document.getElementById("mycanvas")
    ctx = canvas.getContext("2d")


    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    // Request access to user's camera
    let promise = navigator.mediaDevices.getUserMedia({ video: true });

    promise.then(function (signal) {
        Video = document.createElement("video")
        Video.srcObject = signal;
        Video.play();
        Video.onloadeddata = function () {
            updateCanvas();
        }
    }).catch(function (err) {
        alert("Camera error : " + err);
    });
    console.log("main")
}

//drwa the video upto the canvas
function updateCanvas() {
    ctx.drawImage(Video, 0, 0)

    //now to update frame , we will this function recursively
    window.requestAnimationFrame(updateCanvas)
}