/* ===========================================
   ITUNES API
=========================================== */

const API = {

    BASE_URL: "https://itunes.apple.com",

    SEARCH: "/search"

};

/* ===========================================
   SEARCH SONG
=========================================== */

async function searchSongs(keyword) {

    try {

        const url =
            `${API.BASE_URL}${API.SEARCH}?term=${encodeURIComponent(keyword)}&entity=song&limit=30`;

        const response = await fetch(url);

        if (!response.ok) {
            throw new Error("Cannot fetch songs.");
        }

        const data = await response.json();

        return data.results;

    } catch (error) {

        console.error(error);

        return [];

    }

}

/* ===========================================
   DEFAULT SONGS
=========================================== */

async function getTopSongs() {

    return await searchSongs("Top Hits");

}