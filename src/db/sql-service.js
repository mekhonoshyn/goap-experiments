import sqlSchema from 'raw-loader!./schema.sqlite';
import sqlWorker from './sql-worker';
import sqlBuilder from './sql-builder';

const WORKER_PATH = 'sql/worker.sql.js';

export default {
    connect,
    execute,
    initialize
};

function connect() {
    return sqlWorker.initialize(WORKER_PATH)
        .then(() => sqlWorker.restore('sql/db-snapshot.sql'));
}

function initialize() {
    return sqlWorker.initialize(WORKER_PATH)
        .then(() => sqlWorker.create())
        .then(() => sqlWorker.execute(sqlSchema))
        .then(() => sqlWorker.execute(`
            PRAGMA foreign_keys = OFF;
            INSERT INTO T_STRUCTURE_UNITS(parentId, title, description, view) VALUES(0, NULL, NULL, "${sqlBuilder.fromJSON({type: 'tabs-view'})}");
            PRAGMA foreign_keys = ON;
        `));
}

function execute(statement) {
    return sqlWorker.execute(statement);
}
