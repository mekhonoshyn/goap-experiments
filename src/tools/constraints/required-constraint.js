export default requiredConstraint;

function requiredConstraint() {
    return {
        name: 'required',
        params: [],
        test: Boolean,
        errorMessage: '#{i18n.GENERAL_ERROR__FIELD_IS_REQUIRED}#'
    };
}
