const http = require('http');

const options = {
    hostname: 'localhost',
    port: 3000,
    path: '/',
    method: 'GET',
    agent: false  // This ensures each request uses a new TCP connection
};

for (let i = 0; i < 5; i++) {
    const req = http.request(options, (res) => {
        let data = '';

        res.on('data', (chunk) => {
            data += chunk;
        });

        res.on('end', () => {
            console.log(`Response ${i + 1}: ${data}`);
        });
    });

    req.on('error', (err) => {
        console.error(`Request ${i + 1} failed: ${err.message}`);
    });

    req.end();
}