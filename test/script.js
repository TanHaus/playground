let url = 'https://api.spotify.com/v1/playlists/0Ljbc9dC7tniWI6nWLSYvm';
let playlist = fetch(url, {
    method: "GET",
    headers: {
        "Accept": "application/json",
        "Content-Type": "application/json"
    },
}).then(response => response.json());

console.log(playlist);