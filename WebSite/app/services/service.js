

//http interceptor
//App.config(['$httpProvider', function ($httpProvider) {
//    var interceptor = function (userService, $q, $location) {
//        return {
//            request: function (config) {
//                var currentUser = userService.getCurrentUser();
//                if (currentUser != null) {
//                    config.headers['Authorization'] = 'Bearer ' + currentUser.access_token;
//                }
//                return config;
//            },
//            responseError: function (rejection) {
//                //console.log('responseError-->' + rejection.data.Message);
//                console.log('responseError-->rejection.status=' + rejection.status);
//                if (rejection.status === 401) {
//                    //console.log('responseError-->' + rejection.data.Message);
//                    $location.path('/login');
//                    return $q.reject(rejection);
//                }
//                if (rejection.status === 403) {
//                    $location.path('/unauthorized');
//                    return $q.reject(rejection);
//                }
//                return $q.reject(rejection);
//            }
//        }
//    };
//    var params = ['userService', '$q', '$location'];
//    interceptor.$inject = params;
//    $httpProvider.interceptors.push(interceptor);

//}]);