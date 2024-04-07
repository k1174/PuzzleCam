let Video = null
let canvas = null
let ctx = null

let scaler = 0.8 //scaler for video
let size = { x: 0, y: 0, width: 0, height: 0 }

function main() {
    canvas = document.getElementById("mycanvas")
    ctx = canvas.getContext("2d")




    // Request access to user's camera
    let promise = navigator.mediaDevices.getUserMedia({ video: true });

    promise.then(function (signal) {
        Video = document.createElement("video")
        Video.srcObject = signal;
        Video.play();
        Video.onloadeddata = function () {

            handleResize();
            //enable below for responsive
            // window.addEventListener('resize', handleResize)
            updateCanvas();
        }
    }).catch(function (err) {
        alert("Camera error : " + err);
    });
    console.log("main")
}

//resize happen when tab ratio changes
function handleResize(){
    //so this will also resize not just camera screen when chaniging ratio of yab
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

    ctx.drawImage(Video,
        size.x, size.y,
        size.width, size.height);

    //now to update frame , we will this function recursively
    window.requestAnimationFrame(updateCanvas)
}