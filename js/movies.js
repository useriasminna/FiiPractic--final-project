const body_container = document.getElementById("bodycontent");

window.onscroll = function () {
  scrollFunction();
};

function scrollFunction() {
  if (window.innerWidth > 780) {
    if (
      document.body.scrollTop > 50 ||
      document.documentElement.scrollTop > 50
    ) {
      document.getElementById("headerid").className = "headerOnScroll";
      document.getElementById("logoid").className = "logoOnScroll";
    } else {
      document.getElementById("headerid").className = "headercontainer";
      document.getElementById("logoid").className = "logo";
    }
  }
}

function search_movie() {
  let input = document.getElementById("searchbar").value;
  input = input.toLowerCase();
  let x = document.getElementsByClassName("card");

  for (i = 0; i < x.length; i++) {
    if (!x[i].innerHTML.toLowerCase().includes(input)) {
      x[i].style.display = "none";
    } else {
      x[i].style.display = "grid";
    }
  }
}

jQuery(document).ready(function () {
  jQuery(".toggle-nav").click(function (e) {
    jQuery(this).toggleClass("active");
    jQuery(".topnav ul").toggleClass("active");
    if (getElementById("#searchbutton").toggleClass("active")) {
      jQuery(this).toggleClass("active");
      jQuery("#searchbar").toggleClass("active");
    }
    e.preventDefault();
  });
});

jQuery(document).ready(function () {
  jQuery("#searchbutton").click(function (e) {
    jQuery(this).toggleClass("active");
    jQuery("#searchbar").toggleClass("active");

    e.preventDefault();
  });
});

if (window.location.pathname.includes('/index.html')) {
  var data = " ";
  const movieList = document.getElementById("movielist");
  function makeAPIRequest(method, url) {
    return new Promise((resolve, reject) => {
      const req = new XMLHttpRequest();
      req.open(method, url);
      req.send();
      req.onload = function () {
        data = JSON.parse(req.responseText);
        if (req.status >= 200 && req.status < 300) {
          resolve(data);
        } else {
          reject(new Error(req.responseText));
        }
      };
    });
  }

  function makeMovieElements(url) {
    makeAPIRequest("GET", url)
      .then((response) => {
      })
      .then((response) =>
        data.results.forEach((movie) => {
          const listElement = document.createElement("li");
          listElement.setAttribute("class", "movieelement");

          const card = document.createElement("div");
          card.setAttribute("class", "card");
          card.setAttribute("id", "cardid");

          const movieCover = document.createElement("img");
          movieCover.setAttribute(
            "src",
            "https://image.tmdb.org/t/p/w500/" + movie.poster_path
          );
          movieCover.setAttribute("class", "cover");
          movieCover.setAttribute("alt", "Movie Poster");

          const wrapTitle = document.createElement("div");
          wrapTitle.setAttribute("class", "wraptitle");

          const h2 = document.createElement("a");
          h2.setAttribute("class", "movietitle");
          h2.setAttribute("href", "movie_details.html?" + movie.id);
          h2.textContent = movie.title;

          const yearOfRelease = document.createElement("p");
          yearOfRelease.setAttribute("class", "yearofrelease");
          yearOfRelease.textContent =
            " (" + movie.release_date.substr(0, 4) + ")";

          const movieDescription = document.createElement("p");
          movieDescription.setAttribute("class", "moviedescription");
          movieDescription.textContent = `${movie.overview.substr(0, 350)}...`;

          const vote = document.createElement("div");
          vote.setAttribute("class", "movievote");

          const voteAverage = document.createElement("p");
          voteAverage.setAttribute("class", "votaverage");
          voteAverage.textContent = movie.vote_average;

          const voteStar = document.createElement("icon");
          voteStar.setAttribute("class", "sourceText fa fa-fw fa-star");
          voteStar.setAttribute("id", "votestar");

          card.appendChild(vote);
          card.appendChild(movieCover);
          card.appendChild(wrapTitle);
          card.appendChild(movieDescription);
          listElement.appendChild(card);
          movieList.appendChild(listElement);
          wrapTitle.appendChild(h2);
          wrapTitle.appendChild(yearOfRelease);
          vote.appendChild(voteStar);
          vote.appendChild(voteAverage);

          const credits = document.createElement("div");
          credits.setAttribute("class", "moviecredits");

          makeAPIRequest(
            "GET",
            "https://api.themoviedb.org/3/movie/" +
              movie.id +
              "/credits?api_key=71979c8dbee4788fbc86711e4e9106b4"
          ).then((response) => {
              const director = document.createElement("p");
              director.setAttribute("class", "moviedirector");
              director.textContent = "Director: ";

              for (i = 0; i < data.crew.length - 1; i++) {
                if (data.crew[i].department == "Directing") {
                  director.textContent += data.crew[i].name;
                  break;
                }
              }
              credits.appendChild(director);

              const cast = document.createElement("p");
              cast.setAttribute("class", "moviecast");
              cast.textContent = "Cast: ";

              for (i = 0; i < 4; i++) {
                if(data.cast[i])
                  cast.textContent += data.cast[i].name;
                if (!(i == 3)) {
                  cast.textContent += ", ";
                }
              }
              credits.appendChild(cast);
            })
            .catch((err) => {
              console.error(err);
            });

          makeAPIRequest(
            "GET",
            "https://api.themoviedb.org/3/movie/" +
              movie.id +
              "?api_key=71979c8dbee4788fbc86711e4e9106b4&language=en-US"
          )  .then((response) => {
              const durationGenreDiv = document.createElement("div");
              durationGenreDiv.setAttribute("class", "durationgenrediv");

              const duration = document.createElement("p");
              duration.setAttribute("class", "movieduration");
              duration.textContent = "Duration: " + data.runtime + " min  |  ";
              durationGenreDiv.appendChild(duration);
              const genre = document.createElement("p");
              genre.setAttribute("class", "moviegenre");
              genre.textContent = "Genre: ";

              for (i = 0; i < data.genres.length; i++) {
                genre.textContent += data.genres[i].name;
                if (!(i == data.genres.length - 1)) {
                  genre.textContent += ", ";
                }
                durationGenreDiv.appendChild(genre);
                if (i == 3) {
                  break;
                }
              }

              card.appendChild(durationGenreDiv);

              const movieProduction = document.createElement("p");
              movieProduction.setAttribute("class", "movieproduction");

              movieProduction.textContent = "Production company: ";

              for (i = 0; i < data.production_companies.length; i++) {
                movieProduction.textContent += data.production_companies[i].name;
                if (!(i == data.production_companies.length - 1)) {
                  movieProduction.textContent += ", ";
                }
                credits.appendChild(movieProduction);
                if (i == 2) {
                  break;
                }
              }

              card.appendChild(credits);

              makeAPIRequest(
                "GET",
                " https://imdb-api.com/en/API/Ratings/k_zo09nCxZ/" + data.imdb_id
              )
                .then((response) => {
                })
                .then((response) => {
                  const imdbscore = document.createElement("a");
                  if (data.imDb) {
                    imdbscore.textContent = "IMDB: " + data.imDb;
                    imdbscore.setAttribute("class", "imdbscore");
                    imdbscore.setAttribute(
                      "href",
                      "https://www.imdb.com/title/" + data.imDbId
                    );
                  } else {
                    imdbscore.textContent = "N/A";
                    imdbscore.setAttribute("class", "imdbNA");
                  }
                  card.appendChild(imdbscore);
                })
                .catch((err) => {
                  console.error(err);
                });
            })
            .catch((err) => {
              console.error(err);
            });
        })
      )
      .catch((err) => {
        console.error(err);
      });
  }

  for(i=0; i<=5; i++){
      makeMovieElements(
          "https://api.themoviedb.org/3/movie/top_rated?api_key=71979c8dbee4788fbc86711e4e9106b4&language=en-US&page=" + i);
  }

}

