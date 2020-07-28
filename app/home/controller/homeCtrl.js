angular.module('home').controller('homeCtrl',['$scope','$rootScope','$state','$http','toastr','$window',function($scope,$rootScope,$state,$http,toastr,$window){


    $scope.gmail = {
        username:'',
        email:''
    };

    $scope.facebook = {
        username:'',
        email:''
    };


    $scope.contactMessage = {
             name:'',
             subject:'',
             query:''
    };





    $scope.askExpert = function(){
        $state.go("expert");
    }

    /*-------------------------------------user registration--------------------------------------*/
    $scope.userRegistration = function(){
            console.log("demoooo"+$scope.user.firstName)
            if ($scope.user.fullName != "" && $scope.user.email!= undefined && $scope.user.password != ""){
                $http.post('/register',$scope.user)
                    .then(function(response) {
                        console.log(response);
                        $rootScope.userID = response.data.data.insertedIds[0];
                        if(response="undefined" &&response!=null){
                            $window.localStorage.setItem('userLocalStorage', JSON.stringify($scope.user));
                            $rootScope.fullName = $scope.user.fullName;
                            $rootScope.userChannelName = $scope.user.email;
                            toastr.success('Successfully Registered.');
                            $('#modal-signin').hide();
                            $('body').removeClass('modal-open');
                            $('.modal-backdrop').remove();
                           /* $uibModalInstance.dismiss('cancel')*/
                           /* $uibModalStack.dismissAll();*/
                            $state.go('expert');

                            console.log("success!!"+response);
                        }
                    }, function(error) {
                        console.log("error!!");
                        console.log("success!!"+$scope.user.EmailAddress);
                        if($scope.user==$scope.user){
                            toastr.error('Email Already Registered.');
                        }
                    });
            }

    }


    /*-------------------------------------user login----------------------------------------------*/
    $scope.userLogin = function(){
        console.log($scope.user)
        $http.post('/login',$scope.user)
            .then(function(response) {
                $window.localStorage.setItem('userLocalStorage', JSON.stringify(response.data.userData));
                $rootScope.userID = response.data.userData.id;
                $rootScope.fullName = response.data.userData.fullName;
                $rootScope.userChannelName = response.data.userData.email;
                console.log("success!!"+response);
                console.log("success!!"+response);

                if(response.data.userData.fullName === "admin" && response.data.userData.email === "admin2608@gmail.com"){
                    $rootScope.userType = "admin";
                    localStorage.setItem("userType", "admin");
                }else{
                    $rootScope.userType = "user";
                    localStorage.setItem("userType", "user");
                }

               /* toastr.success('Successfully logged in.');*/
                $('#modal-signin').hide();
                $('body').removeClass('modal-open');
                $('.modal-backdrop').remove();
               /* $uibModalInstance.dismiss('cancel')*/
                $state.go('expert');
                //  console.log( User.getEmailAddress());
                //User.build(data.userData);
               // User.saveLocalStorage();
            }, function(error) {
                console.log("success!!"+$scope.user.EmailAddress);
                if($scope.user.EmailAddress!=$scope.user){
                    toastr.error('Email or Password is incorrect.');
                }

                // toastr.error('Your credentials are gone', 'Error');
            });
    }


    $scope.onGoogleLogin = function () {
        $scope.user = {};
         var params = {
             'clientid': '480866184703-7ul04s99pb33k3t3fgsvv5t475mav4s0.apps.googleusercontent.com',
             'cookiepolicy': 'single_host_origin',
             'callback': function(result){
                  if(result['status']['signed_in']){
                      gapi.client.load('plus','v1', function(){
                      var request = gapi.client.plus.people.get(
                          {
                              'userId':'me'
                          }
                      );
                      request.execute(function(resp){
                          $scope.$apply(function(){
                              $scope.gmail.username = resp.displayName;
                              $scope.gmail.email = resp.emails[0].value;
                             /* console.log($scope.gmail);*/
                              if($scope.gmail.email){
                                  $scope.user.fullName = $scope.gmail.username;
                                  $scope.user.email = $scope.gmail.email;
                                  $window.localStorage.setItem('userLocalStorage', JSON.stringify($scope.user));
                                  $(".modal-backdrop.fade.show").addClass("disableFacebookModal");
                                  $(".modal-backdrop.fade.show").removeClass("show");
                                  $('#modal-signin').hide();
                                  $('body').removeClass('modal-open');
                                  $('.modal-backdrop').remove();
                                  $state.go('expert');
                              }

                          });
                      })
                      })
                  }

             },
             'approvalprompt':'force',
             'scope': 'https://www.googleapis.com/auth/plus.login https://www.googleapis.com/auth/plus.profile.emails.read'
         };

         gapi.auth.signIn(params);
    }


     $scope.onFacebookLogin = function(){
         $scope.user = {};
          FB.login(function(response){
              if(response.authResponse){
                FB.api('/me','GET',{fields:'email,first_name,name, id,picture'},function(response){
                    $scope.$apply(function(){
                        $scope.facebook.username = response.name;
                        $scope.facebook.email = response.email;
                        $scope.facebook.picture = response.picture.data.url;
                        if($scope.facebook.email){
                            $scope.user.email = $scope.facebook.email;
                            $scope.user.fullName = $scope.facebook.username;
                            $window.localStorage.setItem('userLocalStorage', JSON.stringify($scope.user));
                            $(".modal-backdrop.fade.show").addClass("disableFacebookModal");
                            $(".modal-backdrop.fade.show").removeClass("show");
                            $('#modal-signin').hide();
                            $('body').removeClass('modal-open');
                            $('.modal-backdrop').remove();
                            $state.go('expert');
                        }
                    });
                })
              }else{
                  //error
              }
          },{
              scope:'email,user_likes',
              return_scopes: true
          })
     }


     $scope.userQuery = function(){
         $http.post('/userQuery', $scope.contactMessage).success(function(response) {
             toastr.success('Your query submitted successfully.');
             $('#modal-contact').modal('hide');
         })
     }














































}]);

