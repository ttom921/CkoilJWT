App.factory('authService', ['$http', '$q', '$location', 'localStorageService', 'ngAuthSettings', function ($http, $q, $location,localStorageService, ngAuthSettings) {
    var fac = {};
    var serviceBasePath = ngAuthSettings.apiServiceBaseUri;
    fac.login = function (user) {
        var obj = { 'username': user.username, 'password': user.password, 'grant_type': 'password' };
        Object.toparams = function ObjectsToParams(obj) {
            var p = [];
            for (var key in obj) {
                p.push(key + '=' + encodeURIComponent(obj[key]));
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
            console.log('aaaaaa response->' + response);
            //userService.SetCurrentUser(response.data);
            defer.resolve(response.data);
            }, function (error) {
                console.log('bbbb fail->');
            defer.reject(error.data);
        });
        return defer.promise;
    }
    fac.logout = function () {
        console.log('logout function');
        //userService.CurrentUser = null;
        //userService.SetCurrentUser(userService.CurrentUser);
    }
    return fac;
}]);