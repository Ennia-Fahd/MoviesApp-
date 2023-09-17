const API_TOKEN = "dab5fef1e24a709c35b617f4cb1039cd"
export function getFilmsFromApiWithSearchedText (text, page) {
  let url = "";
    if(text.trim() === ""){
      url = 'https://api.themoviedb.org/3/discover/movie?api_key=' + API_TOKEN + '&language=fr&query=&page=1&append_to_response=videos';
    }
    else {
      url = 'https://api.themoviedb.org/3/search/movie?api_key=' + API_TOKEN + '&language=fr&query=' + text + '&page=' + page + '&append_to_response=videos'
    }
    return fetch(url)
      .then((response) => response.json())
      .catch((error) => console.error(error))

  }
  // API/TMDBApi.js

export function getImageFromApi (name) {
    return 'https://image.tmdb.org/t/p/w300' + name
  }
  