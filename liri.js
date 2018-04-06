require("dotenv").config();

var keys = require("./keys.js");
var Spotify = require('node-spotify-api');
var Twitter = require('twitter');
var request = require('request');
var fs = require('fs');


var spotify = new Spotify(keys.spotify);
var client = new Twitter(keys.twitter);
var userInput1 = process.argv[2];
var userInput2 = process.argv[3];

function processUserInput(){

    switch (userInput1){

        case "my-tweets":
            getTweets();
            break;
        case "spotify-this-song":
            getSongInfo();
            break;
        case "movie-this":
            getMovie();
            break;
        case "do-what-it-says":
            readFile();
            break;
        default:
            console.log(`
    Invalid command
    
    You can type:
    "my-tweets" - displays the last 20 tweets
    "my-tweets include-timestamp" - displays last 20 tweets with created date
    "spotify-this-song <song name here>" - displays info about a song
    "movie-this <movie name here>" - displays movie info
    "do-what-it-says" - runs whatever command is inside random.txt
    `);
            break;
    
    
    }

}




function getTweets(){
    var parameters = {
        count: 20
    };
    client.get('statuses/user_timeline', parameters, function (err, tweetData, response) {

        if (err){
            return console.log(err);
        }


        console.log("\n");

       for(var i = 0; i<tweetData.length; i++){

            var tweetDate = tweetData[i].created_at;
            var tweetText = tweetData[i].text;

            if(process.argv[3]==="include-timestamp"){
                console.log(`Tweet text:  ${tweetText}                                  created: ${tweetDate}`);

            }
            else{
                console.log(`${tweetText}`);
            }

       }

       console.log("\n");


    });

}


function getSongInfo(){
    

    if(userInput2){

        spotify.search({ type: 'track', query: userInput2, limit: 1 }, function (err, data) {
            
            if(err){
                return console.log(err);
            }

            if(data.tracks.items.length>0){
                console.log(`
                Name:       ${data.tracks.items[0].name}
                Artist:     ${data.tracks.items[0].artists[0].name}
                Album:      ${data.tracks.items[0].album.name}
                Preview:    ${data.tracks.items[0].preview_url}
                `);
            }
            else{
                console.log(`
                Song Not Found
                `);
            }
   

           
    
        });

    }
    else{
        console.log(`
        No song provided
        `);
    }

    
}

function readFile(){

    fs.readFile('./random.txt', "utf-8", function read(err, data) {
        if (err) {
            throw err;
        }

        var fileArray = data.split(",");

        userInput1 = fileArray[0];
        userInput2 = fileArray[1];
        processUserInput();

    });
}


function getMovie(){

    if(userInput2){

        var omdbQuery = "http://www.omdbapi.com/?t=" + userInput2 + "&y=&plot=short&apikey=trilogy";

            request(omdbQuery, function (err, response, body) {

                

                if(err){
                    return console.log(err);
                }

                var movieData = JSON.parse(body);

                if(movieData.Error){
                    console.log(`
                    ${movieData.Error}
                    `);
                }
                else{
                    console.log(`
                    Title: ${movieData.Title}
                    Year: ${movieData.Year}
                    IMDB Rating: ${movieData.Ratings[0].Value}
                    RT Rating: ${movieData.Ratings[1].Value}
                    Country: ${movieData.Country}
                    Language: ${movieData.Language}
                    Synopsis: ${movieData.Plot}
                    Cast: ${movieData.Actors}
                    `);
                }

           

            });

    }

    
}

processUserInput();