/**
 @fileOverview

 @toc

 */

'use strict';

angular.module('message-center', [])
    .factory('messageCenter', ['$rootScope','$log', function ($rootScope,$log) {

        //public methods & properties
        var self = {};
        self.config = {};
        self.config.enableDebug=true;
        self.config.delay = 2000;
        self.config.removeDelay = 650;
        self.config.animation="slideOutLeft";
        self.config.alertTypes = ['danger', 'info', 'warning', 'success'];
        // create an array of alerts available globally
//        $rootSscope.$watch('$rootScope.alerts', , true);
        $rootScope.alerts = [];

        self.config = function (config) {
            angular.extend(self.config, config);
            $log.enableDebug(self.config.enableDebug);
        };

        self.add = function (type, msg) {
            if (self.alertTypes.indexOf(type) < 0) {
                type = 'info';
                msg = msg + "(Incorrect msg type, check alertSvc.alertTypes)";
            }
            if ($rootScope.$$phase) {
                $log.debug("digest in progress");
                $rootScope.alerts.push({'type': type, 'msg': msg});
            } else {
                $rootScope.$apply(function () {
                    $rootScope.alerts.push({'type': type, 'msg': msg});
                });
            }

            setTimeout(function () {
                angular.element(document.body.querySelector("div.alert")).addClass(self.config.animation+" animated");
                setTimeout(function () {
                    $rootScope.$apply(function () {
                        $rootScope.alerts.shift();
                    });
                }, self.config.removeDelay);
            }, self.config.delay + $rootScope.alerts.length * self.config.delay);


        };


        self.closeAlert = function (index) {
            $rootScope.alerts.splice(index, 1);
        };


        //private methods and properties - should ONLY expose methods and properties publicly (via the 'return' object) that are supposed to be used; everything else (helper methods that aren't supposed to be called externally) should be private.

        return self;
    }]);