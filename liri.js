require("dotenv").config();

var fs = require("fs");
var keys = require("./keys.js");
var request = require('request');
var Spotify = require('node-spotify-api');
var spotify = new Spotify(keys.spotify);


var command = process.argv[2];
var parameter = process.argv[3];

// set of commands available
function switchCase() {

  switch (command) {

    case 'spotify-this-song':
        spotifySong(parameter);
        break;

    case 'concert-this':
        bandsInTown(parameter);                   
        break;                          

    case 'movie-this':
        movieInfo(parameter);
        break;

    case 'do-what-it-says':
        getRandom();
        break;

      default:                            
      display("Invalid Instruction");
      break;

  }
};

// search for concerts 
function bandsInTown(parameter){

if (command === 'concert-this')
{
	var movieName="";
	for (var i = 3; i < process.argv.length; i++)
	{
		movieName+=process.argv[i];
	}
	console.log(movieName);
}
else
{
	movieName = parameter;
}

var queryUrl = "https://rest.bandsintown.com/artists/"+movieName+"/events?app_id=codecademy";


request(queryUrl, function(error, response, body) {

  if (!error && response.statusCode === 200) {

    var JS = JSON.parse(body);
    for (i = 0; i < JS.length; i++)
    {
      var timeVar = JS[i].datetime;
        var month = timeVar.substring(5,7);
        var year = timeVar.substring(0,4);
        var day = timeVar.substring(8,10);
        var dateForm = month + "/" + day + "/" + year
  
      display("\n------------------------------------\n");

        
      display("Date: " + dateForm);
      display("Name: " + JS[i].venue.name);
      display("City: " + JS[i].venue.city);
      if (JS[i].venue.region !== "")
      {
        display("Country: " + JS[i].venue.region);
      }
        display("Country: " + JS[i].venue.country);
        display("\n---------------------------------\n");

    }
  }
});
}

//search spotify for songs

function spotifySong(parameter) {

  var searchTrack;
  if (parameter === undefined) {
    searchTrack = "The Sign Ace of Base";
  } else {
    searchTrack = parameter;
  }

  spotify.search({
    type: 'track',
    query: searchTrack
  }, function(error, data) {
    if (error) {
      display('Error occurred: ' + error);
      return;
    } else {
      display("\n-------------------------------------\n");
      display("Artist: " + data.tracks.items[0].artists[0].name);
      display("Song: " + data.tracks.items[0].name);
      display("Preview: " + data.tracks.items[3].preview_url);
      display("Album: " + data.tracks.items[0].album.name);
      display("\n---------------------------------------\n");
      
    }
  });
};

// search for movie information
function movieInfo(parameter) {

  var findMovie;
  if (parameter === undefined) {
    findMovie = "Mr. Nobody";
  } else {
    findMovie = parameter;
  };

  var queryUrl = "http://www.omdbapi.com/?t=" + findMovie + "&y=&plot=short&apikey=trilogy";
  
  request(queryUrl, function(err, res, body) {
  	var bodyOf = JSON.parse(body);
    if (!err && res.statusCode === 200) {
      display("\n---------------------------------------------------\n");
      display("Title: " + bodyOf.Title);
      display("Release Year: " + bodyOf.Year);
      display("IMDB Rating: " + bodyOf.imdbRating);
      display("Rotten Tomatoes Rating: " + bodyOf.Ratings[1].Value); 
      display("Country: " + bodyOf.Country);
      display("Language: " + bodyOf.Language);
      display("Plot: " + bodyOf.Plot);
      display("Actors: " + bodyOf.Actors);
      display("\n---------------------------------------------------\n");
    }
  });
};


function getRandom() {
fs.readFile('random.txt', "utf8", function(error, data){

    if (error) {
        return display(error);
      }

  
    var dataArray = data.split(",");
    
    if (dataArray[0] === "spotify-this-song") 
    {
      var songcheck = dataArray[1].trim().slice(1, -1);
      spotifySong(songcheck);
    } 
    else if (dataArray[0] === "concert-this") 
    { 
      if (dataArr[1].charAt(1) === "'")
      {
      	var dLength = dataArray[1].length - 1;
      	var data = dataArray[1].substring(2,dLength);
      	console.log(data);
      	bandsInTown(data);
      }
      else
      {
	      var nameOfBand = dataArray[1].trim();
	      console.log(nameOfBand);
	      bandsInTown(nameOfBand);
	  }
  	  
    } 
    else if(dataArray[0] === "movie-this") 
    {
      var movie_name = dataArray[1].trim().slice(1, -1);
      movieInfo(movie_name);
    } 
    
    });

};

function display(logData) {

	console.log(logData);

	fs.appendFile('log.txt', logData + '\n', function(err) {
		
		if (err) return display('Error logging data to file: ' + err);	
	});
}


switchCase();