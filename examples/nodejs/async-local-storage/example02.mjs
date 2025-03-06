import { AsyncLocalStorage } from 'node:async_hooks';

const asyncLocalStorage = new AsyncLocalStorage();
const xxx = asyncLocalStorage.run(123, () => {
    return 'hello world';
});

console.log(xxx);  // returns 123