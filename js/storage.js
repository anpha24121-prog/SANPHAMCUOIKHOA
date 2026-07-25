function saveFavorite(song){

    localStorage.setItem(
        "favorite",
        JSON.stringify(song)
    );

}

function getFavorite(){

    return JSON.parse(
        localStorage.getItem("favorite")
    );

}