var api_key = "8015d3952263abaa7d04e41107994526"

$(".button").on("click", function(){
    var movie = $(".movie-search").val();
    omdb(movie);
    
})

function omdb(searchParam){
    var queryURL1 = "https://www.omdbapi.com/?t=" + searchParam + "&apikey=trilogy";
    $.ajax({
        url: queryURL1,
        method: "GET"
    }).then(function(response){
        console.log(response);
        // call movieSearch here
    })
}

function movieSearch(param) {
    var queryURL2 = "https://api.themoviedb.org/3/movie/550?api_key=" + api_key + "";
    $.ajax({
        url: queryURL2,
        method:"GET"
    }).then(function(response){
        console.log(response);
    })
    
}