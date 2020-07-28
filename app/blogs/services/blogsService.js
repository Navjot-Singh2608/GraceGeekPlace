angular.module('myBlog').factory('blogService', ['$http', '$q', function ($http, $q) {
    var service = {
        getBlogData: getBlogData,
        getBlogDetailDescriptionCloudUrl: getBlogDetailDescriptionCloudUrl
        /*getAllUsersProfileDetails: getAllUsersProfileDetails*/
    };
    return service;


    function getBlogData(id) {
        var deferred = $q.defer();
        $http.get('/myBlog', {params: {id: id}}).then(function (response) {
            deferred.resolve(response || {});
        });
        return deferred.promise;
    }

    function getBlogDetailDescriptionCloudUrl(id) {
        var deferred = $q.defer();
        $http.get('/myBlog/blogdetailcloudurl', {params: {id: id}}).then(function (response) {
            deferred.resolve(response || {});
        });
        return deferred.promise;
    }

  /*  function getAllUsersProfileDetails() {
        var deferred = $q.defer();
        $http.get('/all/myBlog').then(function (response) {
            deferred.resolve(response || {});
        });
        return deferred.promise;
    }*/

}]);
