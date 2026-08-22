const API_URL =
    "https://itunes.apple.com/search";

async function searchSongs(keyword) {

    try {

        const url =
            `${API_URL}?term=${encodeURIComponent(keyword)}` +
            `&media=music` +
            `&entity=song` +
            `&limit=30`;

        const response =
            await fetch(url);

        if (!response.ok) {
            throw new Error("API request failed");
        }

        const data =
            await response.json();

        return data.results || [];

    } catch (error) {

        console.error("API error:", error);

        return [];
    }
}


async function getTopSongs() {

    return await searchSongs("pop music");

}