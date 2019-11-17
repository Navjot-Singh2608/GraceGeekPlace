angular.module('app').directive('javascriptCompiler', function ($rootScope, $anchorScroll, MessageService, ngNotify, UserService) {
    return {
        restrict: "E",
        replace: true,
        templateUrl: 'app/custom/compiler/javascript/compiler.html',
        link: function (scope, element, attrs, ctrl,$rootScope) {


            var init = function () {
               /* alert("data");*/
            };

            init();
        },
        controller: function ($scope,$rootScope,$window) {
       $scope.selectedCompilerMode = "Javascript";

       $scope.compilerModeList = ['java','.Net','C / C++'];

            var windowHeight = $(window).height();
             var customCompilerHeight =  windowHeight - 80;







           /* $scope.compilerMinimizeFlag = false;*/
           /* $('.customEditor').draggable().resizable();*/
            $rootScope.$on('datacompiler', function(ev,data) {
               /* alert("data");
                document.getElementById("customCompiler").height = customCompilerHeight + "px";*/
                document.getElementById("customCompiler").style.height = customCompilerHeight +"px";
               /* $('#customModel').modal('show');
                $("#customModel").draggable({
                    handle: ".cust-modal-header"
                });


                $('.cust-modal-content').resizable({
                    //alsoResize: ".modal-dialog",
                    minHeight: 300,
                    minWidth: 300
                });
                $('.cust-modal-dialog').draggable();

                $('#myModal').on('show.bs.modal', function() {
                    $(this).find('.modal-body').css({
                        'max-height': '100%'
                    });
                });*/


            });

            $(document).ready(function(){

                var $content, $modal, $apnData, $modalCon;
                $content = $(".min");
                //To fire modal
                $(".mdlFire").click(function(e){
                    e.preventDefault();
                    var $id = $(this).attr("custom-data-target");
                    $($id).modal({backdrop: false, keyboard: false});
                });


                $(".modalMinimize").on("click", function(){
                    /*$scope.compilerMinimizeFlag = true;*/
                    $modalCon = $(this).closest(".mymodal").attr("id");
                    $apnData = $(this).closest(".mymodal");
                    $modal = "#" + $modalCon;
                    $(".modal-backdrop").addClass("display-none");
                    $($modal).toggleClass("min");
                    if ( $($modal).hasClass("min") ){
                        $(".minmaxCon").append($apnData);
                        $(this).find("i").toggleClass( 'fa-minus').toggleClass( 'fa-clone');
                        $("#compilerDropDown").hide();
                    }
                    else {
                        $(".cust-container").append($apnData);
                        $(this).find("i").toggleClass( 'fa-clone').toggleClass( 'fa-minus');
                        $("#compilerDropDown").show();


                    };


                        /*$('#cust-modal-content').css({
                             'left': '0%!important',
                             'width': '0%'
                        });*/


                });

                $("button[data-dismiss='cust-modal']").click(function(){
                    $(this).closest(".mymodal").removeClass("min");
                    $(".cust-container").removeClass($apnData);
                    $(this).next('.modalMinimize').find("i").removeClass('fa fa-clone').addClass( 'fa fa-minus');
                });


               /*------------------ Method used to drag Custom Model all over the screen----------------------*/

             /*   dragElement(document.getElementById("customModel"));

                function dragElement(elmnt) {
                    var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
                    if (document.getElementById(elmnt.id + "header")) {
                        /!* if present, the header is where you move the DIV from:*!/
                        document.getElementById(elmnt.id + "header").onmousedown = dragMouseDown;
                    } else {
                        /!* otherwise, move the DIV from anywhere inside the DIV:*!/
                        elmnt.onmousedown = dragMouseDown;
                    }

                    function dragMouseDown(e) {
                        e = e || window.event;
                        e.preventDefault();
                        // get the mouse cursor position at startup:
                        pos3 = e.clientX;
                        pos4 = e.clientY;
                        document.onmouseup = closeDragElement;
                        // call a function whenever the cursor moves:
                        document.onmousemove = elementDrag;
                    }

                    function elementDrag(e) {
                        e = e || window.event;
                        e.preventDefault();
                        // calculate the new cursor position:
                        pos1 = pos3 - e.clientX;
                        pos2 = pos4 - e.clientY;
                        pos3 = e.clientX;
                        pos4 = e.clientY;
                        // set the element's new position:
                        elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
                        elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
                    }

                    function closeDragElement() {
                        /!* stop moving when mouse button is released:*!/
                        document.onmouseup = null;
                        document.onmousemove = null;
                    }
                }
*/



      /**************************************send Compiler Notification and Code**************************************************/


                  $scope.sendCompilerCode = function(){
                      $scope.user = {};
                      $scope.userLocalStorage = JSON.parse($window.localStorage.getItem('userLocalStorage'));
                      $scope.secondPersonGroupSelected = JSON.parse($window.localStorage.getItem('secondPersonGroupSelected'));

                      $scope.user.CompilerNotification = true;
                      $scope.user.compilerMessage = $scope.userLocalStorage.fullName + " send you compiler Code";
                      $scope.user.compilerCodeSenderuserPicName = $('#navProfilePic').attr('src');
                      $scope.user.compilerSourceCodeObj = {};
                      $scope.user.comppilerCodeReceiverChannelName = $scope.secondPersonGroupSelected.email;
                      getSourceCode();
                      MessageService.sendMessage($scope.user);
                  };


                  function getSourceCode(){
                     if($scope.selectedCompilerMode == "Javascript"){
                         var html = ace.edit("htmleditor");
                         var css = ace.edit("csseditor");
                         var js = ace.edit("jseditor");
                         $scope.user.compilerSourceCodeObj.html = html.getSession().getValue();
                         $scope.user.compilerSourceCodeObj.js = js.getSession().getValue();
                         $scope.user.compilerSourceCodeObj.css = css.getSession().getValue();
                     }
                  }

                    $scope.compilerChange = function(compilerSelected){
                        $scope.selectedCompilerMode = compilerSelected;
                    };



                  $rootScope.compilerNotificationCode = function(messageContent){
                      console.log(messageContent);
                      $rootScope.showCompilerNotification(messageContent);
                  };

            });
        }
    };
});