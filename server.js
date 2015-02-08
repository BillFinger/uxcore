/*
  ###############################################
  #
  #   Learning node
  #
  ###############################################
*/

//##############################################################################
'use strict';

function api_db ( res, server, port, path){

  require('http').get ( 'http://' + server + ':' + port + '/' + path,     //URL
    					function ( cdbres ){  cdbres.pipe(res);}                   //CALLBACK
  )
}

function apis_db ( res, server, port, path, user, pass){

  require('https').get (

    //'https://admin:@' + server + ':' + port + '/' + path, //URL
    'https://admin:@couchdb9-ih.jelastic.dogado.eu/ihev/cfg',
    function ( cdbres ){  cdbres.pipe(res);}      //CALLBACK

  )
}
function file_db ( req, res ){
  var
    fs=require('fs'),url=req.url.split('?')[0],
    rs=fs.createReadStream('public' + ( ( url==='/')?'/index.html': url ));

  rs.on('open',function(){rs.pipe(res);});
  rs.on('error',function(err){res.end();console.log('READ ERROR' + req.url);});

}
// --------------------------------------------------------------
function router(req, res){

  console.log(++i + '. incoming request from ' + Date.now() + '\t' + req.url);

	datastore.log.push(req.url);

	//bei POST API requests werden die veränderten Teile ALLEN ausgeliefert
	datastore.storage.push({id:datastore.nextid,name:req.url});
	datastore.nextid++;
	hash=hashCode(JSON.stringify(datastore.storage));//hat soch etwas am DatenZustand geändert?

  //ROUTING
  switch (true){


    case /cdb\/cld/.test( req.url ): console.log('cdb cld fire\t' + req.url); apis_db( res, 'couchdb1167astic.dogado.eu', '','myiihm/','admin','t9L2iKOP63');       break;
    case /cdb\/ihm/.test( req.url ): console.log('cdb ihm fire\t' + req.url);  api_db( res, 'localhost', 5984,'ih/IH-Meldung');       break;
    case /cdb\/cfg/.test( req.url ): console.log('cdb cfg fire\t' + req.url);  api_db( res, 'localhost', 5984,'ih/FG-Liste' );       break;
    case /mdb\/cfg/.test( req.url ): console.log('mdb cfg fire\t' + req.url);  api_db( res, 'localhost', 28017,'pm/cfg/' );            break;

    case /\/.*/.test( req.url ):     console.log('cdb fs req\t'+ __dirname + ' ' + req.url); file_db(req,res); break;
    default: res.writeHead(404);res.end('keine Route');break;
  }

}
// ----------------------------------------------------------------
function fdatastore(){
//	require('fs').writeFile('storage.log',JSON.stringify(datastore),function(err){if(err) throw err;console.log('datastore saved Filesaved');});
	//console.log('timeout erreicht');

	if ( hash != datastore.hash ) //es gibt was zu schreiben
		{
		datastore.hash=hash;
		require('fs')
		.writeFile('storage.json',JSON.stringify(datastore), function(err){ if(err) throw err;console.log( hash + ' datastore saved Filesaved ' + Date.now());} )

			wsockets.forEach(function(e){e.sendText(hash + '#' + datastore.nextid + ' ' + JSON.stringify(datastore.storage));});
		}

}
//--------------------------------------------------------------------
var
    i=0,cfg=require('./config'),
    port= process.env.PORT || cfg.port,
	  hash=0,
    datastore={ hash:0, nextid:1,log:[], storage:[] },
	f = require('fs'),conf = require('./config.json'),localcache=require('./storage.json'),//exp=require('express'),sio=require('socket.io'),
//	o = {
//			key:	f.readFileSync('./selfsignedsteey.pem'),
//			cert:	f.readFileSync('./selfsignedstesr.pem')
//		},
	//---------------------
	esockets = [],csockets = [],wsockets = [],
	netc = require('net'),
	nete = require('net'),
  udp = require('dgram'),

  /*

  var dgram = require('dgram');
  var message = new Buffer('My KungFu is Good!');

  var client = dgram.createSocket('udp4');
  client.send(message, 0, message.length, PORT, HOST, function(err, bytes) {
  if (err) throw err;
  console.log('UDP message sent to ' + HOST +':'+ PORT);
  client.close();
});
  */

//	netw = require('nodejs-websocket'),

	chat_server = netc.createServer(

		function(socket){

			csockets.push(socket);	//wieviele Teilnehmer sind aktuell in der Leitung
			console.log('from ' + socket.remoteAddress + ':' + socket.remotePort + ' new chat socket open..');
			socket.write('verbunden mit chatserver\nTeilnehmer:\n' + csockets.map( function(e) {return e.remotePort;} ).join('\n') +'\nmessage(ENTER):');

			socket.on('data', function(reqdata){
					csockets.forEach(function(e){e.write( 'from ' + socket.remotePort + ' TO ' + e.remotePort + 'data: ' + reqdata + 'message(ENTER):');});
					console.log(socket.remotePort + ' chatsocket req res to all..' + csockets.length);

				}
			);

			socket.on('end', function(){
					csockets.splice( csockets.indexOf(socket) ,1 );
					console.log(typeof socket + socket.remotePort + ' chat socket ends..');
				}
			);

		}

	),

	event_server = nete.createServer(

		function(socket){

			esockets.push(socket);	//wieviele Teilnehmer sind aktuell in der Leitung
			console.log('new event socket open..');
      socket.write('HTTP/1.1 200 OK\n');
      socket.write('Date: Fr, 16 Jan 2015 11.48.22 GMT\n');
      socket.write('Server: node\n');
      socket.write('Accept-Ranges: bytes\n');
      //      socket.write('Content-Type: text/event-stream');
      socket.write('Content-Type: text/html\n\n');
      //socket.write('expires: -1');
      //socket.write('Cache-Control: no-cache');
      //socket.write('Connection: keep-alive');
      socket.write('data: verbunden\n\n');

			socket.on('data', function(reqdata){
					esockets.forEach(function(e){e.write(reqdata);});
					console.log('event socket req res to all..');

				}
			);

			socket.on('end', function(){
					esockets.splice( esockets.indexOf(socket) ,1 );
					console.log(typeof socket + ' event socket ends..');
				}
			);

		}

	);
/*
	ws = netw.createServer(

		function(connect){

			wsockets.push(connect);	//wieviele Teilnehmer sind aktuell in der Leitung
			console.log('new event connect open..');
			//socket.write('data: verbunden\n\n');

			connect.on('text', function(reqdata){
					wsockets.forEach(function(e){e.sendText(reqdata);});
					console.log('event socket req res to all..');

				}
			);

			connect.on('close', function(){
					wsockets.splice( wsockets.indexOf(connect) ,1 );
					console.log(' event socket ends..');
				}
			);

		}

	)
;
*/
//chat_server.listen(3030);console.log('CHAT_SERVER 3030 eingerichtet..');
event_server.listen(8005);console.log('EVENT_SERVER 8005 eingerichtet..');
//ws.listen(8001);console.log('WEBSOCKET_SERVER 8001 eingerichtet..');
// ------------------------------------------------------------------

//require('net').createServer().listen(8005, function(){console.log('EVENT AUf 8005...');});


//
function hashCode(s){return s.split('').reduce(function(a,b){a=((a<<5)-a)+b.charCodeAt(0);return a&a},0);}
//setTimeout(

//setInterval( fdatastore	,5000);

require('http').createServer( router )
//require('https').createServer( o, router )
.listen( port, function(){console.log(__dirname + ' Waining for connection on port ' +port + '...'+conf.port+'###'+localcache.nextid+'###'+localcache.hash+'###'+localcache.storage.length);});
