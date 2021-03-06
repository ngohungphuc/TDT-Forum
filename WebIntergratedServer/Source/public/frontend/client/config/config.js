(function () {
    'use strict';
    angular.module('appRoute', ['ngRoute'])
        .config(config)
        .run(run);
    config.$inject = ['$locationProvider', '$routeProvider', 'localStorageServiceProvider', '$facebookProvider'];
    run.$inject = ['$rootScope', '$location', 'localStorageService'];

    function config($locationProvider, $routeProvider, localStorageServiceProvider, $facebookProvider) {
        $routeProvider
            .when('/', {
                templateUrl: '/partials/index'
            })
            .when('/main-page', {
                templateUrl: '/partials/index'
            })
            .when('/bai-viet/:id', {
                templateUrl: '/partials/details'
            })
            .when('/dien-dan', {
                templateUrl: '/partials/forum'
            })
            .when('/chuyen-muc/:id', {
                templateUrl: '/partials/forum_list'
            })
            .when('/tim-kiem/:queryString', {
                templateUrl: '/partials/search',
                controller: 'SearchController'
            })
            .when('/navbar', {
                templateUrl: '/layout/navbar'
            })
            .when('/dang-nhap', {
                templateUrl: '/partials/login'
            })
            .when('/dang-ky', {
                templateUrl: '/partials/register'
            })
            .when('/tao-cau-hoi', {
                templateUrl: '/partials/post_question'
            })
            .when('/tai-khoan', {
                templateUrl: '/partials/account_info'
            })
            .when('/phong-chat', {
                templateUrl: '/partials/chat_room'
            })
            .otherwise({
                redirectTo: '/page-not-found',
                templateUrl: '/partials/404'
            });

        $locationProvider.html5Mode({
            enabled: true,
            requireBase: false
        });
        //localStorageServiceProvider.setStorageType('sessionStorage');
        localStorageServiceProvider.setDefaultToCookie(true);
        $facebookProvider.setAppId('604809803041199');
        $facebookProvider.setPermissions("email,public_profile, user_photos");
    }

    function run($rootScope, $location, localStorageService) {
        var loginUser = localStorageService.cookie.get('currentUser');
        var facebookUser = localStorageService.cookie.get('facebookUser');
        $rootScope.$on('$routeChangeStart', function (event, next, current) {
            if ((loginUser || facebookUser) && (next.originalPath === '/dang-nhap' || next.originalPath === '/dang-ky')) {
                $location.path('/');
            }
        });
        (function (d, s, id) {
            var js, fjs = d.getElementsByTagName(s)[0];
            if (d.getElementById(id)) {
                return;
            }
            js = d.createElement(s);
            js.id = id;
            js.src = "//connect.facebook.net/en_US/sdk.js";
            fjs.parentNode.insertBefore(js, fjs);
        }(document, 'script', 'facebook-jssdk'));
    }
})();
