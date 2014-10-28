
var listApp = angular.module('listApp');

listApp.service('websockets', function () {

    var wsClass =
    {
        connect: function () {

            var host = config.webSocketServerUrl;
            var ws = new WebSocket(host);
            var eventHandlers = {};

            ws.on = function (event, handler) {
                eventHandlers[event] = handler;
            }

            ws.emit = function (event, data) {
                ws.send(JSON.stringify({ event: event, data: data }));
            }

            ws.onmessage = function (message) {
                var jsonData = JSON.parse(message.data);
                var event = jsonData.event;
                var data = jsonData.data;

                if (eventHandlers[event])
                    eventHandlers[event](data);
            };

            return ws;
        }
    }

    return wsClass;
});