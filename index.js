import * as http from 'http';
import * as nodemailer from 'nodemailer';
import contactFormValSan from './modules/contactFormValSan.js';

const host = '127.0.0.1';
const port = 8080;

const emailBody =  (json) => (
`Name: ${json.name}
email: ${json.email}


Message:
${json.message}
`);

const server = http.createServer(handler);
server.listen(port, host, () => {
    console.log(`Server Listening At http://${host}:${port}/`);
})

function handler(req, res) {
    const headers = {
        'Access-Control-Allow-Origin': 'http://localhost:3000',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type'
    };

    if (req.method === 'OPTIONS') res.writeHead(200, headers).end();
    else if (req.method === 'POST' && req.url === '/contactsubmission') {
        let data = '';
        req.on('data', chunk => data += chunk);
        req.on('end', () => {
            const valid = contactFormValSan(JSON.parse(data));
            if (!valid) {
                res.writeHead(400, { ...headers, 'Content-Type': 'text/plain' });
                res.end('Form Validation Failed');
            } else {
                const transporter = nodemailer.createTransport({
                    host: 'smtp.host.server',
                    port: 465,
                    secure: true,
                    auth: {
                        user: "mail@example.com",
                        pass: "___"
                    }
                  });
                
                const mailText = emailBody(valid);

                const mailOptions = {
                    to: 'anothermail@example.com',
                    subject: valid.subject,
                    text: mailText
                }

                transporter.sendMail(mailOptions, function(error, info) {
                    if (error) {
                        console.log('ERROR IS: ');
                        console.log(error);
                    } else {
                        console.log('Email sent: ' + info.response)
                    }
                })

                res.writeHead(204, headers);
                res.end();
            }
        })
    } else {
        res.writeHead(400, { ...headers, 'Content-Type': 'text/plain' });
        res.end('Unknown Request');
    }
}
