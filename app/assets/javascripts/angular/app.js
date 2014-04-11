var rerp = angular.module('rerp', ['ngRoute','xeditable','ActiveRecord','infinite-scroll','ui.bootstrap','angularFileUpload']);

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
  $scope.myVal = 0;

  $scope.loadMore = function() {
    var last = $scope.images[$scope.images.length - 1];
    for(var i = 1; i <= 8; i++) {
      $scope.images.push(last+i);
    }
    $scope.$apply();
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
 // The example of the full functionality
    rerp.controller('UploadController', function ($scope, $fileUploader) {
        'use strict';

        // create a uploader with options
        var uploader = $scope.uploader = $fileUploader.create({
            scope: $scope,                          // to automatically update the html. Default: $rootScope
            url: 'upload.php',
            formData: [
                { key: 'value' }
            ],
            filters: [
                function (item) {                    // first user filter
                    console.info('filter1');
                    return true;
                }
            ]
        });

        // ADDING FILTERS

        uploader.filters.push(function (item) { // second user filter
            console.info('filter2');
            return true;
        });

        // REGISTER HANDLERS

        uploader.bind('afteraddingfile', function (event, item) {
            console.info('After adding a file', item);
        });

        uploader.bind('whenaddingfilefailed', function (event, item) {
            console.info('When adding a file failed', item);
        });

        uploader.bind('afteraddingall', function (event, items) {
            console.info('After adding all files', items);
        });

        uploader.bind('beforeupload', function (event, item) {
            console.info('Before upload', item);
        });

        uploader.bind('progress', function (event, item, progress) {
            console.info('Progress: ' + progress, item);
        });

        uploader.bind('success', function (event, xhr, item, response) {
            console.info('Success', xhr, item, response);
        });

        uploader.bind('cancel', function (event, xhr, item) {
            console.info('Cancel', xhr, item);
        });

        uploader.bind('error', function (event, xhr, item, response) {
            console.info('Error', xhr, item, response);
        });

        uploader.bind('complete', function (event, xhr, item, response) {
            console.info('Complete', xhr, item, response);
        });

        uploader.bind('progressall', function (event, progress) {
            console.info('Total progress: ' + progress);
        });

        uploader.bind('completeall', function (event, items) {
            console.info('Complete all', items);
        });

    });
