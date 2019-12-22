export default defer;

function defer() {
    const deferred = {};

    deferred.promise = new Promise((resolve) => {
        deferred.resolve = resolve;
    });

    return deferred;
}
