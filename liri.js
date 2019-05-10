require("dotenv").config();
//Call node packages
var axios = require("axios");
var keys = require("./keys.js");
var Spotify = require("node-spotify-api");
var spotify = new Spotify(keys.spotify);
var fs = require("fs");
var moment = require("moment");

// store user inputs in variables
var command = process.argv[2];
var input = process.argv.slice(3).join("+");

//build axios urls based on user input
var concertURL =
  "https://rest.bandsintown.com/artists/" +
  input +
  "/events?app_id=codingbootcamp";
var movieURL =
  "http://www.omdbapi.com/?t=" + input + "&y=&plot=short&apikey=trilogy";

  //take the users command and execute the corresponding function
switch (command) {
  case "concert-this": 
    concert();
    break;

  case "spotify-this-song":
    songCall();
    break;

  case "movie-this":
    movieCall();
    break;


  case "do-what-it-says":
    random();
    break;

  default:
    break;
}


// make an API call to bands in town, display the artist, venue and location.
function concert() {
  axios.get(concertURL).then(function(response) {
    var concert = response.data[0];
    var concertArr = [
      "",
      "Artist: " + input.toUpperCase(),
      "Venue: " + concert.venue.name,
      "Location: " +
        concert.venue.city +
        " " +
        concert.venue.region +
        " " +
        concert.venue.country,
      "_".repeat(60)
    ].join("\n\n");
    console.log(concertArr);
    // console.log(concert)
    fs.appendFile("log.txt", concertArr, function(err) {
      if (err) throw err;
    });
  });
}

// spotify call - display the song, artist, album and a preview link. Default to The Sign by Ace of Base if no user entry

function songCall() {
  if (input === "") {
    input = "The Sign Ace of Base";
  }
  spotify
    .search({ type: "track", query: input })
    .then(function(response) {
      var song = response.tracks.items[0];
      var songArr = [
        "",
        "Song: " + response.tracks.items[0].name,
        "Artist: " + song.album.artists[0].name,

        "Album: " + song.album.name,

        "Preview: " + song.preview_url,
        "_".repeat(60)
      ].join("\n\n");
      console.log(songArr);
      fs.appendFile("log.txt", songArr, function(err) {
        if (err) throw err;
      });
    })
    .catch(function(err) {
      console.log(err);
    });
}


// OMdB call. Default to Mr Nobody if no entry from user.

function movieCall() {
  if (input === "") {
    movieURL =
      "http://www.omdbapi.com/?t=mr+nobody&y=&plot=short&apikey=trilogy";
  }
  axios.get(movieURL).then(function(response) {
    var movie = response.data;
    var movieArr = [
      "",
      "Movie: " + movie.Title,
      "Movie Year: " + movie.Year,
      "IMDB Rating: " + movie.Ratings[0].Value,
      "Rotten Tomatoes: " + movie.Ratings[1].Value,
      "Country: " + movie.Country,
      "Language: " + movie.Language,
      "Plot: " + movie.Plot,
      "Actors: " + movie.Actors,
      "_".repeat(60),
      ""
    ].join("\n\n");
    console.log(movieArr);
    fs.appendFile("log.txt", movieArr, function(err) {
      if (err) throw err;
    });
  });
}

// do what it says line - this calls the random.txt file and performs the command on it
function random() {
  fs.readFile("random.txt", "utf8", function(err, data) {
    if (err) throw err;

    var dataArr = data.split(",");
    command = dataArr[0];
    input = dataArr[1];

    switch (command) {
      case "concert-this":
        var concertURL =
          "https://rest.bandsintown.com/artists/" +
          input +
          "/events?app_id=codingbootcamp";
        concert();
        break;

      case "spotify-this-song":
        songCall();
        break;
      case "movie-this":
        movieURL =
          "http://www.omdbapi.com/?t=" +
          input +
          "&y=&plot=short&apikey=trilogy";
        console.log(command, input);
        movieCall();
        break;
    }
  });
}


/* perform the following:

node liri concert-this Garth Brooks
node liri spotify-this-song all the small things
node liri spotify-this-song // returns I Saw the Sign by Ace of Bass
node liri movie-this blade runner
node liri movie-this //returns to mr nobody
node liri do-what-it-says //runs the command in random.txt(currently movie-this shrek)

*/