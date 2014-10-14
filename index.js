var WebSocketServer = require("ws").Server;
var http = require("http");
var express = require("express");
var app = express();
var port = process.env.PORT || 5000;
var path = require('path');

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function(request, res) {
  res.sendFile('public/index.html', {root: __dirname });
})

// http
var server = http.createServer(app)
server.listen(port)
console.log("http server listening on %d", port)

// web sockets
var wss = new WebSocketServer({server: server})
console.log("websocket server created")

// rows logic
var utils = require("./utils.js");
var rowFactory = require("./rowFactory.js");
var rowIdSeed = 20;

var rowsArray =
[
	//rowFactory.getRow(rowIdSeed++, 'Build', 'Tenrox-R1_1235', '', 'Pending', 'Pending', 'Pending', 'Pending', 'Pending'),
	//rowFactory.getRow(rowIdSeed++, 'Build', 'Tenrox-R1_1236', '', 'Running', 'Completed', 'Running', 'Pending', 'Pending'),
	//rowFactory.getRow(rowIdSeed++, 'Build', 'Tenrox-R1_1237', '', 'Completed', 'Completed', 'Completed', 'Completed', 'Completed'),
	//rowFactory.getRow(rowIdSeed++, 'Build', 'Tenrox-R1_1238', '', 'Failed', 'Completed', 'Failed', 'Cancelled', 'Cancelled'),
	//rowFactory.getRow(rowIdSeed++, 'Firewall', '432462', 'amr', 'Pending', 'Pending', 'Pending', 'Pending', 'Pending'),
	//rowFactory.getRow(rowIdSeed++, 'Firewall', '432463', 'no2a','Running', 'Completed', 'Running', 'Running', 'Pending'),
	//rowFactory.getRow(rowIdSeed++, 'Firewall', '432464', 'samy','Accepted', 'Completed', 'Completed', 'Completed', 'Completed'),
	//rowFactory.getRow(rowIdSeed++, 'Firewall', '432465','jtuck', 'Rejected', 'Completed', 'Failed', 'Cancelled', 'Cancelled')
	
	
	rowFactory.getRow(rowIdSeed++, 'Build', 'Tenrox-R1_1235', '', 'Pending', 'Pending', 'Pending', 'Pending', 'Pending'),
	rowFactory.getRow(rowIdSeed++, 'Build', 'Tenrox-R1_1236', '', 'Pending', 'Completed', 'Running', 'Pending', 'Pending'),
	rowFactory.getRow(rowIdSeed++, 'Build', 'Tenrox-R1_1237', '', 'Pending', 'Completed', 'Completed', 'Completed', 'Completed'),
	rowFactory.getRow(rowIdSeed++, 'Build', 'Tenrox-R1_1238', '', 'Pending', 'Completed', 'Failed', 'Cancelled', 'Cancelled'),
	rowFactory.getRow(rowIdSeed++, 'Firewall', '432462', 'amr', 'Pending', 'Pending', 'Pending', 'Pending', 'Pending'),
	rowFactory.getRow(rowIdSeed++, 'Firewall', '432463', 'no2a','Pending', 'Completed', 'Running', 'Running', 'Pending'),
	rowFactory.getRow(rowIdSeed++, 'Firewall', '432464', 'samy','Pending', 'Completed', 'Completed', 'Completed', 'Completed'),
	rowFactory.getRow(rowIdSeed++, 'Firewall', '432465','jtuck', 'Pending', 'Completed', 'Failed', 'Cancelled', 'Cancelled')
	
]; // end of rows array



wss.broadcast = function(event, data) {
	for (var i =0; i<this.clients.length; i++)
	{
		try
		{
			this.clients[i].send(JSON.stringify({event: event, data:data}));
		}
		catch(ex)
		{
			console.log("Client unreachable!");
			this.clients.splice(i, 1); // remove it
			i--;
		}
	}
};

wss.on("connection", function(ws) {

	ws.emit = function(event, data)
	{
		ws.send(JSON.stringify({event:event, data:data}), function() {});
	}
	
	console.log("websocket connection open");

	ws.emit('init', {list:rowsArray});
  
	ws.on("close", function() {
		console.log("websocket connection close");
	})
});

// adding new rows randomly
setInterval(function() {
	
	if(rowsArray.length == 20)
	{
		for(var i=0; i<10; i++)
		{
			var randomRowIndex = utils.randomInt() % rowsArray.length;
			rowsArray.splice(randomRowIndex, 1); // remove 10 elements, as the server is continously adding rows infinitely 
		}
	}

	
	var randomRowIndex = utils.randomInt() % rowsArray.length;
	var row = rowsArray[randomRowIndex]
	row.Id = rowIdSeed++; // give it a new Id
	row.Status = 'Pending';
	wss.broadcast('new:row', { // broadcast
		row: row
	});
	
	rowsArray.splice(0,0,row); // add row to the list
	
}, 20000);

// adding new rows randomly
setInterval(function() {

	var luckyIndex = utils.randomInt() % rowsArray.length;
	var row = rowsArray[luckyIndex];
	var msg = '';
	
	if(row.Status == 'Pending')
	{
		row.Status = 'Running';
		msg = 'pending -> running';
	}
	else if(row.Status == 'Running')
	{
		var hasFailed = utils.randomInt() % 2 == 0;
		
		if(hasFailed)
		{
			if(row.Type == 'Build')
			{
				row.Status = 'Failed';
				msg = 'running -> failed';
			}
			else
			{
				row.Status = 'Rejected';
				msg = 'running -> rejected';
			}
		}
		else
		{
			if(row.Type == 'Build')
			{
				row.Status = 'Completed';
				msg = 'running -> completed';
			}
			else
			{
				row.Status = 'Accepted';
				msg = 'running -> accepted';
			}				
		}
	}
	else // is completed or failed
	{
		msg = 'resetting ' + row.Status + ' -> pending';
		row.Status = 'Pending';
	}
	
	wss.broadcast('update:row', { // broadcast
		row: row, msg:msg
	});
}, 3000);
