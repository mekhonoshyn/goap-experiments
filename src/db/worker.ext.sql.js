const methods = {
    create,
    restore,
    execute,
    backup,
    close
};

let db;

self.onmessage = ({data: {id, action, payload}}) => {
    if (!methods[action]) {
        failure({id, action, reason: 'invalid action'});

        return;
    }

    try {
        methods[action](id, action, payload);
    } catch (error) {
        failure({id, action, reason: error.message});
    }
};

success({id: 'initial', action: 'initialize'});

function create(id, action) {
    if (db) {
        failure({id, action, reason: 'db already exists'});

        return;
    }

    db = new SQL.Database();

    success({id, action});
}

function restore(id, action, payload) {
    if (db) {
        failure({id, action, reason: 'db already exists'});

        return;
    }

    if (!payload) {
        failure({id, action, reason: 'data not provided'});

        return;
    }

    const data = new Uint8Array(payload);

    db = new SQL.Database(data);

    success({id, action});
}

function execute(id, action, query) {
    if (!db) {
        failure({id, action, reason: 'db does not exist'});

        return;
    }

    if (!query) {
        failure({id, action, reason: 'missing query string'});

        return;
    }

    success({id, action, results: db.exec(query)});
}

function backup(id, action) {
    if (!db) {
        failure({id, action, reason: 'db does not exist'});

        return;
    }

    const {buffer} = db.export();

    try {
        success({id, action, buffer}, [buffer]);
    } catch (error) {
        failure({id, action, reason: error.message});
    }
}

function close(id, action) {
    if (!db) {
        failure({id, action, reason: 'db does not exist'});

        return;
    }

    db.close();

    db = null;

    success({id, action});
}

function success(payload, transfer) {
    message(true, payload, transfer);
}

function failure(payload) {
    message(false, payload);
}

function message(result, payload, transfer) {
    postMessage(Object.assign(payload, {success: result}), transfer);
}
