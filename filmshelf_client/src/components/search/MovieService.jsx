class MovieService {
  constructor(apiKey) {
    this.apiKey = apiKey;
    this.observers = [];
  }

  subscribe(callback) {
    this.observers.push(callback);
  }

  notify(data) {
    this.observers.forEach((callback) => callback(data));
  }

  getMovies(selectedPage) {
    fetch(
      `https://api.themoviedb.org/3/movie/popular?api_key=${this.apiKey}&language=en-US&page=${selectedPage}`
    )
      .then((res) => res.json())
      .then((json) => {
        const filteredMovies = json.results.filter((movie) => !movie.adult);
        this.notify({ type: "movies", data: filteredMovies });
      })
      .catch((error) => console.error("Error fetching movies:", error));
  }

  getGenres() {
    fetch(
      `https://api.themoviedb.org/3/genre/movie/list?api_key=${this.apiKey}&language=en-US`
    )
      .then((res) => res.json())
      .then((json) => {
        this.notify({ type: "genres", data: json.genres });
      })
      .catch((error) => console.error("Error fetching genres:", error));
  }
}

export default MovieService;
