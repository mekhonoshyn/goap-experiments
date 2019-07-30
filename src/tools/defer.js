export default () => {
    const deferred = {};

    deferred.promise = new Promise((resolve) => {
        deferred.resolve = resolve;
    });

    return deferred;
};
