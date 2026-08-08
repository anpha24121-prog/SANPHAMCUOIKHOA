/* =====================================================
   iTunes API
===================================================== */

const API = {

    SEARCH:
        "https://itunes.apple.com/search",

    LOOKUP:
        "https://itunes.apple.com/lookup"

};



/* =====================================================
   SEARCH SONGS
===================================================== */

async function searchSongs(keyword) {

    try {

        const url =
            `${API.SEARCH}?term=${encodeURIComponent(keyword)}` +
            `&media=music` +
            `&entity=song` +
            `&limit=30`;


        const response =
            await fetch(url);


        if (!response.ok) {

            throw new Error(
                "Search request failed"
            );

        }


        const data =
            await response.json();


        return data.results || [];


    } catch (error) {

        console.error(
            "Search error:",
            error
        );

        return [];

    }

}



/* =====================================================
   TOP SONGS
===================================================== */

async function getTopSongs() {

    try {

        /*
           iTunes does not have a simple
           "chart" endpoint like Deezer.

           We use a popular music search
           as the initial list.
        */

        const url =
            `${API.SEARCH}` +
            `?term=music` +
            `&media=music` +
            `&entity=song` +
            `&limit=30`;


        const response =
            await fetch(url);


        if (!response.ok) {

            throw new Error(
                "Could not load songs"
            );

        }


        const data =
            await response.json();


        return data.results || [];


    } catch (error) {

        console.error(
            "Top songs error:",
            error
        );

        return [];

    }

}



/* =====================================================
   SONG DETAIL
===================================================== */

async function getSong(id) {

    try {

        const url =
            `${API.LOOKUP}?id=${id}`;


        const response =
            await fetch(url);


        if (!response.ok) {

            throw new Error(
                "Song lookup failed"
            );

        }


        const data =
            await response.json();


        return data.results || [];


    } catch (error) {

        console.error(
            "Song detail error:",
            error
        );

        return [];

    }

}



/* =====================================================
   SONGS FROM ARTIST
===================================================== */

async function getArtistSongs(artistId) {

    try {

        const url =
            `${API.LOOKUP}` +
            `?id=${artistId}` +
            `&entity=song` +
            `&limit=30`;


        const response =
            await fetch(url);


        if (!response.ok) {

            throw new Error(
                "Artist lookup failed"
            );

        }


        const data =
            await response.json();


        /*
           The first result can be
           artist information.

           We only want tracks.
        */

        return (data.results || [])
            .filter(
                item =>
                    item.wrapperType === "track"
            );


    } catch (error) {

        console.error(
            "Artist songs error:",
            error
        );

        return [];

    }

}



/* =====================================================
   LYRICS
===================================================== */

async function getLyrics(
    artist,
    title
) {

    try {

        const url =
            `https://api.lyrics.ovh/v1/` +
            `${encodeURIComponent(artist)}/` +
            `${encodeURIComponent(title)}`;


        const response =
            await fetch(url);


        if (!response.ok) {

            return "Lyrics not found.";

        }


        const data =
            await response.json();


        return data.lyrics ||
            "Lyrics not found.";


    } catch (error) {

        console.error(
            "Lyrics error:",
            error
        );

        return "Lyrics not found.";

    }

}