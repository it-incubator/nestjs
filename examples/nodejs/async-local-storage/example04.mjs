import { AsyncLocalStorage } from 'node:async_hooks';

const asyncLocalStorage = new AsyncLocalStorage();
const runInAsyncScope = asyncLocalStorage.run({value: 1}, () => {
    const asyncScope = AsyncLocalStorage.snapshot();
    setTimeout(() => {
        const store = asyncLocalStorage.getStore();
        store.value++;
    }, 1000)
    return asyncScope;
});
const result = asyncLocalStorage.run(321, () => {
    return runInAsyncScope(() => {
        setTimeout(() => {
            const store1 = asyncLocalStorage.getStore()
            console.log(store1.value)
        }, 2000)
        return asyncLocalStorage.getStore();
    });
});
console.log(result);  // returns 123