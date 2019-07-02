export default (exclusions = []) => {
    const extendedExclusions = [
        (value) => !value,
        (value) => typeof value !== 'object',
        (value) => Object.isFrozen(value),
        ...exclusions
    ];

    return deepFreeze.bind(null, extendedExclusions);
};

function deepFreeze(exclusions, target) {
    const keys = Object.getOwnPropertyNames(target);

    for (let key of keys) {
        const value = target[key];

        if (exclusions.every((exclusion) => !exclusion(value))) {
            target[key] = deepFreeze(exclusions, value);
        }
    }

    return Object.freeze(target);
}
