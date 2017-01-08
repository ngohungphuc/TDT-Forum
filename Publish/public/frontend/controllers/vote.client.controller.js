/**
 * Created by ngohungphuc on 29/12/2016.
 */
(function () {
    'use strict';
    angular
        .module('ChatBotApp')
        .controller('LikeController', LikeController)
        .controller('DislikeController', DislikeController);

    LikeController.$inject = ['$scope', 'localStorageService', 'LikeService'];
    DislikeController.$inject = ['$scope', 'localStorageService', 'DislikeService'];
    function LikeController($scope, localStorageService, LikeService) {
        $scope.LikeAnswer = function (answerId) {
            $scope.LikeData = {
                UserLike: localStorageService.cookie.get('currentUser'),
                AnswerId: answerId
            };
            if (localStorageService.cookie.get('currentUser') === null) {
                toastr.warning("Vui lòng đăng nhập để like bài viết");
                return false;
            }
            LikeService.LikeAnswer($scope.LikeData).then(function (result) {
                console.log(result);
                if (result.data.checkLikeAndDislike) {
                    $("#like-" + answerId).text(result.data.totalLike);
                    $("#dislike-" + answerId).text(result.data.totalDislike);
                }
                else {
                    toastr.warning(result.data.msg);
                    $("#like-" + answerId).text(result.data.totalLike);
                }
            });
        };
    }

    function DislikeController($scope, localStorageService, DislikeService) {
        $scope.DislikeAnswer = function (answerId) {
            $scope.DislikeData = {
                UserDislike: localStorageService.cookie.get('currentUser'),
                AnswerId: answerId
            };
            if (localStorageService.cookie.get('currentUser') === null) {
                toastr.warning("Vui lòng đăng nhập để dislike bài viết");
                return false;
            }
            DislikeService.DislikeAnswer($scope.DislikeData).then(function (result) {
                console.log(result);
                if (result.data.checkLikeAndDislike) {
                    $("#like-" + answerId).text(result.data.totalLike);
                    $("#dislike-" + answerId).text(result.data.totalDislike);
                }
                else {
                    toastr.warning(result.data.msg);
                    $("#dislike-" + answerId).text(result.data.totalDislike);
                }
            });
        };
    }
})();