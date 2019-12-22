export default maxLengthConstraint;

function maxLengthConstraint(maxLength) {
    return {
        name: 'maxlength',
        params: [maxLength],
        test: (value) => value.length <= maxLength,
        errorMessage: `#{i18n.GENERAL_ERROR__LENGTH_NOT_MORE_THAN}#`
    };
}
