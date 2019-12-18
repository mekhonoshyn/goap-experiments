export default plainDefinition;

function plainDefinition(initialValue) {
    let privateValue = initialValue;

    return {
        get: () => privateValue,
        set: (value) => {
            privateValue = value;
        },
        enumerable: true
    };
}
