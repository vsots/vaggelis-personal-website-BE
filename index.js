import dotenv from 'dotenv';
import * as http from 'http';
import * as nodemailer from 'nodemailer';
import contactFormValSan from './modules/contactFormValSan.js';

dotenv.config();

const emailBody =  (json) => (
`Name: ${json.name}
Email: ${json.email}
Subject: ${json.subject}


Message:
${json.message}`);

const port = 8080;
const server = http.createServer(handler);
server.listen(port, () => {
    console.log("Server Listening on Port: ", port);
})

function handler(req, res) {
    // uncomment for localhost
    // const headers = {
    //     'Access-Control-Allow-Origin': 'http://localhost:3000',
    //     'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    //     'Access-Control-Allow-Headers': 'Content-Type'
    // };

    // if (req.method === 'OPTIONS') res.writeHead(200, headers).end();

    if (req.method === 'POST' && req.url === '/contactsubmission') {
        let data = '';
        req.on('data', chunk => data += chunk);
        req.on('end', () => {
            const valid = contactFormValSan(JSON.parse(data));
            if (!valid) {
                res.writeHead(400, { ...headers, 'Content-Type': 'text/plain' });
                res.end('Form Validation Failed');
            } else {
                const transporter = nodemailer.createTransport({
                    host: process.env.SMTP_HOST,
                    port: 465,
                    secure: true,
                    auth: {
                        user: process.env.EMAIL_FROM,
                        pass: process.env.SMTP_PASS
                    }
                  });
                
                const mailText = emailBody(valid);

                const mailOptions = {
                    to: process.env.EMAIL_TO,
                    subject: "NEW MAIL FROM PERSONAL WEBSITE",
                    text: mailText
                }

                transporter.sendMail(mailOptions, function(error, info) {
                    if (error) {
                        console.log('Error sending email: ', error);
                    } else {
                        console.log('Email sent: ' + info.response)
                    }
                })

                // res.writeHead(204, headers);
                res.writeHead(204);
                res.end();
            }
        })
    } else {
        //res.writeHead(400, { ...headers, 'Content-Type': 'text/plain' });
        res.writeHead(400, {'Content-Type': 'text/plain' });
        res.end('Unknown Request');
    }
}
