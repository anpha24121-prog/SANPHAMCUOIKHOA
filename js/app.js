/* ===========================================
   ELEMENTS
=========================================== */

const songList = document.getElementById("songList");
const cover = document.getElementById("cover");
const title = document.getElementById("title");
const artist = document.getElementById("artist");

const audio = document.getElementById("audio");

const playBtn = document.getElementById("playBtn");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");

const searchBtn = document.getElementById("searchBtn");
const searchInput = document.getElementById("searchInput");

const progress = document.getElementById("progress");
const volume = document.getElementById("volume");

const currentTime = document.getElementById("currentTime");
const duration = document.getElementById("duration");

/* ===========================================
   GLOBAL
=========================================== */

let songs = [];
let currentIndex = 0;
let isPlaying = false;

/* ===========================================
   LOAD WEBSITE
=========================================== */

window.onload = async () => {

    songs = await getTopSongs();

    renderSongs(songs);

    if (songs.length > 0) {

        loadSong(0);

    }

};

/* ===========================================
   RENDER SONGS
=========================================== */

function renderSongs(list) {

    songList.innerHTML = "";

    list.forEach((song, index) => {

        songList.innerHTML += `

        <div class="song-item" data-index="${index}">

            <img src="${song.artworkUrl100}" alt="cover">

            <div class="song-text">

                <h4>${song.trackName}</h4>

                <p>${song.artistName}</p>

            </div>

        </div>

        `;

    });

    document.querySelectorAll(".song-item").forEach(item => {

        item.onclick = () => {

            loadSong(item.dataset.index);

            playSong();

        };

    });

}

/* ===========================================
   LOAD SONG
=========================================== */

function loadSong(index) {

    currentIndex = Number(index);

    const song = songs[currentIndex];

    cover.src = song.artworkUrl100.replace("100x100", "600x600");

    title.textContent = song.trackName;

    artist.textContent = song.artistName;

    audio.src = song.previewUrl;

    document.querySelectorAll(".song-item").forEach(item => {

        item.classList.remove("active");

    });

    document.querySelectorAll(".song-item")[currentIndex]?.classList.add("active");

}

/* ===========================================
   PLAY
=========================================== */

function playSong() {

    audio.play();

    isPlaying = true;

    playBtn.innerHTML = `<i class="fa-solid fa-pause"></i>`;

}

/* ===========================================
   PAUSE
=========================================== */

function pauseSong() {

    audio.pause();

    isPlaying = false;

    playBtn.innerHTML = `<i class="fa-solid fa-play"></i>`;

}

/* ===========================================
   PLAY BUTTON
=========================================== */

playBtn.onclick = () => {

    if (!audio.src) return;

    if (isPlaying) {

        pauseSong();

    } else {

        playSong();

    }

};

/* ===========================================
   NEXT
=========================================== */

nextBtn.onclick = () => {

    currentIndex++;

    if (currentIndex >= songs.length) {

        currentIndex = 0;

    }

    loadSong(currentIndex);

    playSong();

};

/* ===========================================
   PREVIOUS
=========================================== */

prevBtn.onclick = () => {

    currentIndex--;

    if (currentIndex < 0) {

        currentIndex = songs.length - 1;

    }

    loadSong(currentIndex);

    playSong();

};

/* ===========================================
   SEARCH
=========================================== */

searchBtn.onclick = async () => {

    const keyword = searchInput.value.trim();

    if (keyword === "") return;

    songs = await searchSongs(keyword);

    renderSongs(songs);

    if (songs.length > 0) {

        loadSong(0);

    }

};

/* ===========================================
   PROGRESS
=========================================== */

audio.addEventListener("timeupdate", () => {

    if (!audio.duration) return;

    progress.value = (audio.currentTime / audio.duration) * 100;

    currentTime.textContent = formatTime(audio.currentTime);

    duration.textContent = formatTime(audio.duration);

});

/* ===========================================
   SEEK
=========================================== */

progress.oninput = () => {

    if (!audio.duration) return;

    audio.currentTime =

        (progress.value / 100) * audio.duration;

};

/* ===========================================
   VOLUME
=========================================== */

volume.oninput = () => {

    audio.volume = volume.value;

};

/* ===========================================
   AUTO NEXT
=========================================== */

audio.onended = () => {

    nextBtn.click();

};

/* ===========================================
   FORMAT TIME
=========================================== */

function formatTime(time) {

    const minute = Math.floor(time / 60);

    const second = Math.floor(time % 60);

    return `${minute}:${second < 10 ? "0" : ""}${second}`;

}