var app = angular.module('ergo', ['ngRoute', 'ngResource']);

app.config(function($routeProvider, $locationProvider) { 
  $routeProvider 
    .when('/', {
			controller: 'ArgumentListController',
      templateUrl: 'views/argument/list.html' 
    })
    .when('/argument/:key', { 
      controller: 'ArgumentDetailController', 
      templateUrl: 'views/argument/single.html' 
    })
    .otherwise({ 
      redirectTo: '/' 
    });
});

app.run(function($rootScope) {

});
