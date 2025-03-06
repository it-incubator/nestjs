import http from 'node:http';
import { AsyncLocalStorage } from 'node:async_hooks';
import EventEmitter from 'node:events';
import url from "url";

const asyncLocalStorage = new AsyncLocalStorage();

function logWithId(msg) {
    const store = asyncLocalStorage.getStore();
    console.log(`${store.value}'-'}:`, msg);
    store.value++;
}

http.createServer((req, res) => {
    const queryObject = url.parse(req.url, true).query;
    const id = queryObject.id;
    asyncLocalStorage.run({ id: id }, async () => {
        res.end();
        usecase();
    });
}).listen(3000);
//  start0, start1, middle0, middle1, finish0, finish1

const eventEmitter = new EventEmitter();
eventEmitter.on('usecase-finished', handler)

async function usecase() {
    await repoSave();
    eventEmitter.emit('usecase-finished')
}

// 'usecase-finished'
async function handler() {
    await repo2Save();
}

async function repoSave() {
    await delay(1000)
    const store = asyncLocalStorage.getStore();
   console.log('saved-to-db-from-repo-1 for id: ' + store.id)
}

async function repo2Save() {
    const store = asyncLocalStorage.getStore();
    console.log('saved-to-db-from-repo-2 for id: ' + store.id)
}

function delay(ms) {
    return new Promise(res => setTimeout(res, ms))
}

http.get('http://localhost:3000?id=1');
http.get('http://localhost:3000?id=2');