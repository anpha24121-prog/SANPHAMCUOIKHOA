/* =====================================================
   MUSIC PLAYER
===================================================== */


const audio =
    document.getElementById("audio");


const cover =
    document.getElementById("cover");


const title =
    document.getElementById("title");


const artist =
    document.getElementById("artist");


const playBtn =
    document.getElementById("playBtn");


const prevBtn =
    document.getElementById("prevBtn");


const nextBtn =
    document.getElementById("nextBtn");


const back10Btn =
    document.getElementById("back10Btn");


const forward10Btn =
    document.getElementById("forward10Btn");


const progress =
    document.getElementById("progress");


const currentTime =
    document.getElementById("currentTime");


const duration =
    document.getElementById("duration");


const volume =
    document.getElementById("volume");


const volumeIcon =
    document.getElementById("volumeIcon");



/* =====================================================
   PLAYER STATE
===================================================== */

let currentSongIndex = -1;

let currentSongs = [];



/* =====================================================
   FORMAT TIME
===================================================== */

function formatTime(seconds) {

    if (
        !seconds ||
        isNaN(seconds)
    ) {

        return "0:00";

    }


    const minutes =
        Math.floor(seconds / 60);


    const secs =
        Math.floor(seconds % 60);


    return `${minutes}:${secs
        .toString()
        .padStart(2, "0")}`;

}



/* =====================================================
   SET SONG LIST
===================================================== */

function setPlayerSongs(songs) {

    currentSongs =
        songs || [];

}



/* =====================================================
   LOAD SONG
===================================================== */

function loadSong(
    song,
    index = -1
) {

    if (!song) return;


    currentSongIndex =
        index;


    title.textContent =
        song.trackName ||
        "Unknown Song";


    artist.textContent =
        song.artistName ||
        "Unknown Artist";


    /*
       iTunes gives artworkUrl100.

       Replace 100 with 500
       for larger image.
    */

    let artwork =
        song.artworkUrl100 ||
        "https://placehold.co/500x500?text=Music";


    artwork =
        artwork.replace(
            "100x100",
            "500x500"
        );


    cover.src =
        artwork;


    /*
       iTunes preview URL
    */

    if (song.previewUrl) {

        audio.src =
            song.previewUrl;

    } else {

        audio.removeAttribute("src");

    }


    audio.load();


    progress.value = 0;


    currentTime.textContent =
        "0:00";


    duration.textContent =
        "0:00";


    /*
       Load lyrics
    */

    if (
        typeof loadLyrics ===
        "function"
    ) {

        loadLyrics(
            song.artistName,
            song.trackName
        );

    }

}



/* =====================================================
   PLAY SONG
===================================================== */

function playSong(
    song,
    index = -1
) {

    if (!song) return;


    /*
       If this is a new song
    */

    if (
        audio.src !== song.previewUrl &&
        song.previewUrl
    ) {

        loadSong(
            song,
            index
        );

    }


    /*
       If the song wasn't loaded yet
    */

    if (
        !audio.src &&
        song.previewUrl
    ) {

        loadSong(
            song,
            index
        );

    }


    audio.play()
        .then(() => {

            updatePlayButton(true);

        })
        .catch(error => {

            console.error(
                "Playback error:",
                error
            );

        });

}



/* =====================================================
   PLAY / PAUSE
===================================================== */

function togglePlay() {

    if (!audio.src) {

        if (
            currentSongs.length > 0 &&
            currentSongIndex >= 0
        ) {

            playSong(
                currentSongs[currentSongIndex],
                currentSongIndex
            );

        }

        return;

    }


    if (audio.paused) {

        audio.play();

    } else {

        audio.pause();

    }

}



/* =====================================================
   UPDATE PLAY BUTTON
===================================================== */

function updatePlayButton(
    playing
) {

    if (!playBtn) return;


    if (playing) {

        playBtn.innerHTML =
            `<i class="fa-solid fa-pause"></i>`;

    } else {

        playBtn.innerHTML =
            `<i class="fa-solid fa-play"></i>`;

    }

}



/* =====================================================
   PLAY BUTTON
===================================================== */

playBtn.addEventListener(
    "click",
    togglePlay
);



/* =====================================================
   AUDIO EVENTS
===================================================== */

audio.addEventListener(
    "play",
    () => {

        updatePlayButton(true);

    }
);


audio.addEventListener(
    "pause",
    () => {

        updatePlayButton(false);

    }
);



/* =====================================================
   TIME UPDATE
===================================================== */

audio.addEventListener(
    "timeupdate",
    () => {

        if (!audio.duration) return;


        const percentage =
            (
                audio.currentTime /
                audio.duration
            ) * 100;


        progress.value =
            percentage;


        currentTime.textContent =
            formatTime(
                audio.currentTime
            );


        duration.textContent =
            formatTime(
                audio.duration
            );

    }
);



/* =====================================================
   PROGRESS BAR
===================================================== */

progress.addEventListener(
    "input",
    () => {

        if (!audio.duration) return;


        audio.currentTime =
            (
                progress.value /
                100
            ) * audio.duration;

    }
);



/* =====================================================
   VOLUME
===================================================== */

volume.addEventListener(
    "input",
    () => {

        audio.volume =
            volume.value;


        updateVolumeIcon();

    }
);



/* =====================================================
   VOLUME ICON
===================================================== */

function updateVolumeIcon() {

    const value =
        Number(volume.value);


    if (value === 0) {

        volumeIcon.className =
            "fa-solid fa-volume-xmark";

    }

    else if (value < 0.5) {

        volumeIcon.className =
            "fa-solid fa-volume-low";

    }

    else {

        volumeIcon.className =
            "fa-solid fa-volume-high";

    }

}



/* =====================================================
   BACK 10 SECONDS
===================================================== */

back10Btn.addEventListener(
    "click",
    () => {

        if (!audio.src) return;


        audio.currentTime =
            Math.max(
                0,
                audio.currentTime - 10
            );

    }
);



/* =====================================================
   FORWARD 10 SECONDS
===================================================== */

forward10Btn.addEventListener(
    "click",
    () => {

        if (!audio.src) return;


        audio.currentTime =
            Math.min(
                audio.duration || Infinity,
                audio.currentTime + 10
            );

    }
);



/* =====================================================
   PREVIOUS SONG
===================================================== */

prevBtn.addEventListener(
    "click",
    () => {

        if (
            currentSongs.length === 0
        ) return;


        let index =
            currentSongIndex - 1;


        if (index < 0) {

            index =
                currentSongs.length - 1;

        }


        currentSongIndex =
            index;


        loadSong(
            currentSongs[index],
            index
        );


        audio.play();

    }
);



/* =====================================================
   NEXT SONG
===================================================== */

nextBtn.addEventListener(
    "click",
    () => {

        if (
            currentSongs.length === 0
        ) return;


        let index =
            currentSongIndex + 1;


        if (
            index >=
            currentSongs.length
        ) {

            index = 0;

        }


        currentSongIndex =
            index;


        loadSong(
            currentSongs[index],
            index
        );


        audio.play();

    }
);



/* =====================================================
   AUTO NEXT
===================================================== */

audio.addEventListener(
    "ended",
    () => {

        nextBtn.click();

    }
);