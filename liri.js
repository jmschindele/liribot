require("dotenv").config();

// TODO Grab the axios package...
// @link https://www.npmjs.com/package/axios

var axios = require("axios");
var inquirer = require("inquirer");
var keys = require("./keys.js");
var Spotify = require("node-spotify-api");
var spotify = new Spotify(keys.spotify);
var fs = require("fs");
// var moment = require("moment.js");

var command = process.argv[2];
var input = process.argv.slice(3).join("+");



var concertURL =
  "https://rest.bandsintown.com/artists/" +
  input +
  "/events?app_id=codingbootcamp";

var movieURL =
  "http://www.omdbapi.com/?t=" + input + "&y=&plot=short&apikey=trilogy";

switch (command) {
  case "concert-this":
    axios.get(concertURL).then(function(response) {
      console.log(response.data[0].venue.name +
      
        response.data[0].venue.city +
          ", " +
          response.data[0].venue.region +
          " " +
          response.data[0].venue.country
      );
    });
    break;
  case "spotify-this-song":
    if (input === "") {
      input = "The Sign Ace of Base";
    }
    spotify
      .search({ type: "track", query: input })
      .then(function(response) {
        console.log(response.tracks.items[0]);
        console.log(response.tracks.items[0].album.name);
        console.log(response.tracks.items[0].album.artists[0].name);
        console.log(response.tracks.items[0].available_markets[0].disc_number);

      })
      .catch(function(err) {
        console.log(err);
      });

    break;
  case "movie-this":
    if (input === "") {
      movieURL =
        "http://www.omdbapi.com/?t=mr+nobody&y=&plot=short&apikey=trilogy";
    }
    axios.get(movieURL).then(function(response) {
      console.log(
        "\r",
        response.data.Title,
        "\n\r",
        response.data.Year,
        "\n\r",
        "IMDB Rating: ",
        response.data.Ratings[0].Value,
        "\n\r Rotten Tomatoes: ",
        response.data.Ratings[1].Value,
        "\n\r Country: ",
        response.data.Country,
        "\n\r Language: ",
        response.data.Language,
        "\n\r Plot: ",
        response.data.Plot,
        "\n\r Actors: ",
        response.data.Actors
      );
    });
    break;
  case "do-what-it-says":
    console.log("switch 4");
    break;

  default:
    break;
}


