const pendingRequests = new Map();
const context = {
    workerInstance: null,
    lastUsedUniqueId: 0
};

export default {
    initialize,
    create,
    restore,
    execute,
    backup,
    close,
    terminate
};

function initialize(url) {
    return new Promise((resolve, reject) => {
        context.workerInstance = new Worker(url);

        context.workerInstance.onerror = console.error.bind(console);

        context.workerInstance.onmessage = ({data: response}) => {
            const {request, resolve, reject} = pendingRequests.get(response.id);

            if (response.success) {
                resolve(response);
            } else {
                reject({request, response});
            }

            cleanupRequest(response);
        };

        preserveRequest({id: 'initial', action: initialize.name}, resolve, reject);
    });
}

function create() {
    return doAction({action: create.name});
}

function restore(fileName) {
    return loadFile(fileName)
        .then((buffer) => doAction({action: restore.name, payload: buffer}));
}

function execute(query) {
    return doAction({action: execute.name, payload: query})
        .then(({results}) => results);
}

function backup(fileName) {
    return doAction({action: backup.name})
        .then(({buffer}) => saveFile(fileName, buffer));
}

function close() {
    return doAction({action: close.name});
}

function terminate() {
    return new Promise((resolve) => {
        context.workerInstance.terminate();

        resolve();
    });
}

function preserveRequest(request, resolve, reject) {
    pendingRequests.set(request.id, {request, resolve, reject});

    logMessage('<--', request);
}

function cleanupRequest(response) {
    pendingRequests.delete(response.id);

    logMessage('-->', response);
}

function doAction(request) {
    return new Promise((resolve, reject) => {
        Object.assign(request, {id: ++context.lastUsedUniqueId});

        preserveRequest(request, resolve, reject);

        context.workerInstance.postMessage(request);
    });
}

function logMessage(direction, data) {
    console.info(direction, data.id, JSON.stringify(data));
}

function loadFile(path) {
    return fetch(path)
        .then((response) => response.arrayBuffer());
}

function saveFile(fileName, buffer) {
    const anchor = document.createElement('a');

    anchor.style.display = 'none';
    anchor.style.position = 'absolute';

    const blob = new Blob([buffer], {type: 'octet/stream'});
    const url = URL.createObjectURL(blob);

    anchor.href = url;
    anchor.download = fileName;

    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);

    URL.revokeObjectURL(url);

    // delete anchor.href;
    // delete anchor.download;
}
