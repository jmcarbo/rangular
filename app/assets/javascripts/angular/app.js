var rerp = angular.module('rerp', ['ngRoute','xeditable','ActiveRecord','infinite-scroll']);

rerp.factory('Task', function(ActiveRecord){
  return ActiveRecord.extend({
    $urlRoot: '/wikis'
  });
});

rerp.run(function(editableOptions) {
  editableOptions.theme = 'bs3'; // bootstrap3 theme. Can be also 'bs2', 'default'
});

rerp.controller('Ctrl', function($scope, $http, Task, $document) {

  $scope.user = {
      name: 'awesome user'
    };  

  $scope.myclick = function(){
  
    $http({url: '/wikis.json', method: 'GET'})
      .success(function (data, status, headers, config) {
        console.log(data); // Should log 'foo'
      });
  };

  $scope.myclick2 = function(){
     Task.fetchOne(1).then(function (task7) { 
       $scope.task = task7; 
     });
  };

  $scope.saveTask = function (task) {
    $scope.spinnerVisible = true;
    task.$save().then(function () {
      $scope.successVisible = true;
    }).catch(function (error) {
      $scope.error = error;
    }).finally(function () {
      $scope.spinnerVisible = false;
    });
  };

  $scope.newTask = function (task) {
    var taskn = new Task();
    taskn.title = task.title;
    taskn.body = task.body;
    $scope.spinnerVisible = true;
    taskn.$save().then(function () {
      $scope.successVisible = true;
    }).catch(function (error) {
      $scope.error = error;
    }).finally(function () {
      $scope.spinnerVisible = false;
    });
  };
});

rerp.factory('authInterceptor', function ($rootScope, $q, $window) {
  return {
    request: function (config) {
      config.headers = config.headers || {};
      if ($window.sessionStorage.token) {
        config.headers.Authorization = 'Bearer ' + $window.sessionStorage.token;
      }
      return config;
    },
    response: function (response) {
      if (response.status === 401) {
        // handle the case where the user is not authenticated
      }
      return response || $q.when(response);
    }
  };
});

rerp.config(function ($httpProvider) {
  $httpProvider.interceptors.push('authInterceptor');
});

rerp.controller('UserCtrl', function ($scope, $http, $window) {
  $scope.images = [1, 2, 3, 4, 5, 6, 7, 8];

    $scope.loadMore = function() {
        var last = $scope.images[$scope.images.length - 1];
        for(var i = 1; i <= 8; i++) {
              $scope.images.push(last + i);
            }
      };
  $scope.user = {username: 'john.doe', password: 'foobar'};
  $scope.message = '';
  $scope.submit = function () {
    $http
      .post('/authenticate', $scope.user)
      .success(function (data, status, headers, config) {
        $window.sessionStorage.token = data.token;
        $scope.message = 'Welcome';
      })
      .error(function (data, status, headers, config) {
        // Erase the token if the user fails to log in
        delete $window.sessionStorage.token;

        // Handle login errors here
        $scope.message = 'Error: Invalid user or password';
      });
  };
});
