(function(module) {
  var repos = {};

  repos.all = [];

  repos.requestRepos = function(callback) {
    // DONE: How would you like to fetch your repos? Don't forget to call the callback.
    var qs = '?per_page=100&sort=updated';
    // $.get('/github/user/MarsDragon/repos' + qr).done(function(data, msg, xhr){
    //   repos.all = data;
    // }).done(callback);

    $.ajax({
      url: 'https://api.github.com/users/MarsDragon/repos' + qs,
      type: 'GET',
      headers: {'Authorization': 'token ' + github.getToken()},
      success: function(data, msg, xhr){
        repos.all = data;
      }
    }).done(callback);
  };

  // DONE: Model method that filters the full collection for repos with a particular attribute.
  // You could use this to filter all repos that have a non-zero `forks_count`, `stargazers_count`, or `watchers_count`.
  repos.with = function(attr) {
    console.log('repos.with called');
    var data = repos.all.filter(function(repo) {
      return repo[attr];
    });

    return data;
  };

  module.repos = repos;
})(window);
