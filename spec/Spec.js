//http://stackoverflow.com/questions/4662641/how-do-i-verify-jquery-ajax-events-with-jasmine

describe("JSON", function() {
    var main = {'getArticles':getArticles};
    var callback;
    
    beforeEach(function(done) {
        callback = {
            'func': function(value) {
                done();
            }
        }
        spyOn(callback, 'func');
        spyOn(main,'getArticles').and.callThrough();
        main.getArticles("hh",callback.func);
    });
    it("should callback with null if url is invalid", function(){
//        var callback = jasmine.createSpy();
        expect(callback.func).toHaveBeenCalledWith(null);
    });
////    var getArticles, callback;
//    
//    beforeEach(function(done) { 
//        spyOn(main,'getArticles').and.callThrough();
//        main.getArticles("hh",done);
////        getArticles = jasmine.createSpy('getArticles').and.callThrough();
////        getArticles("hh",done);
//    });
//        
//    it("should have been called", function(done){
//        expect(main.getArticles).toHaveBeenCalled();
////        expect(getArticles).toHaveBeenCalled();
//    });
});