angular.module('blogList').factory('blogListService', ['$http', '$q', function ($http, $q) {
    var service = {
        getBlogData: getBlogData,
        getAllBlogData: getAllBlogData,
        getLangBlogAllData: getLangBlogAllData,
        fetchBlogData: fetchBlogData
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

    function fetchBlogData(key) {
        var deferred = $q.defer();
        $http.get('/postData', {params: {id: key}}).then(function (response) {
            deferred.resolve(response || {});
        });
        return deferred.promise;
    }

    function getLangBlogAllData(idValue) {
        var deferred = $q.defer();
        $http.get('/getLangBlogAllData',{params: {id: idValue}}).then(function (response) {
            deferred.resolve(response || {});
        });
        return deferred.promise;
    }



    function getAllBlogData() {
        var deferred = $q.defer();
        $http.get('/all/blog').then(function (response) {
            deferred.resolve(response || {});
        });
        return deferred.promise;
    }

}]);
