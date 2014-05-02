APPARENTLY WORKS
// reference: https://software.intel.com/en-us/html5/articles/how-to-access-JSON-data-in-HTML5-apps
// https://software.intel.com/en-us/html5/articles/how-to-access-JSON-data-in-HTML5-apps
function printArticles(oldArticles){
    $.getJSON('http://api.espn.com/v1/sports/news?apikey=72hur4sdsjdbghuynm3z2t2k', function(data) {
        var newArticles = data.headlines;
        
        //http://stackoverflow.com/questions/6857468/a-better-way-to-convert-js-object-to-array
        var newArticlesArray = $.map(newArticles, function(value, index){
            return [value];
        });

        // http://stackoverflow.com/questions/17684921/sort-json-object-in-javascript
        newArticlesArray.sort(function(a,b){
            return new Date(b.published) - new Date(a.published);
        });

        
        for(var i = newArticlesArray.indexOf(oldArticles[0]) - 1; i >=0; i--){
            if(newArticlesArray[i].images[0]){
                $('body').prepend($('<img>', {
                    src: newArticlesArray[i].images[0].url || "http://a.espncdn.com/i/espn/espn_logos/espn_red.png"
                }));
            }
            $('body').prepend($('<div>', {
                text: newArticlesArray[i].headline
            }));
        }

        oldArticles = newArticlesArray;
        console.log("fetched news");
    
        setTimeout(function(){printArticles(oldArticles)}, 30000);
    });
}

$(document).ready(function(){ 
    printArticles(null);
});