class Controller {
    constructor() {
        this.$di = this.constructor.$inject
            .reduce((accumulator, injection, index) => Object.assign(accumulator, {[injection]: arguments[index]}), {});
    }
    static get $inject() {
        return [];
    }
}

export default Controller;
