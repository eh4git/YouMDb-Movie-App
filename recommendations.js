var api_key1 = "8015d3952263abaa7d04e41107994526"
var api_key2 = "&k=368220-umdb-OO5NRIBR"

var movieDiv = $(".movie-div");
var recommendationsDiv = $(".recommendations-div");

var recommendations = [];
var numberOfRecommendations = 5;
var alreadySearched = false;

$(".button").on("click", function(){
    if(alreadySearched){
        movieDiv.empty();
        recommendationsDiv.empty();
    }
    alreadySearched = true;

    var movie = $(".movie-search").val();

    //Create Card for Movie user submitted
    omdb(movie, "main");

    //Create Cards for Movies similar to user submitted (numberOfRecommendations)
    tasteDive(movie);
    
})

function createCard(omdbResponse){

    var cardDiv = $('<div class="card mb-3" style="max-width: 540px;">');
    var rowDiv = $('<div class="row no-gutters">');
    var leftCol = $('<div class="col-md-4">');
    var rightCol = $('<div class="col-md-8">');
    var img = $('<img src="..." class="card-img" alt="...">');
    img.attr("src", omdbResponse.Poster);
    var cardBody = $('<div class="card-body" id="main-body">');
    var cardTitle = $('<h5 class="card-title" id="main-title"></h5>');
    cardTitle.text(omdbResponse.Title);
    var cardText = $('<p class="card-text" id="main-text"></p>');
    cardText.text(omdbResponse.Plot);
    var infoText = "Rated: " + omdbResponse.Rated + " Released: " + omdbResponse.Year;
    var cardInfo = $('<p class="card-text"><small class="text-muted">' + infoText + '</small></p>');

    cardBody.append(cardTitle);
    cardBody.append(cardInfo);
    cardBody.append(cardText);
    rightCol.append(cardBody);
    leftCol.append(img);
    rowDiv.append(leftCol);
    rowDiv.append(rightCol);
    cardDiv.append(rowDiv);
    
    return cardDiv;

    // // var titleTag = $("<p>").text("Title: " + title);
    // // var yearTag = $("<p>").text("Released: " + year);
    // // var ratingTag = $("<p>").text("Rated: " + rating);
    // // var genreTag = $("<p>").text("Genre: " + genre);
    // // var plotTag = $("<p>").text("Plot: " + plot);

}

function tasteDive(movieName){
    var tasteDiveURL = "https://cors-anywhere.herokuapp.com/https://tastedive.com/api/similar?q=" + movieName + api_key2;
    $.ajax({
        url: tasteDiveURL,
        method: "GET"
    }).then(function(tasteDiveResponse){
        console.log("Taste Dive:");
        console.log(tasteDiveResponse);

        for (var i = 0; i < numberOfRecommendations; i++) {
            recommendations[i] = tasteDiveResponse.Similar.Results[i].Name;
            console.log(recommendations[i]);

            omdb(recommendations[i], "recommend");
        }
    
    })
}


function omdb(movieName, target){
    var omdbURL = "https://www.omdbapi.com/?t=" + movieName + "&apikey=trilogy";
    $.ajax({
        url: omdbURL,
        method: "GET",
    }).then(function(omdbResponse){
        console.log("OMDB:");
        console.log(omdbResponse);

        //Prevent displaying responses with no content
        if(!omdbResponse.Poster) {
            console.log(movieName + " No poster");
            return;
        }

        if(target == "main") movieDiv.append(createCard(omdbResponse));
        else if(target == "recommend") recommendationsDiv.append(createCard(omdbResponse));
        else console.log("Error");
    })
}

    