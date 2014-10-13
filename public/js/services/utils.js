
var listApp = angular.module('listApp');

listApp.service('utils', function () {
    
    var def =
    {
        // return a random number between 0 and 100
        randomInt: function () {
            return parseInt(Math.random() * 100);
        }
    };

    return def;
});