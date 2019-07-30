export default (time) => {
    if (time) {
        return new Promise((resolve) => setTimeout(resolve, time));
    }

    return Promise.resolve();
};
