// angular.module('app').directive ('zoom', function(){
//     return {
//         restrict: 'A',
//         link: function(scope, element, attrs) {
//             setTimeout(function(){
//                 console.log('checkSystemRequirements');
//                 console.log(ZoomMtg);
//                 console.log(JSON.stringify(ZoomMtg.checkSystemRequirements()));
//                 alert("meeting");
//                 ZoomMtg.preLoadWasm();
//                 ZoomMtg.prepareJssdk();

//                 var API_KEY = 'gGpVMSI1QMOMJPKaxnogzA';
//                 var API_SECRET = 'jverL4pFkg02QlWj61WU19Eq0TepqIvzil7s';

//                 var meetConfig = {
//                     apiKey: API_KEY,
//                     apiSecret: API_SECRET,
//                     meetingNumber: 3692585236,
//                     userName: 'aless',
//                     passWord: '',
//                     leaveUrl: 'https://zoom.us',
//                     role: 0
//                 };
//                 ZoomMtg.generateSignature({
//                     meetingNumber: meetConfig.meetingNumber,
//                     apiKey: meetConfig.apiKey,
//                     apiSecret: meetConfig.apiSecret,
//                     role: meetConfig.role,
//                     success(res) {
//                         console.log('signature', res.result);
//                         ZoomMtg.init({
//                             leaveUrl: 'http://www.zoom.us',
//                             success() {
//                                 ZoomMtg.join(
//                                     {
//                                         meetingNumber: meetConfig.meetingNumber,
//                                         userName: meetConfig.userName,
//                                         signature: res.result,
//                                         apiKey: meetConfig.apiKey,
//                                         userEmail: 'navjot2608@gmail.com',
//                                         passWord: meetConfig.passWord,
//                                         success() {
//                                             console.log('join meeting success');
//                                         },
//                                         error(res) {
//                                             console.log(res);
//                                         }
//                                     }
//                                 );
//                             },
//                             error(res) {
//                                 console.log(res);
//                             }
//                         });
//                     }
//                 });
//             },5000);

//         }
//     }})
