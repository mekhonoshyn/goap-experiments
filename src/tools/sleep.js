export default sleep;

function sleep(time) {
    if (time) {
        return new Promise((resolve) => setTimeout(resolve, time));
    }

    return Promise.resolve();
}
