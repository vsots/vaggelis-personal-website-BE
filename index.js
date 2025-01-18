import * as http from 'http';

const host = '127.0.0.1';
const port = 8080;

const server = http.createServer(handler);
server.listen(port, host, () => {
    console.log(`Server Listening At http://${host}:${port}/`);
})

function handler(req, res) {
    res.status = 200;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({response: "It works!"}));
}
