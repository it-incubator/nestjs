function createArray() {
    const array = []
    for (let i = 0; i < 1000000; i++) {
        array.push({first_name: 'first_name' + i, last_name: 'last_name' + i})
    }
    return array;
}

function mapArrayImplicitly(input) {

    return input.map(item =>({ firstName: item.first_name, lastName: item.last_name }));
}

function measurePerformance(fn, input) {
    const start = performance.now();
    fn(input);
    const end = performance.now();
    console.log(`Execution time: ${end - start} ms`);
}

function mapArrayImplicitlySnakeToUpper(input) {
    const result = input.map(item => {
        const newItem = {};
        for (const key in item) {
            const newKey = key.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
            newItem[newKey] = item[key].toUpperCase();
        }
        return newItem;
    });
    return result;
}

function mapArrayImplicitlySnakeToUpperOptimized(input) {
    const keyMap = Object.keys(input[0]).reduce((acc, key) => {
        acc[key] = key.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
        return acc;
    }, {});

    const result = input.map(item => {
        const newItem = {};
        for (const key in keyMap) {
            newItem[keyMap[key]] = item[key].toUpperCase();
        }
        return newItem;
    });
    return result;
}

const array = createArray();

measurePerformance(mapArrayImplicitly, array);
measurePerformance(mapArrayImplicitlySnakeToUpper, array);
measurePerformance(mapArrayImplicitlySnakeToUpperOptimized, array);