class Controller {
    constructor(...args) {
        this.$di = this.constructor.$inject
            .reduce((accumulator, injection, index) => Object.assign(accumulator, {[injection]: args[index]}), {});
    }

    bindAsCallback(fn) {
        console.assert(this.constructor.$inject.includes('$scope'), '"$scope" should be injected');

        return () => this.$di.$scope.$applyAsync(() => fn(this));
    }

    static get $inject() {
        return [];
    }
}

export default Controller;
