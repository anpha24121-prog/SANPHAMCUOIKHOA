const audio = new Audio();

function playSong(url){
    audio.src = url;
    audio.play();
}

function pauseSong(){
    audio.pause();
}