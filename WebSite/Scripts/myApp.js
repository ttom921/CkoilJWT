var App = angular.module('myApp', ['ngRoute']);
//config routing
App.config(['$routeProvider', function ($routeProvider) {
    $routeProvider
        .when('/', {
            redirectTo: '/home'
        })
        .when('/home', {
            templateUrl: '/template/home.html',
            controller: 'homeController'
        })
        .when('/authenticated', {
            templateUrl: '/template/authenticate.html',
            controller: 'authenticateController'
        })
        .when('/authorized', {
            templateUrl: '/template/authorize.html',
            controller: 'authorizeController'
        })
        .when('/login', {
            templateUrl: '/template/login.html',
            controller: 'loginController'
        })
        .when('/unauthorized', {
            templateUrl: '/template/unauthorize.html',
            controller: 'unauthorizeController'
        })
        


}]);
//global veriable for store service base path
App.constant('serviceBasePath', 'http://localhost:52465/');

//controller
App.controller('homeController', ['$scope', 'dataService', function ($scope, dataService) {
    //FETCH DATA FROM SERVICES
    $scope.data = "";
    dataService.GetAnonymousData().then(function (data) {
        $scope.data = data;
    });
}]);
App.controller('authenticateController', ['$scope', 'dataService', function ($scope, dataService) {
    $scope.data = "";
    dataService.GetAuthenticateData().then(function (data) {
        $scope.data = data;
    })
}]);
App.controller('authorizeController', ['$scope', 'dataService', function ($scope, dataService) {
    //FETCH DATA FROM SERVICES
    $scope.data = "";
    dataService.GetAuthorizeData().then(function (data) {
        $scope.data = data;
    })
}])
App.controller('loginController', ['$scope', 'accountService', '$location', function ($scope, accountService, $location) {
    //FETCH DATA FROM SERVICES
    $scope.account = {
        username: '',
        password:''
    }
    $scope.message = "";
    $scope.login = function () {
        accountService.login($scope.account).then(function (data) {
            $location.path('/home');
        }, function (error) {
            $scope.message = error.error_description;
        });
    };
}]);
//service
App.factory('dataService', ['$http', 'serviceBasePath', function ($http, serviceBasePath) {
    var fac = {};
    fac.GetAnonymousData = function () {
        return $http.get(serviceBasePath + '/api/data/forall').then(function (response) {
            return response.data;
        });
    }
    fac.GetAuthenticateData = function () {
        return $http.get(serviceBasePath + '/api/data/authenticate').then(function (response) {
            return response.data;
        });
    }
    fac.GetAuthorizeData = function myfunction() {
        return $http.get(serviceBasePath + '/api/data/authorize').then(function (response) {
            return response.data;
        });
    }
    return fac;
}]);
App.factory('userService', function () {
    var fac = {};
    fac.CurrentUser = null;
    fac.SetCurrentUser = function (user) {
        fac.CurrentUser = user;
        sessionStorage.uer = angular.toJson(user);
    }
    fac.getCurrentUser = function () {
        fac.CurrentUser = angular.fromJson(sessionStorage.uer);
        return fac.CurrentUser;
    }
    return fac;
});
App.factory('accountService', ['$http', '$q', 'serviceBasePath', 'userService', function ($http, $q, serviceBasePath, userService) {
    var fac = {};
    fac.login = function (user) {
        var obj = { 'username': user.username, 'password': user.password, 'grant_type': 'password' };
        Object.toparams = function ObjectsToParams(obj) {
            var p = [];
            for (var key in obj) {
                p.push(key + '='+ encodeURIComponent(obj[key]));
            }
            return p.join('&');
        }
        var defer = $q.defer();
        $http({
            method: 'post',
            url: serviceBasePath + "/token",
            data: Object.toparams(obj),
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        }).then(function (response) {
            userService.SetCurrentUser(response.data);
            defer.resolve(response.data);
        }, function (error) {
                defer.reject(error.data);
        });
        return defer.promise;
    }
    fac.logout = function () {
        userService.CurrentUser = null;
        userService.SerCurrentUser(userService.CurrentUser);
    }
    return fac;
}]);
//http interceptor
App.config(['$httpProvider', function ($httpProvider) {
    var interceptor = function (userService, $q, $location) {
        return {
            request: function (config) {
                var currentUser = userService.getCurrentUser();
                if (currentUser != null) {
                    config.headers['Authorization'] = 'Bearer ' + currentUser.access_token;
                }
                return config;
            },
            responseError: function (rejection) {
                //console.log('responseError-->' + rejection.data.Message);
                console.log('responseError-->rejection.status=' + rejection.status);
                if (rejection.status === 401)
                {
                    //console.log('responseError-->' + rejection.data.Message);
                    $location.path('/login');
                    return $q.reject(rejection);
                }
                if (rejection.status === 403)
                {
                    $location.path('/unauthorized');
                    return $q.reject(rejection);
                }
                return $q.reject(rejection);
            }
        }
    };
    var params = ['userService', '$q', '$location'];
    interceptor.$inject = params;
    $httpProvider.interceptors.push(interceptor);

}]);