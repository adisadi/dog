import * as express from 'express';
import * as http from 'http';
import * as url from 'url';

import {Server} from 'ws';

const app = express();

app.use(function (req, res) {
  res.send({ msg: "hello" });
});

const server = http.createServer(app);
const wss = new Server({ server });

const clients:any[]=[];

wss.on('connection', function connection(ws, req) {
  const location = url.parse(req.url, true);
  // You might use location.query.access_token to authenticate or share sessions
  // or req.headers.cookie (see http://stackoverflow.com/a/16395220/151312)
  console.log(location);
  clients.push(ws);
  ws.on('message', function incoming(message) {
    console.log('received: %s', message);
    sendAll(message);
  });

  sendAll('something');
});

server.listen(8080, function listening() {
  console.log('Listening on %d', server.address().port);
});

function sendAll (message:any) {
    for (var i=0; i<clients.length; i++) {
        clients[i].send("Message: " + message);
    }
}