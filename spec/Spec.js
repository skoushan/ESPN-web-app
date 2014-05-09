//http://stackoverflow.com/questions/4662641/how-do-i-verify-jquery-ajax-events-with-jasmine
//jasmine.getFixtures().fixturesPath = 'spec/fixtures';


describe("getArticles with bad URL", function() {
    var callback;
    
    beforeEach(function(done) {
	   	setFixtures('<table id="article-feed"></table>');
    	callback = jasmine.createSpy();
		getArticles("bad url", function(articles) {
			callback(articles);
			done();
		});
    });
    it("should callback with null", function(){
        expect(callback).toHaveBeenCalled();
    });
    it("should display error", function(){
    	expect($('#retrieve-error').length).toEqual(1);
    });
});

describe("getArticles with good URL", function(){
    var articlesReturned;
    
    beforeEach(function(done) {
		getArticles(FULL_URL, function(articles) {
			articlesReturned = articles;
			done();
		});
    });
    it("should callback with non-null object", function(){
        expect(articlesReturned).not.toBeNull();
    });
});

var article0 = {'id':0, 'published':'2014-01-01T00:00:00Z'};
var article1 = {'id':1, 'published':'2014-01-01T00:00:01Z'};
var article2 = {'id':2, 'published':'2014-01-02T00:00:00Z'};
var article3 = {'id':3, 'published':'2014-03-01T00:00:00Z'};
var article4 = {'id':4, 'published':'2015-01-01T00:00:00Z'};

var articles0 = [article0, article1];
var articles1 = [article1, article2];

describe("determineNewArticles", function(){
	it("empty array when retrieved articles are null", function(){
		expect(determineNewArticles(articles0, null).length).toEqual(0);
	});

	it("1 new article", function(){
		expect(determineNewArticles(articles0, articles1)).toEqual([article2]);
	});
});

describe("printArticles", function(){
    beforeEach(function() {
	   	setFixtures('<table id="article-feed"></table>');
	});

	it("should print in order", function(){
		printArticles([article4, article2, article0, article1, article3]);
		var articles = [];
		$('#article-feed .article').each(function(i,v){
			var id = $(this).attr('id');
			id = id.substr(id.indexOf('-') + 1, id.length);
			console.log(id);
			articles.push(parseInt(id));
		});
		expect(articles[0]).toEqual(article4.id);
		expect(articles[1]).toEqual(article3.id);
		expect(articles[2]).toEqual(article2.id);
		expect(articles[3]).toEqual(article1.id);
		expect(articles[4]).toEqual(article0.id);
	});
});