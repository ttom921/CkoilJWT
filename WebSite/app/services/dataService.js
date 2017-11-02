App.factory('dataService', ['$http', 'ngAuthSettings', function ($http, ngAuthSettings) {
    var serviceBase = ngAuthSettings.apiServiceBaseUri;
    var dataServiceFactory = {};
    var _GetAnonymousData = function () {
        return $http.get(serviceBase + '/api/data/forall').then(function (response) {
            return response.data;
        });
    };
    var _GetAuthenticateData = function () {
        return $http.get(serviceBase + '/api/data/authenticate').then(function (response) {
            return response.data;
        });
    };
    var _GetAuthorizeData = function () {
        return $http.get(serviceBase + '/api/data/authorize').then(function (response) {
            return response.data;
        });
    };
    dataServiceFactory.GetAnonymousData = _GetAnonymousData;
    dataServiceFactory.GetAuthenticateData = _GetAuthenticateData;
    dataServiceFactory.GetAuthorizeData = _GetAuthorizeData;
    return dataServiceFactory;
}]);
//App.factory('dataService', ['$http', 'serviceBasePath', function ($http, serviceBasePath) {
//    var fac = {};
//    fac.GetAnonymousData = function () {
//        return $http.get(serviceBasePath + '/api/data/forall').then(function (response) {
//            return response.data;
//        });
//    }
//    fac.GetAuthenticateData = function () {
//        return $http.get(serviceBasePath + '/api/data/authenticate').then(function (response) {
//            return response.data;
//        });
//    }
//    fac.GetAuthorizeData = function myfunction() {
//        return $http.get(serviceBasePath + '/api/data/authorize').then(function (response) {
//            return response.data;
//        });
//    }
//    return fac;
//}]);