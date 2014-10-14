
var listApp = angular.module('listApp');

listApp.service('websockets', function () {

    var wsClass =
    {
        connect: function () {
            var host = location.origin.replace(/^http/, 'ws');
            var ws = new WebSocket(host);
            var events = {};

            ws.on = function (event, handler) {
                events[event] = handler;
            }

            ws.onmessage = function (message) {
                var jsonData = JSON.parse(message.data);

                var event = jsonData.event;
                var data = jsonData.data;

                events[event](data);
            };

            return ws;
        }
    }

    return wsClass;
});