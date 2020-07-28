angular.module('myProfile').factory('profileService', ['$http', '$q', function ($http, $q) {
    var service = {
        getUserData: getUserData,
        getAllUsersProfileDetails: getAllUsersProfileDetails,
        getAllFilesNames: getAllFilesNames
    };
    return service;


    function getUserData(id) {
        var deferred = $q.defer();
        $http.get('/profile', {params: {id: id}}).then(function (response) {
            deferred.resolve(response || {});
        });
        return deferred.promise;
    }


    function getAllUsersProfileDetails(userInfo) {
        var deferred = $q.defer();
        $http.get('/userProfile',{params: {selectedLang: userInfo}}).then(function (response) {
            deferred.resolve(response || {});
        });
        return deferred.promise;
    }

    function getAllFilesNames() {
        var deferred = $q.defer();
        $http.get('/profile/filenames').then(function (response) {
            deferred.resolve(response || {});
        });
        return deferred.promise;
    }

}]);
