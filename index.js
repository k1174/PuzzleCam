

const canvas = document.getElementById("mycanvas");
const ctx = canvas.getContext("2d")



console.log("working")

//video
let Video = null
function main() {
    
    let promise = navigator.mediaDevices.getUserMedia({video:true});

    promise.then(function(signal){

    }).catch(function(err){
        alert("Camera error : "+ err);
    });
    console.log("main")
}