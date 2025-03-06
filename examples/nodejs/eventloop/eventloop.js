const http = require('http');


var intervalCount = 0;
var count = 0;
setInterval(() => {
    console.log("interval: " + intervalCount++);
}, 1000)

const server = http.createServer((req, res) => {
    console.log("start");
    console.log(`Requested URL: ${req.url}`);
    const start = Date.now();
    while (Date.now() - start < 10000) {
        // Блокирующий цикл (5 секунд)
    }
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('Hello, Node.js!');
    console.log("finish");
    count++;
});

server.listen(3000, () => {
    console.log('Server running at http://localhost:3000/');
});