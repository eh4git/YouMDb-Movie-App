var api_key1 = "8015d3952263abaa7d04e41107994526"
var api_key2 = "&k=368220-umdb-OO5NRIBR"

var mainImage = $("#main-image");
var mainTitle = $("#main-title");
var mainText = $("#main-text");

var similarImage = $("#similar-image");
var similarTitle = $("#similar-title");
var similarText = $("#similar-text");


$(".button").on("click", function(){
    var movie = $(".movie-search").val();
    omdb(movie);
    
})
var recommendations = [];
function omdb(searchParam){
    var queryURL1 = "https://www.omdbapi.com/?t=" + searchParam + "&apikey=trilogy";
    $.ajax({
        url: queryURL1,
        method: "GET"
    }).then(function(response){
        console.log(response);

        mainImage.attr("src", response.Poster);
        mainTitle.html(response.Title);
        mainText.html(response.Plot);

        // var queryDiv = $(".query-result");
        // queryDiv.empty();
        // var title = response.Title;
        // // var titleTag = $("<p>").text("Title: " + title);
        // queryDiv.append(titleTag);
        // var year = response.Year;
        // // var yearTag = $("<p>").text("Released: " + year);
        // queryDiv.append(yearTag);
        // var rating = response.Rated;
        // // var ratingTag = $("<p>").text("Rated: " + rating);
        // queryDiv.append(ratingTag);
        // var genre = response.Genre;
        // // var genreTag = $("<p>").text("Genre: " + genre);
        // queryDiv.append(genreTag);
        // var moviePoster = response.Poster;
        // var plot = response.Plot;
        // // var plotTag = $("<p>").text("Plot: " + plot);
        // queryDiv.append(plotTag);
        // // var image = $("<img>").attr("src", moviePoster);
        // queryDiv.append(image);

        var queryURL2 = "https://cors-anywhere.herokuapp.com/https://tastedive.com/api/similar?q=" + response.Title + api_key2;
            $.ajax({
            url: queryURL2,
            method: "GET"
        }).then(function(response){
            console.log(response);
            
            for (var i = 0; i < 5; i++) {
                recommendations[i]= response.Similar.Results[i].Name;
                console.log(recommendations[i]);
                var queryURL3 = "https://www.omdbapi.com/?t=" + recommendations[i] + "&apikey=trilogy";
               
                $.ajax({
                    url: queryURL3,
                    method: "GET"
                }).then(function(response){
                    console.log(response);
                    var moviePoster1 = response.Poster;
                    //  var image1 = $("<img>").attr("src", moviePoster1);
                    //  $(".query-result").prepend(image1);
                    similarImage.attr("src", moviePoster1);
                    similarTitle.html(response.Title);
                    similarText.html(response.Plot);
                })
            }
        })
    }
)}
    