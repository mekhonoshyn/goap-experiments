export {
    createMaxLengthConstraint,
    createRequiredConstraint
};

function createMaxLengthConstraint(maxLength) {
    return {
        name: 'maxlength',
        params: [maxLength],
        test: (value) => value.length <= maxLength,
        errorMessage: `#{i18n.GENERAL_ERROR__LENGTH_NOT_MORE_THAN}#`
    };
}

function createRequiredConstraint() {
    return {
        name: 'required',
        params: [],
        test: Boolean,
        errorMessage: '#{i18n.GENERAL_ERROR__FIELD_IS_REQUIRED}#'
    };
}
