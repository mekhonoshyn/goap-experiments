const PREFIX = 'bld';

class Component {
    constructor() {
        Object.assign(this, {
            bindings: Object.entries(this.constructor.bindings).reduce((accumulator, [property, binding]) => {
                return Object.assign(accumulator, {[property]: `${binding}${getComponentName(this.constructor.name)}${getBindingSuffix(property)}`})
            }, {}),
            template: this.constructor.template,
            controller: this.constructor.controller,
            controllerAs: getControllerName(this.constructor.name)
        });
    }
    static get bindings() {
        return {};
    }
    static get DEFINITION() {
        return [getComponentName(this.name), new this];
    }
}

export default Component;

function getControllerName(source) {
    return source.replace(/(.)(.*)Component/, (origin, firstLetter, restLetters) => `${firstLetter.toLowerCase()}${restLetters}Ctrl`);
}

function getComponentName(source) {
    return source.replace(/(.*)Component/, `${PREFIX}$1`);
}

function getBindingSuffix(source) {
    return source.replace(/(.)(.*)/, (origin, firstLetter, restLetters) => `${firstLetter.toUpperCase()}${restLetters}`);
}
