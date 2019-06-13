class Store {
    static getName(storeFunction) {
        return getStoreName(storeFunction.name);
    }
}

export default Store;

function getStoreName(source) {
    return source.replace(/(.)(.*)/, (origin, firstLetter, restLetters) => `${firstLetter.toLowerCase()}${restLetters}`);
}
