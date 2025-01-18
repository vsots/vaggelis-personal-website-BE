import * as http from 'http';
import contactFormValSan from './modules/contactFormValSan.js';

const host = '127.0.0.1';
const port = 8080;

const server = http.createServer(handler);
server.listen(port, host, () => {
    console.log(`Server Listening At http://${host}:${port}/`);
})

function handler(req, res) {
    if (req.method === 'POST' && req.url === '/testurl') {
        let data = '';
        req.on('data', (chunk) => {
            data += chunk;
        })
        req.on('end', () => {
            const valid = contactFormValSan(JSON.parse(data));
            if (!valid) {
                res.writeHead(400, { 'Content-Type': 'text/plain' });
                res.write('Form Validation Failed');
                res.end();
            } else {
                res.writeHead(204, { 'Content-Type': 'text/plain' });
                res.end();
            }
        })
    }
}
