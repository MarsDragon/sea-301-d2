// DONE: Wrap the entire contents of this file in an IIFE.
// Pass in to the IIFE a module, upon which objects can be attached for later access.
(function(module){

function Article (opts) {
  this.author = opts.author;
  this.authorUrl = opts.authorUrl;
  this.title = opts.title;
  this.category = opts.category;
  this.body = opts.body;
  this.publishedOn = opts.publishedOn;
}

Article.all = [];

Article.prototype.toHtml = function() {
  var template = Handlebars.compile($('#article-template').text());

  this.daysAgo = parseInt((new Date() - new Date(this.publishedOn))/60/60/24/1000);
  this.publishStatus = this.publishedOn ? 'published ' + this.daysAgo + ' days ago' : '(draft)';
  this.body = marked(this.body);

  return template(this);
};

Article.loadAll = function(rawData) {
  rawData.sort(function(a,b) {
    return (new Date(b.publishedOn)) - (new Date(a.publishedOn));
  });

  // DONE: Refactor this forEach code, by using a `.map` call instead, since want we are trying to accomplish
  // is the transformation of one colleciton into another.
  // rawData.forEach(function(ele) {
  //   Article.all.push(new Article(ele));
  // })
  Article.all = rawData.map(function(ele) {
    return new Article(ele);
  });
};

// This function will retrieve the data from either a local or remote source,
// and process it, then hand off control to the View.
// DONE: Refactor this function, so it accepts an argument of a callback function (likely a view function)
// to execute once the loading of articles is done.
Article.fetchAll = function(callNext) {
  if (localStorage.rawData) {
    Article.loadAll(JSON.parse(localStorage.rawData));
    callNext();
  } else {
    $.getJSON('/data/hackerIpsum.json', function(rawData) {
      Article.loadAll(rawData);
      localStorage.rawData = JSON.stringify(rawData); // Cache the json, so we don't need to request it next time.
      callNext();
    });
  }
};

// DONE: Chain together a `map` and a `reduce` call to get a rough count of all words in all articles.
Article.numWordsAll = function() {
  return Article.all.map(function(article) {
    var words = article.body.split(' '); //split into array based on whitespace
    return words.length;  // Get the total number of words in this article
  })
  .reduce(function(a, b) {
    return (a + b); // Sum up all the values in the collection
  })
};

// DONE: Chain together a `map` and a `reduce` call to produce an array of unique author names.
Article.allAuthors = function() {
  //create new array of unique authors
  var unique = [];
  return Article.all.map(function(article){
    //create array of just authr names
    return article.author;
  })
  .reduce(function(prev, curr){
    //if the author name is already in the unique array, just return that array
    if (unique.indexOf(curr) >= 0){
      return unique;
    }else{
      //if it is not in the array, add it to the array
      return unique.push(curr);
    }
  }, []) // Don't forget to read the docs on map and reduce!
};

Article.numWordsByAuthor = function() {
  // DONE: Transform each author string into an object with 2 properties: One for
  // the author's name, and one for the total number of words across all articles written by the specified author.
  return Article.allAuthors().map(function(author) {
    return {
      name: author,
      numWords: Article.all.filter(function(ele){
        //return a collection of the articles each author has written
        return ele.author === author;
      }).map(function(article){
        //return the number of words in each article
        var words = article.body.split(' ');
        return words.length;
      }).reduce(function(a, b){
        //sum all the words
        return (a + b);
      })
      // someKey: someValOrFunctionCall().map(...).reduce(...), ...
    }
  })
};

module.Article = Article;
})(window);
