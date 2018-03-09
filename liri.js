require("dotenv").config();
var fs = require("fs");
var keys = require("./keys.js");
var request = require("request");
var Twitter = require('twitter');
var Spotify = require('node-spotify-api');
var spotify = new Spotify(keys.spotify);
var client = new Twitter(keys.twitter);
var command = process.argv[2];
var input = process.argv.slice(3, process.argv.length).join(" ");
function getMyTweets() {
    var params = { screen_name: 'JTCLoneAccount' };
    client.get("statuses/user_timeline", params, function (error, tweets, response) {
        if (error) {
            throw error;
        }
        var output = "";
        if (tweets.length > 20) {
            for (i = 0; i < 20; i++) {
                output += "\nTimestamp:" + tweets[i].created_at + "\nTweetText:" + tweets[i].text;
            }
        }
        else {
            for (i = 0; i < tweets.length; i++) {
                output += "\nTimestamp:" + tweets[i].created_at + "\nTweetText:" + tweets[i].text;
            }
        }
        logInfo("spotify-this-song", null, output);
        console.log(output);
    });
}
function getSpotifyInfo(songName) {
    var dataString = "";
    if (songName) {
        spotify.search({ type: "track", query: songName, limit: "3" })
            .then(function (response) {
                var dataString = "";
                var respData = response.tracks.items[0];
                dataString = "\nArtists: " + respData.artists[0].name + "\nSong Name: " + respData.name + "\nSpotify Preview Link:" + respData.preview_url + "\nAlbum: " + respData.album.name;
                console.log(dataString);
                logInfo("spotify-this-song", songName, dataString);
            })
            .catch(function (err) {
                console.log(err);
            });
    }
    else {
        spotify.search({ type: "track", query: "The Sign by Ace of Base", limit: "3" })
            .then(function (response) {
                var respData = response.tracks.items[0];
                dataString = "\nArtists: " + respData.artists[0].name + "\nSong Name: " + respData.name + "\nSpotify Preview Link:" + respData.preview_url + "\nAlbum: " + respData.album.name;
                console.log(dataString);
                logInfo("spotify-this-song", songName, dataString);
            })
            .catch(function (err) {
                console.log(err);
            });
    }
}
function getIMDBInfo(movieName) {
    var dataString = "";
    if (movieName) {
        var movieInput = movieName.replace(/ /g, "+");
        request("http://www.omdbapi.com/?t=" + movieInput + "&y=&plot=short&apikey=trilogy", function (error, response, body) {
            if (!error && response.statusCode === 200) {
                var feedback = JSON.parse(body);
                dataString = "\nTitle: " + feedback.Title + "\nYear: " + feedback.Year + "\nIMDB Rating:" + feedback.Ratings[0] + "\nRotten Tomatoes Rating:" + feedback.Ratings[1].Value + "\nCountry: " + feedback.Country + "\nLanguage: " + feedback.Language + "\nPlot: " + feedback.Plot + "\nActors: " + feedback.Actors;
                console.log(dataString);
                logInfo("movie-this", movieName, dataString);
            }
        });
    }
    else {
        request("http://www.omdbapi.com/?t=" + "Mr.+Nobody" + "&y=&plot=short&apikey=trilogy", function (error, response, body) {
            if (!error && response.statusCode === 200) {
                var feedback = JSON.parse(body);
                dataString = "\nTitle: " + feedback.Title + "\nYear: " + feedback.Year + "\nIMDB Rating:" + feedback.Ratings[0] + "\nRotten Tomatoes Rating:" + feedback.Ratings[1].Value + "\nCountry: " + feedback.Country + "\nLanguage: " + feedback.Language + "\nPlot: " + feedback.Plot + "\nActors: " + feedback.Actors;
                console.log(dataString);
                logInfo("movie-this", movieName, dataString);
            }
        });
    }
}
function doTheThing() {
    fs.readFile("random.txt", "utf8", function (err, data) {
        if (err) {
            throw err;
        }
        var randomCommand = data.substring(0, data.indexOf(","));
        var randomInput = data.substring(data.indexOf(",") + 1);
        logInfo("do-what-it-says", null, null);
        if (randomInput.length > 0) {
            input = randomInput;
            run(randomCommand);
        }
        else {
            run(randomCommand);
        }
    })
}
function logInfo(commandName, inputs, data) {
    fs.appendFile("log.txt", "\n" + commandName + " " + input + "\n" + data, "utf8", function (err) {
        if (err) {
            throw err;
        }
        console.log("data stored");
    });
}
function run(inputCommand) {
    switch (inputCommand) {
        case `my-tweets`:
            getMyTweets();
            break;
        case `spotify-this-song`:
            getSpotifyInfo(input);
            break;
        case `movie-this`:
            getIMDBInfo(input);
            break;
        case `do-what-it-says`:
            doTheThing();
            break;
    }
}
run(command);