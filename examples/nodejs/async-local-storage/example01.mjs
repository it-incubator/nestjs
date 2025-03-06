import http from 'node:http';
import { AsyncLocalStorage } from 'node:async_hooks';

const asyncLocalStorage = new AsyncLocalStorage();

function logWithId(msg) {
    const store = asyncLocalStorage.getStore();
    console.log(`${store.value}'-'}:`, msg);
    store.value++;
}

http.createServer((req, res) => {
    asyncLocalStorage.run({ value: 0 }, () => {
        logWithId('start');
        // Imagine any chain of async operations here
        doSomething1(res);
    });
}).listen(3000);
//  start0, start1, middle0, middle1, finish0, finish1


function doSomething1(res) {
    setTimeout(() => {
        logWithId('middle');
        doSomething2(res);
    }, 1000);
}


function doSomething2(res) {
    setTimeout(() => {
        logWithId('finish');
        res.end();
    }, 2000)
}



http.get('http://localhost:3000');
http.get('http://localhost:3000');
// Prints:
//   0: start
//   1: start
//   0: finish
//   1: finish