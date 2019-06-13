class Service {
    constructor() {
        this.$di = this.constructor.$inject
            .reduce((accumulator, injection, index) => Object.assign(accumulator, {[injection]: arguments[index]}), {});
    }
    static get $inject() {
        return [];
    }
    static get DEFINITION() {
        return [getServiceName(this.name), this];
    }
}

export default Service;

function getServiceName(source) {
    return source.replace(/(.)(.*)/, (origin, firstLetter, restLetters) => `${firstLetter.toLowerCase()}${restLetters}`);
}
