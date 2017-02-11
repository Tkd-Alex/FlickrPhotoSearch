var app = angular.module('app', [ 'ui.router', 'ui.bootstrap' ]);

app.controller('homeController', function ($scope, $http) {
  $scope.searchFilter = {};
  $scope.searchPhoto = function(){
    var parameters = "";

    if($scope.searchFilter.user_id && $scope.searchFilter.user_id !== "")
      parameters += "&user_id=" + $scope.searchFilter.user_id;
    if($scope.searchFilter.tags && $scope.searchFilter.tags !== "")
      parameters += "&tags=" + $scope.searchFilter.tags;
    if($scope.searchFilter.tag_mode && $scope.searchFilter.tag_mode !== "")
      parameters += "&tag_mode=" + $scope.searchFilter.tag_mode;

    parameters += "&content_type=1" +
                  "&has_geo=1" +
                  "&extras=url_c%2C+url_l%2C+url_o%2Cgeo%2C+tags" +
                  "&per_page=5" +
                  "&page=1";

    var link = "https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=f0c6a72c9ab375e55dea57566b7e8905" + parameters + "&format=json&nojsoncallback=1";

    $http.get(link)
      .then(function(response) {
        if(response.data.stat == "ok")
          $scope.photos = response.data.photos.photo;
      });
  };

});
