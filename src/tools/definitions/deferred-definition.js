import defer from 'tools/defer';

export default deferredDefinition;

function deferredDefinition() {
    const privateValue = {
        deferred: defer(),
        resolved: false
    };

    return {
        get: () => privateValue.deferred.promise,
        set: () => {
            if (privateValue.resolved) {
                return;
            }

            privateValue.deferred.resolve();

            privateValue.resolved = true;
        },
        enumerable: true
    };
}
