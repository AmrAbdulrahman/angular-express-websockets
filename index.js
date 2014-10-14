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
	rowFactory.getRow(rowIdSeed++, 'Build', 'Tenrox-R1_1236', '', 'Pending', 'Pending', 'Pending', 'Pending', 'Pending'),
	rowFactory.getRow(rowIdSeed++, 'Build', 'Tenrox-R1_1237', '', 'Pending', 'Pending', 'Pending', 'Pending', 'Pending'),
	rowFactory.getRow(rowIdSeed++, 'Build', 'Tenrox-R1_1238', '', 'Pending', 'Pending', 'Pending', 'Pending', 'Pending'),
	rowFactory.getRow(rowIdSeed++, 'Firewall', '432462', 'amr', 'Pending', 'Pending', 'Pending', 'Pending', 'Pending'),
	rowFactory.getRow(rowIdSeed++, 'Firewall', '432463', 'no2a','Pending', 'Pending', 'Pending', 'Pending', 'Pending'),
	rowFactory.getRow(rowIdSeed++, 'Firewall', '432464', 'samy','Pending', 'Pending', 'Pending', 'Pending', 'Pending'),
	rowFactory.getRow(rowIdSeed++, 'Firewall', '432465','jtuck', 'Pending', 'Pending', 'Pending', 'Pending', 'Pending')
	
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
	
	// remove random rows
	if(rowsArray.length > 40)
	{
		wss.broadcast('remove:row', { // broadcast
			row: rowsArray[40]
		});
	}

	var build = utils.randomInt() % 2 == 0;
	var row = null;

	if(build)
	{
		row = rowFactory.getRow(rowIdSeed, 'Build', 'Tenrox-R1_' + rowIdSeed, '', 'Pending', 'Pending', 'Pending', 'Pending', 'Pending');
	}
	else
	{
		row = rowFactory.getRow(rowIdSeed, 'Firewall', 'fw' + rowIdSeed, '', 'Pending', 'Pending', 'Pending', 'Pending', 'Pending');
	}
	rowIdSeed++;
	
	wss.broadcast('new:row', { // broadcast
		row: row
	});
		
	rowsArray.splice(0,0,row); // add row to the list
	
}, 20000);

// adding new rows randomly
setInterval(function() {

	for(var i=0; i<rowsArray.length; i++)
	{
		var row = rowsArray[i];
		var msg = '';
		
		if(row.Status == 'Pending')
		{
			row.Status = 'Running';
			row.Metrics.Status = utils.randomInt() % 2 == 0 ? 'Running' : 'Pending';
			row.Build.Status = utils.randomInt() % 2 == 0 ? 'Running' : 'Pending';;
			row.UnitTest.Status = utils.randomInt() % 2 == 0 ? 'Running' : 'Pending';;
			row.FunctionalTest.Status = utils.randomInt() % 2 == 0 ? 'Running' : 'Pending';;	
			msg = 'pending -> running';
		}
		else if(row.Status == 'Running')
		{	
			
			rowsArray[i].Metrics.Percentage += utils.randomInt() % 30;
			rowsArray[i].Build.Percentage += utils.randomInt() % 30;
			rowsArray[i].UnitTest.Percentage += utils.randomInt() % 30;
			rowsArray[i].FunctionalTest.Percentage += utils.randomInt() % 30;
			
			if(row.Metrics.Percentage > 80 && row.Build.Percentage > 80 && row.UnitTest.Percentage > 80 && row.FunctionalTest.Percentage > 80)
			{
				var hasFailed = utils.randomInt() % 2 == 0;
			
				
				if(hasFailed)
				{
					if(row.Type == 'Build')
					{
						row.Status = 'Failed';
						row.Metrics.Status = 'Completed';
						row.Build.Status = 'Failed';
						row.UnitTest.Status = 'Failed';
						row.FunctionalTest.Status = 'Failed';
						msg = 'running -> failed';
					}
					else
					{
						row.Status = 'Rejected';
						row.Metrics.Status = 'Completed';
						row.Build.Status = 'Completed';
						row.UnitTest.Status = 'Failed';
						row.FunctionalTest.Status = 'Failed';
						msg = 'running -> rejected';
					}
				}
				else // accepted or completed
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

					row.Metrics.Status = 'Completed';
					row.Build.Status = 'Completed';
					row.UnitTest.Status = 'Completed';
					row.FunctionalTest.Status = 'Completed';			
				}
			}
		}
		
		wss.broadcast('update:row', { // broadcast
			row: row, msg: msg
		});
		
	}
}, 10000);
	