import ReduceStore from 'flux/lib/FluxReduceStore';

import deepFreezeFactory from './deep-freeze';

const subscriptions = new WeakMap();
const deepFreeze = deepFreezeFactory();

export default class extends ReduceStore {
    static get reducers() {
        return {};
    }

    static get initialState() {
        return {};
    }

    getInitialState() {
        return this.constructor.initialState;
    }

    reduce(originalState, {type, data}) {
        const {reducers} = this.constructor;

        if (!reducers) {
            return originalState;
        }

        if (!reducers[type]) {
            return originalState;
        }

        const reducer = reducers[type];
        const changedState = reducer(originalState, data);

        if (this.areEqual(originalState, changedState)) {
            return originalState;
        }

        return deepFreeze(changedState);
    }

    subscribe(callback) {
        if (subscriptions.has(callback)) {
            throw Error('provided callback is already used for subscription');
        }

        const subscription = this.addListener(callback);

        subscriptions.set(callback, subscription);

        callback();
    }

    unSubscribe(callback) {
        if (!subscriptions.has(callback)) {
            throw Error('provided callback is not used for subscription');
        }

        const subscription = subscriptions.get(callback);

        subscription.remove();
    }
}
