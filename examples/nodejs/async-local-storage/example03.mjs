import { AsyncLocalStorage } from 'node:async_hooks';

const asyncLocalStorage = new AsyncLocalStorage();
const runInAsyncScope = asyncLocalStorage.run(123, () => {
    const asyncScope = AsyncLocalStorage.snapshot();
    return asyncScope;
});
const result = asyncLocalStorage.run(321, () => {
    return runInAsyncScope(() => {
        return asyncLocalStorage.getStore();
    });
});
console.log(result);  // returns 123