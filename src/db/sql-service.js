import sqlSchema from 'raw-loader!./schema.sqlite';
import sqlWorker from './sql-worker';
import sqlBuilder from './sql-builder';

export default {
    connect,
    execute,
    initialize
};

async function connect() {
    await sqlWorker.initialize('sql/worker.sql.js');

    await sqlWorker.restore('sql/db-snapshot.sql');
}

async function initialize() {
    await sqlWorker.initialize('sql/worker.sql.js');

    await sqlWorker.create();

    await sqlWorker.execute(sqlSchema);

    await sqlWorker.execute(`
        PRAGMA foreign_keys = OFF;
        INSERT INTO T_STRUCTURE_UNITS(parentId, title, description, view) VALUES(0, NULL, NULL, "${sqlBuilder.fromJSON({type: 'tabs-view'})}");
        PRAGMA foreign_keys = ON;
    `);
}

function execute(statement) {
    return sqlWorker.execute(statement);
}
