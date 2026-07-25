function renderPlaylist(list){

    const container = document.getElementById("playlist");

    container.innerHTML = "";

    list.forEach(song=>{

        container.innerHTML += `
        <div class="song">
            <img src="${song.album.cover_medium}">
            <div>
                <h3>${song.title}</h3>
                <p>${song.artist.name}</p>
            </div>
        </div>
        `;

    });

}