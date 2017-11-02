App.factory('authService', ['$http', '$q', '$location', 'localStorageService', 'ngAuthSettings', function ($http, $q, $location, localStorageService, ngAuthSettings) {

    var serviceBase = ngAuthSettings.apiServiceBaseUri;
    var authServiceFactory = {};

    var _authentication = {
        isAuth: false,
        userName: "",
        useRefreshTokens: false
    };

    var _externalAuthData = {
        provider: "",
        userName: "",
        externalAccessToken: ""
    };

    //var _saveRegistration = function (registration) {

    //    _logOut();

    //    return $http.post(serviceBase + 'api/account/register', registration).then(function (response) {
    //        return response;
    //    });

    //};

    var _login = function (loginData) {
        console.log('username =' + loginData.userName + " password=" + loginData.password);
        var data = "grant_type=password&username=" + loginData.userName + "&password=" + loginData.password;
        if (loginData.useRefreshTokens) {
            data = data + "&client_id=" + ngAuthSettings.clientId;
        }
        var deferred = $q.defer();
        $http({
            method: 'post',
            url: serviceBase + "/token",
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            data: data
        }).then(function (res) {
            var response = res.data;
            //console.log('response.access_token->' + response.access_token);
            if (loginData.useRefreshTokens) {
                localStorageService.set('authorizationData', { token: response.access_token, userName: loginData.userName, refreshToken: response.refresh_token, useRefreshTokens: true });
            }
            else {
                localStorageService.set('authorizationData', { token: response.access_token, userName: loginData.userName, refreshToken: "", useRefreshTokens: false });
            }
            //
            //var authData = localStorageService.get('authorizationData');
            //if (authData) {
            //    console.log('authData.token' + authData.token);
            //}
            _authentication.isAuth = true;
            _authentication.userName = loginData.userName;
            _authentication.useRefreshTokens = loginData.useRefreshTokens;

            deferred.resolve(response);
        }, function (error) {
            //console.log('_login  error=data' + error.data + ' statusText=' + error.statusText);
            _logOut();
            deferred.reject(error);
        });
        return deferred.promise;
    };//_login

    var _logOut = function () {
        console.log('_logOut->start');
        localStorageService.remove('authorizationData');

        _authentication.isAuth = false;
        _authentication.userName = "";
        _authentication.useRefreshTokens = false;

    };

    var _fillAuthData = function () {

        var authData = localStorageService.get('authorizationData');
        if (authData) {
            _authentication.isAuth = true;
            _authentication.userName = authData.userName;
            _authentication.useRefreshTokens = authData.useRefreshTokens;
        }

    };

    var _refreshToken = function () {

        console.log('_refreshToken->start');
        var deferred = $q.defer();

        var authData = localStorageService.get('authorizationData');

        if (authData) {

            if (authData.useRefreshTokens) {

                var data = "grant_type=refresh_token&refresh_token=" + authData.refreshToken + "&client_id=" + ngAuthSettings.clientId;

                localStorageService.remove('authorizationData');

                $http({
                    method: 'post',
                    url: serviceBase + "/token",
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                    data: data
                }).then(function (res) {
                    var response = res.data;
                    localStorageService.set('authorizationData', { token: response.access_token, userName: response.userName, refreshToken: response.refresh_token, useRefreshTokens: true });
                    deferred.resolve(response);
                }, function (error) {
                    //console.log('_refreshToken  error=data' + error.data + ' statusText=' + error.statusText);
                    _logOut();
                    deferred.reject(error);
                });
            }
        }

        return deferred.promise;
    };//_refreshToken

    //var _obtainAccessToken = function (externalData) {

    //    var deferred = $q.defer();

    //    $http.get(serviceBase + 'api/account/ObtainLocalAccessToken', { params: { provider: externalData.provider, externalAccessToken: externalData.externalAccessToken } }).success(function (response) {

    //        localStorageService.set('authorizationData', { token: response.access_token, userName: response.userName, refreshToken: "", useRefreshTokens: false });

    //        _authentication.isAuth = true;
    //        _authentication.userName = response.userName;
    //        _authentication.useRefreshTokens = false;

    //        deferred.resolve(response);

    //    }).error(function (err, status) {
    //        _logOut();
    //        deferred.reject(err);
    //    });

    //    return deferred.promise;

    //};

    //var _registerExternal = function (registerExternalData) {

    //    var deferred = $q.defer();

    //    $http.post(serviceBase + 'api/account/registerexternal', registerExternalData).success(function (response) {

    //        localStorageService.set('authorizationData', { token: response.access_token, userName: response.userName, refreshToken: "", useRefreshTokens: false });

    //        _authentication.isAuth = true;
    //        _authentication.userName = response.userName;
    //        _authentication.useRefreshTokens = false;

    //        deferred.resolve(response);

    //    }).error(function (err, status) {
    //        _logOut();
    //        deferred.reject(err);
    //    });

    //    return deferred.promise;

    //};

    //authServiceFactory.saveRegistration = _saveRegistration;
    authServiceFactory.login = _login;
    authServiceFactory.logOut = _logOut;
    authServiceFactory.fillAuthData = _fillAuthData;
    authServiceFactory.authentication = _authentication;
    authServiceFactory.refreshToken = _refreshToken;

    //authServiceFactory.obtainAccessToken = _obtainAccessToken;
    //authServiceFactory.externalAuthData = _externalAuthData;
    //authServiceFactory.registerExternal = _registerExternal;
    return authServiceFactory;
}]);