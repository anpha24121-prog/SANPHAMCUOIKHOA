/* =====================================================
   MUSIC PLAYER APP
===================================================== */

let songs = [];
let currentIndex = 0;


/* =====================================================
   DOM ELEMENTS
===================================================== */

const songList =
    document.getElementById("songList");

const cover =
    document.getElementById("cover");

const title =
    document.getElementById("title");

const artist =
    document.getElementById("artist");

const audio =
    document.getElementById("audio");

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

const searchInput =
    document.getElementById("searchInput");

const searchBtn =
    document.getElementById("searchBtn");

const favoriteBtn =
    document.getElementById("favoriteBtn");



/* =====================================================
   LOAD INITIAL SONGS
===================================================== */

document.addEventListener(
    "DOMContentLoaded",
    async () => {

        await loadSongs();

    }
);


/* =====================================================
   LOAD SONGS
===================================================== */

async function loadSongs() {

    songList.innerHTML = `
        <div class="loading">
            <i class="fa-solid fa-spinner fa-spin"></i>
            Loading songs...
        </div>
    `;


    const result =
        await getTopSongs();


    songs = result || [];


    if (songs.length === 0) {

        songList.innerHTML = `
            <p>
                No songs found.
            </p>
        `;

        return;

    }


    renderSongs();

}


/* =====================================================
   RENDER SONG LIST
===================================================== */

function renderSongs() {

    songList.innerHTML = "";


    songs.forEach(
        (song, index) => {

            if (!song.previewUrl) {
                return;
            }


            const item =
                document.createElement("div");


            item.className =
                "song-item";


            const isLiked =
                typeof getFavorites === "function"
                    ? getFavorites().some(
                        favorite =>
                            favorite.trackId ===
                            song.trackId
                    )
                    : false;


            item.innerHTML = `

                <img
                    src="${song.artworkUrl100}"
                    alt="cover"
                >

                <div class="song-text">

                    <h4>
                        ${escapeHTML(
                            song.trackName
                        )}
                    </h4>

                    <p>
                        ${escapeHTML(
                            song.artistName
                        )}
                    </p>

                </div>


                <button
                    type="button"
                    class="song-heart"
                    title="Favorite"
                >

                    <i class="${
                        isLiked
                            ? "fa-solid"
                            : "fa-regular"
                    } fa-heart"></i>

                </button>

            `;


            /* -----------------------------------------
               CLICK SONG
            ----------------------------------------- */

            item.addEventListener(
                "click",
                event => {

                    if (
                        event.target.closest(
                            ".song-heart"
                        )
                    ) {

                        return;

                    }


                    playSong(index);

                }
            );


            /* -----------------------------------------
               FAVORITE BUTTON
            ----------------------------------------- */

            const heartButton =
                item.querySelector(
                    ".song-heart"
                );


            heartButton.addEventListener(
                "click",
                event => {

                    event.stopPropagation();

                    toggleFavorite(
                        song
                    );

                }
            );


            songList.appendChild(
                item
            );

        }
    );

}


/* =====================================================
   PLAY SONG
===================================================== */

function playSong(index) {

    if (!songs[index]) {
        return;
    }


    currentIndex =
        index;


    const song =
        songs[index];


    title.textContent =
        song.trackName ||
        "Unknown Song";


    artist.textContent =
        song.artistName ||
        "Unknown Artist";


    cover.src =
        song.artworkUrl100
            ? song.artworkUrl100.replace(
                "100x100",
                "500x500"
            )
            : "https://placehold.co/500x500";


    if (!song.previewUrl) {

        alert(
            "This song does not have a preview."
        );

        return;

    }


    audio.src =
        song.previewUrl;


    audio.load();


    updateFavoriteButton();


    audio.play()
        .then(
            () => {

                updatePlayButton(
                    true
                );

            }
        )
        .catch(
            error => {

                console.error(
                    "Audio error:",
                    error
                );

            }
        );

}


/* =====================================================
   PLAY / PAUSE
===================================================== */

playBtn.addEventListener(
    "click",
    () => {

        if (!audio.src) {

            if (songs.length > 0) {

                playSong(0);

            }

            return;

        }


        if (audio.paused) {

            audio.play();

        }
        else {

            audio.pause();

        }

    }
);


/* =====================================================
   PLAY EVENT
===================================================== */

audio.addEventListener(
    "play",
    () => {

        updatePlayButton(true);

    }
);


/* =====================================================
   PAUSE EVENT
===================================================== */

audio.addEventListener(
    "pause",
    () => {

        updatePlayButton(false);

    }
);


/* =====================================================
   PLAY BUTTON ICON
===================================================== */

function updatePlayButton(
    playing
) {

    if (playing) {

        playBtn.innerHTML =
            `<i class="fa-solid fa-pause"></i>`;

    }
    else {

        playBtn.innerHTML =
            `<i class="fa-solid fa-play"></i>`;

    }

}


/* =====================================================
   NEXT
===================================================== */

nextBtn.addEventListener(
    "click",
    () => {

        if (songs.length === 0) {
            return;
        }


        currentIndex++;


        if (
            currentIndex >=
            songs.length
        ) {

            currentIndex = 0;

        }


        playSong(
            currentIndex
        );

    }
);


/* =====================================================
   PREVIOUS
===================================================== */

prevBtn.addEventListener(
    "click",
    () => {

        if (songs.length === 0) {
            return;
        }


        currentIndex--;


        if (currentIndex < 0) {

            currentIndex =
                songs.length - 1;

        }


        playSong(
            currentIndex
        );

    }
);


/* =====================================================
   BACK 10 SECONDS
===================================================== */

back10Btn.addEventListener(
    "click",
    () => {

        if (!audio.src) {
            return;
        }


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

        if (!audio.src) {
            return;
        }


        audio.currentTime =
            Math.min(
                audio.duration,
                audio.currentTime + 10
            );

    }
);


/* =====================================================
   TIME UPDATE
===================================================== */

audio.addEventListener(
    "timeupdate",
    () => {

        if (!audio.duration) {
            return;
        }


        progress.value =
            (
                audio.currentTime /
                audio.duration
            ) * 100;


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

        if (!audio.duration) {
            return;
        }


        audio.currentTime =
            (
                progress.value / 100
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
            Number(volume.value);

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


/* =====================================================
   SEARCH
===================================================== */

searchBtn.addEventListener(
    "click",
    searchMusic
);


searchInput.addEventListener(
    "keydown",
    event => {

        if (event.key === "Enter") {

            searchMusic();

        }

    }
);


async function searchMusic() {

    const keyword =
        searchInput.value.trim();


    if (!keyword) {

        await loadSongs();

        return;

    }


    songList.innerHTML = `
        <div class="loading">
            Searching...
        </div>
    `;


    const result =
        await searchSongs(
            keyword
        );


    songs =
        result || [];


    currentIndex = 0;


    renderSongs();

}


/* =====================================================
   FAVORITE TOGGLE
===================================================== */

function toggleFavorite(song) {

    /* -----------------------------------------
       CHECK LOGIN
    ----------------------------------------- */

    if (
        typeof getCurrentUser !==
        "function"
    ) {

        console.error(
            "auth.js has not loaded."
        );

        return;

    }


    const user =
        getCurrentUser();


    if (!user) {

        alert(
            "Please login to add favorite songs."
        );


        window.location.href =
            "login.html";


        return;

    }


    /* -----------------------------------------
       CHECK EXISTING FAVORITE
    ----------------------------------------- */

    const favorites =
        getFavorites();


    const exists =
        favorites.some(
            favorite =>
                favorite.trackId ===
                song.trackId
        );


    if (exists) {

        removeFavorite(
            song.trackId
        );

    }
    else {

        addFavorite(
            song
        );

    }


    /* -----------------------------------------
       UPDATE UI
    ----------------------------------------- */

    renderSongs();


    updateFavoriteButton();


    if (
        typeof loadFavoriteSongs ===
        "function"
    ) {

        loadFavoriteSongs();

    }

}


/* =====================================================
   PLAYER FAVORITE BUTTON
===================================================== */

favoriteBtn.addEventListener(
    "click",
    () => {

        if (!songs[currentIndex]) {

            alert(
                "Please select a song first."
            );

            return;

        }


        toggleFavorite(
            songs[currentIndex]
        );

    }
);


/* =====================================================
   UPDATE PLAYER FAVORITE BUTTON
===================================================== */

function updateFavoriteButton() {

    const song =
        songs[currentIndex];


    if (!song) {

        favoriteBtn.innerHTML = `
            <i class="fa-regular fa-heart"></i>
            Add to Favorites
        `;

        return;

    }


    const user =
        typeof getCurrentUser ===
        "function"
            ? getCurrentUser()
            : null;


    if (!user) {

        favoriteBtn.innerHTML = `
            <i class="fa-regular fa-heart"></i>
            Login to Save
        `;

        return;

    }


    const favorites =
        getFavorites();


    const exists =
        favorites.some(
            favorite =>
                favorite.trackId ===
                song.trackId
        );


    if (exists) {

        favoriteBtn.innerHTML = `
            <i class="fa-solid fa-heart"></i>
            Remove from Favorites
        `;

    }
    else {

        favoriteBtn.innerHTML = `
            <i class="fa-regular fa-heart"></i>
            Add to Favorites
        `;

    }

}


/* =====================================================
   FORMAT TIME
===================================================== */

function formatTime(
    seconds
) {

    if (
        !seconds ||
        isNaN(seconds)
    ) {

        return "0:00";

    }


    const minutes =
        Math.floor(
            seconds / 60
        );


    const secondsPart =
        Math.floor(
            seconds % 60
        );


    return (
        `${minutes}:` +
        `${secondsPart
            .toString()
            .padStart(2, "0")}`
    );

}


/* =====================================================
   ESCAPE HTML
===================================================== */

function escapeHTML(
    text
) {

    return String(text)
        .replace(
            /&/g,
            "&amp;"
        )
        .replace(
            /</g,
            "&lt;"
        )
        .replace(
            />/g,
            "&gt;"
        )
        .replace(
            /"/g,
            "&quot;"
        )
        .replace(
            /'/g,
            "&#039;"
        );

}