
var listApp = angular.module('listApp');

listApp.service('socketio', function () {
    this.connect = function () {
        try {
            return io.connect(config.serverUrl);
        }
        catch (ex) {
            console.log('Failed to connect to: ' + config.serverUrl);
            return null;
        }
    };
});