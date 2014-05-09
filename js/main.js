// reference: https://software.intel.com/en-us/html5/articles/how-to-access-JSON-data-in-HTML5-apps
// https://software.intel.com/en-us/html5/articles/how-to-access-JSON-data-in-HTML5-apps
// callback introduction: http://callbackhell.com/

var API_BASE = "http://api.espn.com/v1/";
var API_PATH = "sports/news";
var API_NAME = "apikey";
var API_KEY = "72hur4sdsjdbghuynm3z2t2k";
var FULL_URL = API_BASE + API_PATH + "?" + API_NAME + "=" + API_KEY;
// var FULL_URL = "http://skoushan.com/articles.json";
var ERROR_MSG = "Unable to retrieve articles :(";

function getArticles(JSON_url, callback) {
    $.getJSON(JSON_url)
        .done(function(json){
            var retrievedArticles = json['headlines'];
            $('#retrieve-error').remove();
            callback(retrievedArticles);
        })
        .fail(function(jqxhr, textStatus, error){
            var err = textStatus + ", " + error;
            console.log("Request Failed: " + error);
            if($('#retrieve-error').length < 1)
                $('body').prepend("<p id='retrieve-error'>" + ERROR_MSG + "</p>");
            callback(null);
    });
}

function determineNewArticles(curArticles, retrievedArticles) {
    var newArticles = [];

    if(curArticles == null){
        newArticles = retrievedArticles;
    }
    else if(retrievedArticles != null){
        $.each(retrievedArticles, function(index, retrievedArticle){
            var found = false;
            $.each(curArticles, function(index, curArticle){
                if(retrievedArticle.id == curArticle.id){
                    found = true;
                    return false;
                }
            });
            if(!found){
                newArticles.push(retrievedArticle);
                console.log(retrievedArticle);
            }
        });
    }

    return newArticles;
}

function printArticles(articles){
    var default_img = "http://a.espncdn.com/i/espn/espn_logos/espn_red.png";
    
    articles.sort(function(a,b){
        return new Date(a.published) - new Date(b.published);
    });

    $.each(articles, function(index, article){
        img = default_img;
        if(article.images && article.images[0]){
            img = article.images[0].url;
        }
        var articleID = "article-" + article.id;
        $('#article-feed').prepend($('<div>',{id:articleID, class:'article'}));
        $("#" + articleID).append($('<div>',{class:"thumbnail"}));
        $("#" + articleID).append($('<div>',{class:"details"}));

        $('#' + articleID + ' .thumbnail').css('background-image', 'url('+img+')');

        var url = "";
        if(article.links && article.links.mobile){
            url = article.links.mobile.href;
        }
        $('#' + articleID + ' .details').append($('<a>', {text: article.headline, class:'headline', href:url}));
        
        var date = moment(article.published).fromNow();
      
        $('#' + articleID + ' .details').append($('<span>', {text: date, class:'date'}));
        $('#' + articleID + ' .details').append($('<span>', {text: article.source, class:'source'}));

        var description = "";
        if(article.description)
            description = article.description.substr(0,30);
        description = description.substr(0,description.lastIndexOf(' ')) + "...";
        // $('#' + articleID + ' .details').append($('<span>', {text: description, class:'description'}));
    });
}

$(document).ready(function(){ 
    curArticles = [];

    run = function(){
        getArticles(FULL_URL, function(retrievedArticles){
            var newArticles = determineNewArticles(curArticles, retrievedArticles);
            printArticles(newArticles);
            curArticles = curArticles.concat(newArticles);
        });
    }

    run();
    setInterval(run, 5000);
});