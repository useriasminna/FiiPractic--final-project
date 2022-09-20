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

var movieid = window.location.search.substring(1);

const detailbody = document.getElementById("bodycontent");

const importantdetails = document.createElement("div");
importantdetails.classList.add("card", "detailcard")

var data = " ";
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

const movieTitle = document.createElement("h1");

const movieDescription = document.createElement("p");

const descriptionlabel = document.createElement("h2");

makeAPIRequest(
  "GET",
  "https://api.themoviedb.org/3/movie/" +
    movieid +
    "?api_key=71979c8dbee4788fbc86711e4e9106b4&language=en-US"
)
  .then((response) => {
  })
  .then((response) => {
    movieTitle.setAttribute("class", "detailtitle");
    movieTitle.textContent =
      data.title + " (" + data.release_date.substr(0, 4) + ")";

    const movieCover = document.createElement("img");
    movieCover.setAttribute(
      "src",
      "https://image.tmdb.org/t/p/w500/" + data.poster_path
    );
    movieCover.classList.add("cover", "detailcover");
    importantdetails.appendChild(movieCover);

    const genre = document.createElement("div");
    genre.setAttribute("class", "detailgenre");

    const genrelabel = document.createElement("p");
    genrelabel.textContent = "Genre: ";
    genrelabel.setAttribute("class", "detailslabel");

    const genrevalue = document.createElement("p");

    for (i = 0; i < data.genres.length; i++) {
      genrevalue.textContent += data.genres[i].name;
      if (!(i == data.genres.length - 1)) {
        genrevalue.textContent += ", ";
      }
    }
    genre.appendChild(genrelabel);
    genre.appendChild(genrevalue);
    importantdetails.appendChild(genre);

    const duration = document.createElement("div");
    duration.setAttribute("class", "detailduration");

    const durationlabel = document.createElement("p");
    durationlabel.textContent = "Duration: ";
    durationlabel.setAttribute("class", "detailslabel");

    const durationvalue = document.createElement("p");

    if (data.runtime < 60) {
      durationvalue.textContent = data.runtime + " min";
    } else {
      if (!(data.runtime / 60 == Math.floor(data.runtime / 60))) {
        durationvalue.textContent =
          Math.floor(data.runtime / 60) +
          "h " +
          (data.runtime - Math.floor(data.runtime / 60) * 60) +
          "min";
      } else {
        durationvalue.textContent = Math.floor(data.runtime / 60) + "h ";
      }
    }

    duration.appendChild(durationlabel);
    duration.appendChild(durationvalue);
    importantdetails.appendChild(duration);

    const release = document.createElement("div");
    release.setAttribute("class", "detailrelease");

    const releaselabel = document.createElement("p");
    releaselabel.textContent = "Release date: ";
    releaselabel.setAttribute("class", "detailslabel");
    const releasevalue = document.createElement("p");
    releasevalue.textContent = data.release_date;

    release.appendChild(releaselabel);
    release.appendChild(releasevalue);
    importantdetails.appendChild(release);

    movieDescription.setAttribute("class", "description");
    movieDescription.textContent = data.overview;
    descriptionlabel.textContent = "Synopsis " + data.title;
  })
  .catch((err) => {
    console.error(err);
  });

const castdiv = document.createElement("div");
castdiv.setAttribute("class", "castdiv");

makeAPIRequest(
  "GET",
  "https://api.themoviedb.org/3/movie/" +
    movieid +
    "/credits?api_key=71979c8dbee4788fbc86711e4e9106b4"
)
  .then((response) => {
  })
  .then((response) => {
    const director = document.createElement("div");
    director.setAttribute("class", "detaildirector");

    const dirlabel = document.createElement("p");
    dirlabel.textContent = "Director: ";
    dirlabel.setAttribute("class", "detailslabel");

    const dirvalue = document.createElement("p");
    var str = document.createElement("p");

    let numberOfDirectors = 0;
    for (i = 0; i < data.crew.length - 1; i++) {
      if (data.crew[i].department == "Directing") {
        str.textContent += data.crew[i].name;
        numberOfDirectors++;
        if(numberOfDirectors === 3){
          break;
        }
        if (!(i == data.crew.length - 1)) {
          str.textContent += ", ";
        }
        

      }
      dirvalue.textContent = str.textContent.slice(0, -2);
    }
    director.appendChild(dirlabel);
    director.appendChild(dirvalue);
    importantdetails.appendChild(director);
  })
  .catch((err) => {
    console.error(err);
  });

const trailerContainer = document.createElement("div");
trailerContainer.classList.add('trailer-container')
const trailer = document.createElement("iframe");

const trailerlabel = document.createElement("h2");
trailerlabel.textContent = "Trailer";

makeAPIRequest(
  "GET",
  "https://api.themoviedb.org/3/movie/" +
    movieid +
    "/videos?api_key=71979c8dbee4788fbc86711e4e9106b4&language=en-US"
).then((response) => {
    trailer.setAttribute("class", "movietrailer");
    for (i = 0; i < data.results.length; i++) {
      if (data.results[i].type == "Trailer") {
        trailer.setAttribute(
          "src",
          "https://www.youtube.com/embed/" + data.results[i].key
        );
        break;
      }
    }
  })
  .catch((err) => {
    console.error(err);
  });


const descriptionbreak = document.createElement("hr");
descriptionbreak.setAttribute("class", "break");

const trailerbreak = document.createElement("hr");
trailerbreak.setAttribute("class", "break");

trailerContainer.appendChild(trailer);

detailbody.appendChild(movieTitle);

detailbody.appendChild(importantdetails);
detailbody.appendChild(descriptionlabel);
detailbody.appendChild(movieDescription);
detailbody.appendChild(descriptionbreak);
detailbody.appendChild(trailerlabel);
detailbody.appendChild(trailerContainer);
detailbody.appendChild(trailerbreak);
detailbody.appendChild(castdiv);
