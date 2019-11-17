angular.module('hireUser').factory('hireUserService', ['$http', '$q', function ($http, $q) {
    var service = {
        getBlogData: getBlogData,
        getAllFreelancerDetails: getAllFreelancerDetails,
        getAllStudentDetails: getAllStudentDetails,
        getAllTeacherDetails: getAllTeacherDetails,
        getAllEmployerDetails: getAllEmployerDetails
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

    function getAllFreelancerDetails() {
        var deferred = $q.defer();
        $http.get('/all/freelancer').then(function (response) {
            deferred.resolve(response || {});
        });
        return deferred.promise;
    }

    function getAllStudentDetails() {
        var deferred = $q.defer();
        $http.get('/all/student').then(function (response) {
            deferred.resolve(response || {});
        });
        return deferred.promise;
    }

    function getAllTeacherDetails() {
        var deferred = $q.defer();
        $http.get('/all/teacher').then(function (response) {
            deferred.resolve(response || {});
        });
        return deferred.promise;
    }

    function getAllEmployerDetails() {
        var deferred = $q.defer();
        $http.get('/all/employer').then(function (response) {
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
