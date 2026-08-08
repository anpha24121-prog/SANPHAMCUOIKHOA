/* =====================================================
   APP
===================================================== */


/* =====================================================
   DOM
===================================================== */

const songList =
    document.getElementById("songList");


const relatedSongs =
    document.getElementById("relatedSongs");


const searchInput =
    document.getElementById("searchInput");


const searchBtn =
    document.getElementById("searchBtn");


const listTitle =
    document.getElementById("listTitle");


const lyrics =
    document.getElementById("lyrics");



/* =====================================================
   APP STATE
===================================================== */

let songs = [];



/* =====================================================
   START APP
===================================================== */

window.addEventListener(
    "DOMContentLoaded",
    async () => {

        await loadTopSongs();

    }
);



/* =====================================================
   LOAD TOP / INITIAL SONGS
===================================================== */

async function loadTopSongs() {

    showLoading(
        songList
    );


    const results =
        await getTopSongs();


    songs =
        results;


    if (
        songs.length === 0
    ) {

        songList.innerHTML = `
            <p class="error-message">
                Could not load songs.
            </p>
        `;

        return;

    }


    listTitle.textContent =
        "Top Songs";


    setPlayerSongs(
        songs
    );


    renderSongs(
        songs
    );

}



/* =====================================================
   SEARCH
===================================================== */

async function performSearch() {

    const keyword =
        searchInput.value.trim();


    if (!keyword) {

        await loadTopSongs();

        return;

    }


    showLoading(
        songList
    );


    const results =
        await searchSongs(
            keyword
        );


    songs =
        results;


    if (
        songs.length === 0
    ) {

        songList.innerHTML = `
            <p class="error-message">
                No songs found for
                "${keyword}".
            </p>
        `;

        return;

    }


    listTitle.textContent =
        `Search: ${keyword}`;


    setPlayerSongs(
        songs
    );


    renderSongs(
        songs
    );

}



/* =====================================================
   SEARCH BUTTON
===================================================== */

searchBtn.addEventListener(
    "click",
    performSearch
);



/* =====================================================
   SEARCH ENTER
===================================================== */

searchInput.addEventListener(
    "keydown",
    event => {

        if (
            event.key === "Enter"
        ) {

            performSearch();

        }

    }
);



/* =====================================================
   RENDER SONGS
===================================================== */

function renderSongs(
    songArray
) {

    songList.innerHTML = "";


    songArray.forEach(
        (song, index) => {

            const item =
                document.createElement(
                    "div"
                );


            item.className =
                "song-item";


            let artwork =
                song.artworkUrl100 ||
                "https://placehold.co/100x100?text=Music";


            artwork =
                artwork.replace(
                    "100x100",
                    "200x200"
                );


            item.innerHTML = `

                <img
                    src="${artwork}"
                    alt="${escapeHTML(
                        song.trackName
                    )}"
                >

                <div class="song-text">

                    <h4>
                        ${escapeHTML(
                            song.trackName ||
                            "Unknown Song"
                        )}
                    </h4>

                    <p>
                        ${escapeHTML(
                            song.artistName ||
                            "Unknown Artist"
                        )}
                    </p>

                </div>

            `;


            /*
               Click song
            */

            item.addEventListener(
                "click",
                async () => {

                    currentSongIndex =
                        index;


                    setPlayerSongs(
                        songArray
                    );


                    loadSong(
                        song,
                        index
                    );


                    audio.play();


                    /*
                       Get related songs
                    */

                    await loadRelatedSongs(
                        song.artistId,
                        song.artistName
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
   RELATED SONGS
===================================================== */

async function loadRelatedSongs(
    artistId,
    artistName
) {

    if (!artistId) {

        relatedSongs.innerHTML = `
            <p>
                Artist information unavailable.
            </p>
        `;

        return;

    }


    relatedSongs.innerHTML = `
        <p>
            Loading more songs from
            ${escapeHTML(
                artistName
            )}...
        </p>
    `;


    const results =
        await getArtistSongs(
            artistId
        );


    /*
       Don't show the currently selected
       song as the only result.
    */

    const filtered =
        results.filter(
            song =>
                song.previewUrl
        );


    if (
        filtered.length === 0
    ) {

        relatedSongs.innerHTML = `
            <p>
                No related songs found.
            </p>
        `;

        return;

    }


    renderRelatedSongs(
        filtered,
        artistName
    );

}



/* =====================================================
   RENDER RELATED SONGS
===================================================== */

function renderRelatedSongs(
    songArray,
    artistName
) {

    relatedSongs.innerHTML = "";


    songArray.forEach(
        song => {

            const item =
                document.createElement(
                    "div"
                );


            item.className =
                "related-song";


            let artwork =
                song.artworkUrl100 ||
                "https://placehold.co/80x80?text=Music";


            artwork =
                artwork.replace(
                    "100x100",
                    "200x200"
                );


            item.innerHTML = `

                <img
                    src="${artwork}"
                    alt="${escapeHTML(
                        song.trackName
                    )}"
                >

                <div>

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

                <i class="fa-solid fa-play"></i>

            `;


            item.addEventListener(
                "click",
                () => {

                    /*
                       Add related song to
                       current player list
                    */

                    songs =
                        songArray;


                    setPlayerSongs(
                        songs
                    );


                    const index =
                        songs.indexOf(
                            song
                        );


                    loadSong(
                        song,
                        index
                    );


                    audio.play();

                }
            );


            relatedSongs.appendChild(
                item
            );

        }
    );

}



/* =====================================================
   LYRICS
===================================================== */

async function loadLyrics(
    artistName,
    songTitle
) {

    lyrics.innerHTML = `
        <p class="lyrics-loading">
            Loading lyrics...
        </p>
    `;


    const result =
        await getLyrics(
            artistName,
            songTitle
        );


    lyrics.textContent =
        result;

}



/* =====================================================
   LOADING
===================================================== */

function showLoading(
    element
) {

    element.innerHTML = `

        <div class="loading">

            <i class="fa-solid fa-spinner fa-spin"></i>

            Loading...

        </div>

    `;

}



/* =====================================================
   HTML ESCAPE
===================================================== */

function escapeHTML(
    text
) {

    if (!text) return "";


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