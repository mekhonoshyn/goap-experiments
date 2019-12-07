import defer from 'tools/defer';

const DEFAULT_DEFINITION = {
    enumerable: true
};

const createArrayDefinition = createSimpleDefinition;
const createObjectDefinition = createSimpleDefinition;
const createNumberDefinition = createSimpleDefinition;
const createStringDefinition = createSimpleDefinition;
const createBooleanDefinition = createSimpleDefinition;

export {
    createArrayDefinition,
    createObjectDefinition,
    createNumberDefinition,
    createStringDefinition,
    createBooleanDefinition,
    createDeferredDefinition
};

function createSimpleDefinition(initialValue) {
    let privateValue = initialValue;

    return Object.assign({
        get: () => privateValue,
        set: (value) => {
            privateValue = value;
        }
    }, DEFAULT_DEFINITION);
}

function createDeferredDefinition() {
    const privateValue = {
        deferred: defer(),
        resolved: false
    };

    return Object.assign({
        get: () => privateValue.deferred.promise,
        set: () => {
            if (privateValue.resolved) {
                return;
            }

            privateValue.deferred.resolve();

            privateValue.resolved = true;
        }
    }, DEFAULT_DEFINITION);
}
