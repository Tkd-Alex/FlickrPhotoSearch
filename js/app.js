var app = angular.module('app', [ 'ui.router', 'ui.bootstrap', 'uiGmapgoogle-maps' ]);

app.directive("ngRandomClass", function () {
return {
    restrict: 'EA',
    replace: false,
    scope: {
        ngClasses: "=ngRandomClass"
    },
    link: function (scope, elem, attr) {
       //Add random background class to selected element
        elem.addClass(scope.ngClasses[Math.floor(Math.random() * (scope.ngClasses.length))]);
    }
};});

app.controller('homeController', function ($scope, $http) {

  var api_key =  "85c79d12baaa29778e1b1d81a836eaab";
  $scope.searchFilter = {};
  $scope.searchFilter.sort = "date-posted-desc";
  $scope.selectedPhoto = "http://www.androidworld.it/wp-content/uploads/2013/05/flickr.png";
  $scope.tags = {};

  $scope.classes = ["label-default","label-primary","label-success","label-warning","label-danger","label-info"];

  $scope.map = {
    center: {
      latitude: 51.219053,
      longitude: 4.404418
    },
    zoom: 8
  };

  $scope.marker = {coords: angular.copy($scope.map.center)};

  $scope.changeImage = function(photo) {
    $scope.getExif(photo.id);
    $scope.selectedPhoto = photo.url_l;
    $scope.map.center.latitude = photo.latitude;
    $scope.map.center.longitude = photo.longitude;
    $scope.marker = {coords: angular.copy($scope.map.center)};

    $scope.tags = photo.tags.split(" ");
  };

  $scope.consoleLog = function(message){
    console.log(message);
  };

  $scope.getExif = function(photoid){
    var link = "https://api.flickr.com/services/rest/?method=flickr.photos.getExif&api_key=" +api_key + "&photo_id=" + photoid +"&format=json&nojsoncallback=1";
    $http.get(link)
      .then(function(response) {
        if(response.data.stat == "ok"){
          $scope.exifs = response.data.photo.exif;
          console.log($scope.exifs);
          $scope.camera = response.data.photo.camera;
        }
      });
  };

  $scope.searchPhoto = function(){
    var parameters = "";
    $scope.camera = "";

    if($scope.searchFilter.user_id && $scope.searchFilter.user_id !== "")
      parameters += "&user_id=" + $scope.searchFilter.user_id;
    if($scope.searchFilter.tags && $scope.searchFilter.tags !== "")
      parameters += "&tags=" + $scope.searchFilter.tags;
    if($scope.searchFilter.tag_mode && $scope.searchFilter.tag_mode !== "")
      parameters += "&tag_mode=" + $scope.searchFilter.tag_mode;

    parameters += "&content_type=1" +
                  "&has_geo=1" +
                  "&extras=url_c%2C+url_l%2C+url_o%2Cgeo%2C+tags" +
                  "&per_page=12" +
                  "&page=1" +
                  "&sort=" + $scope.searchFilter.sort;

    var link = "https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=" + api_key + parameters + "&format=json&nojsoncallback=1";

    $http.get(link)
      .then(function(response) {
        if(response.data.stat == "ok")
          $scope.photos = response.data.photos.photo;
      });
  };

});
