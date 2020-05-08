var api_key1 = "8015d3952263abaa7d04e41107994526"
var api_key2 = "&k=368220-umdb-OO5NRIBR"

var mainMovie = $("#main-jumbo");
var displayRecommendations = $("#recommendations");

var recommendations = [];
var alreadySearched = false;

var searchHistory = JSON.parse(localStorage.getItem('savedHistory')) || [];
var historyTitles = JSON.parse(localStorage.getItem('historyTitles')) || [];


function postHistoryList(){
    $("#movieHistoryList").empty();
    for(var i = 0; i < searchHistory.length; i++){
        console.log(searchHistory[i])
        $("#movieHistoryList").append(createCard(searchHistory[i]))
        
    }
}

$("#search-button").on("click", function(){
    console.log("Search Button");
    var movie = $(".movie-search").val();
    Search(movie);
    $(".movie-search").val("");
})

$(document).on("click", ".searchable-movie", function(event){
    console.log("Recommended Movie clicked " + event.target.getAttribute("movie-name"));
    var movie = event.target.getAttribute("movie-name");
    Search(movie);
})

function PopulateSearchHistory(){

    $("#search-history").empty();
    for(var i = 0; i < searchHistory.length; i++){
        //Sidebar list
        var newItem = $('<li class="historyBtn list-group-item">');
        newItem.html(searchHistory[i].Title);
        newItem.addClass("searchable-movie");
        newItem.attr("movie-name", searchHistory[i].Title);
        $("#search-history").prepend(newItem);
        
    }

}


function AddSearchHistory(omdbResponse){
    if(!historyTitles[historyTitles.indexOf(omdbResponse.Title)]){
        console.log("New entry to search history")

        searchHistory.push(omdbResponse);
        historyTitles.push(omdbResponse.Title);

        PopulateSearchHistory();

        //Update local storage
        localStorage.setItem('savedHistory', JSON.stringify(searchHistory));
        localStorage.setItem('historyTitles', JSON.stringify(historyTitles));


    }
    else console.log("Title already in search history")

}

function Search(movie){

    alreadySearched = true;

    mainMovie.empty();
    displayRecommendations.empty();

    //Create Card for Movie user submitted
    omdb(movie, "main");

    //Create Cards for Movies similar to user submitted (numberOfRecommendations)
    tasteDive(movie);
}

function createCard(omdbResponse){
    var cardDiv = $('<div class="float-left card mb-3" style="max-width: 540px;">');
    var rowDiv = $('<div class="row no-gutters">');
    var leftCol = $('<div class="col-md-4">');
    var rightCol = $('<div class="col-md-8">');
    var img = $('<img src="..." class="card-img" alt="...">');
    img.attr("src", omdbResponse.Poster);
    // img.error(function(){cardDiv.attr("style", "display: none;")})
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
}

function RenderMain(omdbResponse){

    if(alreadySearched) mainMovie.empty();

    var leftCol = $('<div class="col-8">');
    var rightCol = $('<div class="col-4">');
    var jumboTitle = $('<h1 class="display-4">');
    jumboTitle.text(omdbResponse.Title);
    var jumboText = $('<p class="lead">')
    jumboText.text(omdbResponse.Plot);
    var jumboPoster = $('<img id="jumbotronImage">')
    jumboPoster.attr("src", omdbResponse.Poster);

    var trailer = $('<iframe width="80%" height="auto" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" ></iframe>')
    trailer.attr("src", "https://www.youtube.com/embed?listType=search&list=" + omdbResponse.Title + "trailer")

    leftCol.append(jumboTitle);
    leftCol.append(jumboText);

    leftCol.append(trailer);
    
    rightCol.append(jumboPoster);
    mainMovie.append(leftCol);
    mainMovie.append(rightCol);
}

function AddRecommended(omdbResponse){

        var div = $('<div class="col-md-4 card-body rounded-lg">');
        var img = $('<img class="cardImg">');
        img.attr("src", omdbResponse.Poster);
        img.error(function(){div.attr("style", "display: none;")})
        img.attr("movie-name", omdbResponse.Title);
        img.addClass("searchable-movie");

        div.append(img);

        displayRecommendations.append(div);

}

function tasteDive(movieName){
    var tasteDiveURL = "https://cors-anywhere.herokuapp.com/https://tastedive.com/api/similar?q=" + movieName + api_key2;
    $.ajax({
        url: tasteDiveURL,
        method: "GET"
    }).then(function(tasteDiveResponse){
        // console.log("Taste Dive:");
        // console.log(tasteDiveResponse);
        
        displayRecommendations.empty();
        for (var i = 0; i < tasteDiveResponse.Similar.Results.length; i++) {
            recommendations[i] = tasteDiveResponse.Similar.Results[i].Name;

            if(!recommendations[i]) console.log("Taste Dive Missing Result");
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
        // console.log("OMDB:");
        // console.log(omdbResponse);

        //Prevent displaying responses with no content
        if(!omdbResponse.Poster) {
            console.log(movieName + " No poster");
            return;
        }

        if(target == "main") {
            RenderMain(omdbResponse);
            AddSearchHistory(omdbResponse);
        }
        else if(target == "recommend") AddRecommended(omdbResponse);
        else console.log("No Target");
    })
}
