'use strict';
angular.module('myProfile').controller('profileCtrl', ['$scope', '$rootScope', '$state', '$http', 'toastr', 'profileService','$window', function($scope, $rootScope, $state, $http, toastr, profileService,$window) {


    var changeChannel = $rootScope.channelName;
    $scope.myUpload = "";
    $scope.uploadItem = [];
    $scope.isShowSliderTable = 0;
    $scope.userFirstTimeProfile = true;
    $scope.education = {
        education:"",
        course:"",
        specialization:"",
        institute:"",
        marks:"",
        type:""
    };
    $scope.user = {
        education:[]
    };
    $scope.editProfileFlag = false;
    $scope.status = false;
    $scope.userRole = {};
    $scope.freelancerObj = {};
    $scope.employerObj = {};
    $scope.teacherObj = {};
    $scope.studentObj = {};
    $scope.filesNames = [];
    $scope.editEducationFlag = false;
    $scope.showEditEducationBtn = false;

    $scope.userLocalStorage = JSON.parse($window.localStorage.getItem('userLocalStorage'));


    /*----------------------------------------fetch the user data-------------------------------------------------------------*/
    $scope.fetchUserData = function () {
        /* $scope.userProfileEmailId =  $window.localStorage.getItem('userProfileEmailId')*/
        if($scope.userLocalStorage.email){
            profileService.getUserData($scope.userLocalStorage.email).then(function (response) {
                if (response.data!=null) {
                    $scope.userID = response.data._id;
                    $scope.userFirstTimeProfile = false;
                    $scope.user = {
                        fullName: response.data.fullName,
                        email: response.data.email,
                        company: response.data.company,
                        experience: response.data.experience,
                        skills: response.data.skills,
                        position: response.data.position,
                        country: response.data.country,
                        state: response.data.state,
                        city: response.data.city,
                        userPicName: response.data.userPicName,
                        skillsQuotes: response.data.skillsQuotes,
                        userRole: response.data.userRole,
                        education: response.data.education,
                        customImage:response.data.customImage,
                        _id:response.data._id
                    };
                }
                /*  $scope.userRole = $scope.user;*/

                if($scope.user.userRole){
                    $scope.userRole = $scope.user.userRole;
                    angular.forEach($scope.user.userRole, function(userObj,userKey){
                        if(userKey == 'freelancer'){
                            if(userObj.checked == true){
                                $scope.freelancerObj = $scope.user.userRole.freelancer;
                                $('#freelancerCheckboxId').prop('checked', true);
                                $("#freelancerPanelId").show();
                            }
                        }
                        if(userKey == 'employer'){
                            if(userObj.checked == true){
                                $scope.employerObj = $scope.user.userRole.employer;
                                $('#employerCheckboxId').prop('checked', true);
                                $("#employerPanelId").show();
                            }
                        }
                        if(userKey == 'teacher'){
                            if(userObj.checked == true){
                                $scope.teacherObj = $scope.user.userRole.teacher;
                                $('#teacherCheckboxId').prop('checked', true);
                                $("#teacherPanelId").show();
                            }
                        }
                        if(userKey == 'student'){
                            if(userObj.checked == true){
                                $scope.studentObj = $scope.user.userRole.student;
                                $('#studentCheckboxId').prop('checked', true);
                                $("#studentPanelId  ").show();
                            }
                        }

                    });
                }else{
                    $scope.user.userRole = {};
                }

                $scope.allSkillsData();

                /* console.log($scope.input_data);
                 $rootScope.updateSkills($scope.input_data);*/
            })
        }else{
            $scope.userFirstTimeProfile = true;
        }
    };


    $scope.fetchUserData();

    /************************************Add Education**********************************************/

    $scope.addEducation = function(education){
        $scope.editEducationFlag = false;
        $scope.user.education.push(education);
        $scope.saveProfile();
        $('.modal').removeClass('show');
    };

    $scope.openEducation = function() {

        if($scope.editEducationFlag == true){
            $scope.editEducationFlag = false;
            $scope.showEditEducationBtn = true;
        }else{
            $scope.showEditEducationBtn = false;
            $scope.education = {};
        }

    }

    $scope.editEducation = function(education,index) {
        $scope.editEducationFlag = true;

        setTimeout(function () {
            $scope.education = education;
            $scope.editObjectIndex = index;
            $("#addEducation").trigger("click");
        }, 100);
    }

    $scope.editEducationSave = function(education){
        angular.forEach($scope.user.education, function(eduObj, key) {
            if($scope.editObjectIndex == key){
                $scope.user.education.splice(key,1,education);
                /* $scope.user.education[key] = education;*/
            }
        });
        $scope.saveProfile();
        $('.modal').removeClass('show');
    };

    $scope.deleteEducation = function(education){
        angular.forEach($scope.user.education, function(eduObj, key) {
            if(eduObj.education == education.education){
                $scope.user.education.splice(key,1);
            }
        });
        $scope.saveProfile();
    };


    /*-------------------------------Saving user profile data--------------------------------------------------*/
    $scope.saveProfile = function(callback) {
        $scope.status = $scope.checkValidate();
        $scope.userID = $rootScope.userID;
        $scope.user.skills = $rootScope.outputModel;
        var status = $scope.customProfileValidation($scope.user);
        if(status){
            /* $scope.user.userRole = $scope.userRole;*/
            /* $scope.saveUserHireProfile($scope.user.userRole);*/

            if($scope.user.userRole.freelancer && $scope.user.userRole.freelancer.checked){
                $scope.freelancerProfile($scope.user.userRole.freelancer);
            }
            if($scope.user.userRole.student && $scope.user.userRole.student.checked){
                $scope.studentProfile($scope.user.userRole.student);
            }
            if($scope.user.userRole.teacher && $scope.user.userRole.teacher.checked){
                $scope.teacherProfile($scope.user.userRole.teacher);
            }
            if($scope.user.userRole.employer && $scope.user.userRole.employer.checked){
                $scope.employerProfile($scope.user.userRole.employer);
            }




            if(!$scope.user.presenceStatus){
                $scope.user.presenceStatus = false;
            }
            if($scope.status){
                if($scope.userFirstTimeProfile) {
                    $scope.user.customImage = {};
                    $http.post('/profile', $scope.user).success(function(response) {
                        toastr.success('User profile created successfully.');
                        $scope.userProfileEmailId = $scope.user.email;
                        $scope.userFirstTimeProfile = false;
                        if(callback){
                            callback();
                        }
                    })
                }else{
                    $http.put('/profile/' + $scope.userLocalStorage.email, $scope.user).success(function(response) {
                        console.log(response);
                        toastr.success('User profile updated successfully.');
                        if(callback){
                            callback();
                        }

                    })
                }
            }
        }else{
            toastr.error("Please fill required fields");
        }
    };


    $scope.saveUserHireProfile = function(userRole){
        angular.forEach(userRole, function(userObj,userKey) {
            if(userObj.checked == true){
                userObj.role = userKey;
                userObj.email = $scope.user.email;
                $http.post('/hireUser', userObj).success(function(response) {
                    console.log(response);
                    toastr.success('User profile created successfully.');

                })
            }
        });
    };

    /******************************************hire Profile functionality**************************************/


    $scope.freelancerProfile = function(role){
        if(!role.email){
            role.email = $scope.user.email;
            role.role = "freelancer";
            role.fullName = $scope.user.fullName;
            role.experience = $scope.user.experience;
            role.skills = $scope.user.skills;
            role.position = $scope.user.position;
            role.country = $scope.user.country;
            role.state = $scope.user.state;
            role.city = $scope.user.city;
            $http.post('/freelancer', role).success(function(response) {
                /* toastr.success('Freelancer profile created successfully.');*/
            })
        }else{
            role.role = "freelancer";
            role.position = $scope.user.position;
            role.country = $scope.user.country;
            role.state = $scope.user.state;
            role.city = $scope.user.city;
            $http.put('/freelancer/' + $scope.userLocalStorage.email, role).success(function(response) {
                console.log(response);
                /*toastr.success('Freelancer profile updated successfully.');*/
            })
        }
    };

    $scope.studentProfile = function(role){
        if(!role.email){
            role.email = $scope.user.email;
            role.role = "student";
            role.fullName = $scope.user.fullName;
            role.experience = $scope.user.experience;
            role.skills = $scope.user.skills;
            role.position = $scope.user.position;
            role.country = $scope.user.country;
            role.state = $scope.user.state;
            role.city = $scope.user.city;
            $http.post('/student', role).success(function(response) {
                /* toastr.success('Student profile created successfully.');*/
            })
        }else{
            role.role = "student";
            role.position = $scope.user.position;
            role.country = $scope.user.country;
            role.state = $scope.user.state;
            role.city = $scope.user.city;
            $http.put('/student/' + $scope.userLocalStorage.email, role).success(function(response) {
                console.log(response);
                /*toastr.success('Student profile updated successfully.');*/
            })
        }
    };
    $scope.teacherProfile = function(role){
        if(!role.email){
            role.email = $scope.user.email;
            role.role = "teacher";
            role.fullName = $scope.user.fullName;
            role.experience = $scope.user.experience;
            role.skills = $scope.user.skills;
            role.position = $scope.user.position;
            role.country = $scope.user.country;
            role.state = $scope.user.state;
            role.city = $scope.user.city;
            $http.post('/teacher', role).success(function(response) {
                /* toastr.success('Teacher profile created successfully.');*/
            })
        }else{
            role.role = "teacher";
            role.position = $scope.user.position;
            role.country = $scope.user.country;
            role.state = $scope.user.state;
            role.city = $scope.user.city;
            $http.put('/teacher/' + $scope.userLocalStorage.email, role).success(function(response) {
                console.log(response);
                /* toastr.success('Teacher profile updated successfully.');*/
            })
        }
    };
    $scope.employerProfile = function(role){
        if(!role.email){
            role.email = $scope.user.email;
            role.role = "employer";
            role.fullName = $scope.user.fullName;
            role.experience = $scope.user.experience;
            role.skills = $scope.user.skills;
            role.position = $scope.user.position;
            role.country = $scope.user.country;
            role.state = $scope.user.state;
            role.city = $scope.user.city;
            $http.post('/employer', role).success(function(response) {
                /* toastr.success('Employer profile created successfully.');*/
            })
        }else{
            role.role = "employer";
            role.position = $scope.user.position;
            role.country = $scope.user.country;
            role.state = $scope.user.state;
            role.city = $scope.user.city;
            $http.put('/employer/' + $scope.userLocalStorage.email, role).success(function(response) {
                console.log(response);
                /*toastr.success('Employer profile updated successfully.');*/
            })
        }
    };



    /******************************************hire Profile functionality End**************************************/






    /*----------------------------------------------Check for the empty object-------------------------------------------------*/
    $scope.isEmpty = function(obj) {
        for(var prop in obj) {
            if(obj.hasOwnProperty(prop))
                return false;
        }
        return true;
    };

    /*----------------------------------------------upload image in the user Profile-------------------------------------------*/
    /*   $scope.$watch('myUpload', function(newVal) {
           if (newVal) {
               console.log(newVal);
               var fileNameExist = false;
               angular.forEach($scope.filesNames, function(userName,userKey) {
                  if(userName == newVal.name){
                      fileNameExist = true
                  }
               });
           if(!fileNameExist){
               $scope.user.userPicName = newVal.name;
               var uploadFile = newVal;
               var uploadUrl = "/uploads";
               var fd = new FormData();
               fd.append('file', uploadFile);
               console.log(fd);
             /!*  $http.post(uploadUrl, fd, {
                   transformRequest: angular.identity,
                   headers: {
                       'Content-Type': undefined
                   }*!/

               $http.put('/imageUpload/' + $scope.userLocalStorage.email, fd).success(function(response) {
                       console.log(response);
                       toastr.success('User profile updated successfully.');
               }).success(function(data) {
                   console.log("success!!" + data);
                   $scope.isShowSliderTable = 1;
                   $scope.uploadItem.push(data.file)
                   $scope.myUploadFile = null;
                   $scope.saveProfile(pageRefresh);
               })
                   .error(function() {
                       console.log("error!!");
                   });
             }else{
               toastr.error("Please change name of your Image as same name Image exists");
               return false;
             }
           }
       });*/

    $scope.$watch('myUpload', function(newVal) {
        $scope.user.userPicName = newVal.name;
        var uploadFile = newVal;
        var uploadUrl = "/uploads";
        var file = {
            file: uploadFile
        }
        var fd = new FormData();
        fd.append('file', uploadFile);
        fd.append('userDetail', JSON.stringify($scope.user));
        $http.put('/imageUpload/' + $scope.userLocalStorage.email, fd,
               {
                headers: {
                    'Content-Type': undefined
                }
            }).success(function(response) {
            console.log(response);
        }).success(function(data) {

        })
            .error(function() {
                console.log("error!!");
            })
    })




    $scope.editProfile = function(editProfileFlag){
        $scope.editProfileFlag = editProfileFlag;
    };

    function pageRefresh(){
        setTimeout(function(){    $window.location.reload(); }, 1000);
    }

    /*--------------------------Profile Form Validation---------------------------------------------------------------*/


    $scope.checkValidate = function(){
        if($scope.user.fullName == "" || $scope.user.email == ""){
            toastr.error('User name and email are required.');
            return false;
        }else{
            return true;
        }
    };


    $scope.allSkillsData = function(){
        $http.get('json/allSkills.json').then(function(response) {
            $scope.input_data = response.data;
            angular.forEach($scope.user.skills, function(userSkill){
                angular.forEach($scope.input_data, function(actualSkill){
                    if(userSkill.text == actualSkill.text){
                        actualSkill.checked = true;
                    }
                });
            });
        });
    };



    /* profile accordian*/
    $('.panel-collapse').on('show.bs.collapse', function () {
        $(this).siblings('.panel-heading').addClass('active');
    });

    $('.panel-collapse').on('hide.bs.collapse', function () {
        $(this).siblings('.panel-heading').removeClass('active');
    });


    $scope.$watch('userRoleInput_data', function(userdata) {
        angular.forEach(userdata, function(value, key) {
            console.log(value);
        });
    });


    $scope.freelancerClicked = function(userRole,presence){
        if($('#freelancerCheckboxId').is(":checked")){
            $scope.freelancerObj.checked = true;
            $scope.user.userRole.freelancer = $scope.freelancerObj;
            $("#freelancerPanelId").show();
        }else{
            $scope.freelancerObj.checked = false;
            /* $scope.userRole.splice($scope.userRole.indexOf(userRole), 1);*/
            $("#freelancerPanelId").hide();
        }

    };

    $scope.EmployerClicked = function(userRole,presence){
        if($('#employerCheckboxId').is(":checked")){
            $scope.employerObj.checked = true;
            $scope.user.userRole.employer = $scope.employerObj;
            $("#employerPanelId").show();
        }else{
            $scope.employerObj.checked = false;
            /*$scope.userRole.splice($scope.userRole.indexOf(userRole), 1);*/
            $("#employerPanelId").hide();
        }

    };

    $scope.TeacherClicked = function(userRole,presence){
        if($('#teacherCheckboxId').is(":checked")){
            $scope.teacherObj.checked = true;
            $scope.user.userRole.teacher = $scope.teacherObj;
            $("#teacherPanelId").show();
        }else{
            $scope.teacherObj.checked = false;
            /* $scope.userRole.splice($scope.userRole.indexOf(userRole), 1);*/
            $("#teacherPanelId").hide();
        }

    };

    $scope.StudentClicked = function(userRole,presence){
        if($('#studentCheckboxId').is(":checked")){
            $scope.studentObj.checked = true;
            $scope.user.userRole.student = $scope.studentObj;
            $("#studentPanelId").show();
        }else{
            $scope.studentObj.checked = false;
            /*  $scope.userRole.splice($scope.userRole.indexOf(userRole), 1);*/
            $("#studentPanelId").hide();
        }

    };

    $scope.customProfileValidation = function(user){
        if(!user.email || !user.fullName || !user.position || !user.country || !user.state){
            return false;
        }else{
            return true;
        }
    };

    $scope.hexToBase64 = function(str) {
        return str;
    }




    $scope.output_data = [];
}]);