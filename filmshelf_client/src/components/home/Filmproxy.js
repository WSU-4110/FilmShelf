// FilmApiProxy.js
class FilmApiProxy {
    constructor() {
      this.cache = {};  
      this.apiKey = import.meta.env.VITE_TMDB_API;
    }
  
    async fetchData(url) {
      if (this.cache[url]) {
        console.log("Fetching data from cache:", url);
        return this.cache[url];
      } else {
        console.log("Fetching data from API:", url);
        const response = await fetch(url);
        const data = await response.json();
        this.cache[url] = data;  
        return data;
      }
    }
  
    async getPopularFilms() {
      const popularUrl = `https://api.themoviedb.org/3/movie/popular?api_key=${this.apiKey}&language=en-US&region=US&page=1`;
      const data = await this.fetchData(popularUrl);
      return data.results.slice(0, 10);
    }
  
    async getUpcomingFilms() {
      const upcomingUrl = `https://api.themoviedb.org/3/movie/upcoming?api_key=${this.apiKey}&language=en-US&region=US&page=1`;
      const data = await this.fetchData(upcomingUrl);
      return data.results.slice(0, 6);
    }
  }
  
  export default new FilmApiProxy();
  