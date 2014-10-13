
var listApp = angular.module('listApp');

listApp.service('websockets', function () {

    var host = location.origin.replace(/^http/, 'ws');
    var ws = new WebSocket(host);

    return ws;
});