angular.module('app').directive('customJavascriptCompiler', function ($rootScope, $anchorScroll, MessageService, ngNotify, UserService) {
    return {
        restrict: "E",
        replace: true,
        templateUrl: 'app/custom/javascriptCompiler/javascriptCompiler.html',
        link: function (scope, element, attrs, ctrl,$rootScope) {


            var init = function () {
                /* alert("data");*/
            };

            init();
        },
        controller: function ($scope,$rootScope,$window) {

            $scope.defaultTheme = 'monokai';

            $scope.customTheme = ['monokai','crimson_editor','kr_theme','tomorrow_night_blue'];


            /*$('.customEditor').draggable().resizable();*/



            $(document).ready(function(){
                $(".panel-left").resizable({
                    handleSelector: ".splitter",
                    resizeHeight: false
                });

                $(".panel-top").resizable({
                    handleSelector: ".splitter-horizontal",
                    resizeWidth: false
                });

                function update(){
                    var res = document.getElementById('javascriptResultEditor').contentWindow.document;
                    res.open();
                    /*res.write(eh.getValue());
                    res.write('<style>'+ec.getValue() + '<style>');
                    res.write('<script>'+ej.getValue() + '<script>');*/
                    res.write(eh.getValue()+"<style>"+ec.getValue()+"</style>"+"<script>" + ej.getValue() + "</script>");

                    res.close();

                }

                function seteditor(){

                    window.eh = ace.edit("htmleditor");
                    eh.setTheme("ace/theme/" + $scope.defaultTheme);
                    eh.session.setMode("ace/mode/html");
                   /* eh.getSession().setUseWrapMode(true);*/

                    //Now on change we update iframe to show result

                    window.ec = ace.edit("csseditor");
                    ec.setTheme("ace/theme/" + $scope.defaultTheme);
                    ec.session.setMode("ace/mode/css");
                   /* ec.getSession().setUseWrapMode(true);*/

                    window.ej = ace.edit("jseditor");
                    /*    editor.session.setMode(new ej());*/
                    ej.setTheme("ace/theme/" + $scope.defaultTheme);
                    ej.session.setMode("ace/mode/javascript");
                   /* ej.getSession().setUseWrapMode(true);*/


                    eh.getSession().on('change',function(){
                        update();
                    });

                    ec.getSession().on('change',function(){
                        update();
                    });

                    ej.getSession().on('change',function(){
                        update();
                    });


                }
                seteditor();
                update();


                $scope.selectTheme = function(selectedTheme){
                    $scope.defaultTheme = selectedTheme;
                    seteditor();
                }



            });

        }
    };
});