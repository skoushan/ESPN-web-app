// reference: https://software.intel.com/en-us/html5/articles/how-to-access-JSON-data-in-HTML5-apps
// https://software.intel.com/en-us/html5/articles/how-to-access-JSON-data-in-HTML5-apps

// function getArticles(json_url, data, callback){
//     $.getJSON(json_url,)
// }

// callback introduction: http://callbackhell.com/

var API_BASE = "http://api.espn.com/v1/";
var API_PATH = "sports/news";
var API_NAME = "apikey";
var API_KEY = "72hur4sdsjdbghuynm3z2t2k";
var FULL_URL = API_BASE + API_PATH + "?" + API_NAME + "=" + API_KEY;

function getArticles(JSON_url, callback) {
    $.getJSON(JSON_url)
        .done(function(json){
            var articles = json['headlines'];
            alert("done");
            callback(articles);
        })
        .fail(function(jqxhr, textStatus, error){
            var err = textStatus + ", " + error;
            console.log("Request Failed: " + error);
            // $('#article-feed').text("<p style='color:red'>Unable to retrieve articles :(</p>");
            alert("fail");
            callback(null);
    });
}

function determineChangedArticles() {

}


function printArticles(oldArticles){
    $.getJSON('http://api.espn.com/v1/sports/news?apikey=72hur4sdsjdbghuynm3z2t2k', function(data) {
        var newArticles = data['headlines'];
        
        //http://stackoverflow.com/questions/6857468/a-better-way-to-convert-js-object-to-array
        var newArticlesArray = $.map(newArticles, function(value, index){
            return [value];
        });

        // http://stackoverflow.com/questions/17684921/sort-json-object-in-javascript
        newArticlesArray.sort(function(a,b){
            return new Date(b.published) - new Date(a.published);
        });

        var startingIndex = newArticlesArray.length-1;
        if(oldArticles != null){
            var indexNum =-1;
            for(var i = 0; i < newArticlesArray.length; i++){
                if(JSON.stringify(newArticlesArray[i]) === JSON.stringify(oldArticles[0])){
                    indexNum = i;
                    break;
                }
            }
        }

        if(oldArticles != null && indexNum != -1){
            startingIndex = indexNum - 1;
        }
        
        for(var i = startingIndex; i >=0; i--){
            var img = "http://a.espncdn.com/i/espn/espn_logos/espn_red.png";
            if(newArticlesArray[i].images && newArticlesArray[i].images[0]){
                img = newArticlesArray[i].images[0].url;
            }
            var articleID = "article-" + newArticlesArray[i].id;
            $('#article-feed').prepend($('<tr>',{id:articleID}));
            $("#" + articleID).append($('<td>',{class:"thumbnail",}));
            $("#" + articleID).append($('<td>',{class:"description"}));

            $('#' + articleID + ' td.thumbnail').css('background-image', 'url('+img+')')
            $('#' + articleID + ' td.description').prepend($('<div>', {
                text: newArticlesArray[i].headline
            }));
        }

        oldArticles = newArticlesArray;
        console.log("fetched news");
    
        setTimeout(function(){printArticles(oldArticles)}, 30000);
    });
}

$(document).ready(function(){ 
    getArticles("hh", alert);
    printArticles(null);
});