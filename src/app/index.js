import sqlWorker from 'db/sql-worker';
import sqlBuilder from 'db/sql-builder';
import sqlService from 'db/sql-service';

(async () => {
    // await sqlService.initialize();

    await sqlService.connect();

    await sqlWorker.execute(`
        INSERT INTO T_STRUCTURE_UNITS(parentId, title, description, view) VALUES(1, "Goals", "", "${sqlBuilder.fromJSON({type: 'list-view'})}");
        INSERT INTO T_STRUCTURE_UNITS(parentId, title, description, view) VALUES(2, "get Baked Bread", "", "${sqlBuilder.fromJSON({type: 'goal-view'})}");
        INSERT INTO T_STRUCTURE_UNITS(parentId, title, description, view) VALUES(1, "Resources", "", "${sqlBuilder.fromJSON({type: 'list-view'})}");
        INSERT INTO T_STRUCTURE_UNITS(parentId, title, description, view) VALUES(1, "Tools", "", "${sqlBuilder.fromJSON({type: 'list-view'})}");
        INSERT INTO T_STRUCTURE_UNITS(parentId, title, description, view) VALUES(5, "Furnace", "allows to _BAKE_ or _MELT_ stuff", "${sqlBuilder.fromJSON({type: 'tool-view'})}");
        INSERT INTO T_STRUCTURE_UNITS(parentId, title, description, view) VALUES(1, "Processes", "", "${sqlBuilder.fromJSON({type: 'list-view'})}");
        INSERT INTO T_STRUCTURE_UNITS(parentId, title, description, view) VALUES(7, "to Heat Furnace", "changes the Furnace state to _HOT_", "${sqlBuilder.fromJSON({type: 'process-view'})}");
    `);

    await sqlWorker.execute(`
        INSERT INTO T_STRUCTURE_UNITS(parentId, title, description, view) VALUES(1, "Goals New", "", "${sqlBuilder.fromJSON({type: 'list-view'})}");
    `);

    await sqlWorker.execute(`
        INSERT INTO T_STRUCTURE_UNITS(parentId, title, description, view) VALUES(2, "get Baked Bread", "", "${sqlBuilder.fromJSON({type: 'goal-view'})}");
        INSERT INTO T_STRUCTURE_UNITS(parentId, title, description, view) VALUES(2, "get Baked Bread", "some description", "${sqlBuilder.fromJSON({type: 'goal-view'})}");
        INSERT INTO T_STRUCTURE_UNITS(parentId, title, description, view) VALUES(2, "get Baked Bread", "some loooooooooooooooooooooooooooong description", "${sqlBuilder.fromJSON({type: 'goal-view'})}");
        INSERT INTO T_STRUCTURE_UNITS(parentId, title, description, view) VALUES(2, "get Baked Bread", "", "${sqlBuilder.fromJSON({type: 'goal-view'})}");
        INSERT INTO T_STRUCTURE_UNITS(parentId, title, description, view) VALUES(2, "get Baked Bread", "", "${sqlBuilder.fromJSON({type: 'goal-view'})}");
        INSERT INTO T_STRUCTURE_UNITS(parentId, title, description, view) VALUES(2, "get Baked Bread", "", "${sqlBuilder.fromJSON({type: 'goal-view'})}");
        INSERT INTO T_STRUCTURE_UNITS(parentId, title, description, view) VALUES(2, "get Baked Bread", "", "${sqlBuilder.fromJSON({type: 'goal-view'})}");
        INSERT INTO T_STRUCTURE_UNITS(parentId, title, description, view) VALUES(2, "get Baked Bread", "", "${sqlBuilder.fromJSON({type: 'goal-view'})}");
        INSERT INTO T_STRUCTURE_UNITS(parentId, title, description, view) VALUES(2, "get Baked Bread", "", "${sqlBuilder.fromJSON({type: 'goal-view'})}");
        INSERT INTO T_STRUCTURE_UNITS(parentId, title, description, view) VALUES(2, "get Baked Bread", "", "${sqlBuilder.fromJSON({type: 'goal-view'})}");
        INSERT INTO T_STRUCTURE_UNITS(parentId, title, description, view) VALUES(2, "get Baked Bread", "", "${sqlBuilder.fromJSON({type: 'goal-view'})}");
        INSERT INTO T_STRUCTURE_UNITS(parentId, title, description, view) VALUES(2, "get Baked Bread", "", "${sqlBuilder.fromJSON({type: 'goal-view'})}");
        INSERT INTO T_STRUCTURE_UNITS(parentId, title, description, view) VALUES(2, "get Baked Bread", "", "${sqlBuilder.fromJSON({type: 'goal-view'})}");
        INSERT INTO T_STRUCTURE_UNITS(parentId, title, description, view) VALUES(2, "get Baked Bread", "", "${sqlBuilder.fromJSON({type: 'goal-view'})}");
    `);

    await sqlWorker.execute(`
        INSERT INTO T_STRUCTURE_UNITS(parentId, title, description, view) VALUES(9, "get Baked Bread", "", "${sqlBuilder.fromJSON({type: 'goal-view'})}");
        INSERT INTO T_STRUCTURE_UNITS(parentId, title, description, view) VALUES(9, "get Baked Bread", "some description", "${sqlBuilder.fromJSON({type: 'goal-view'})}");
        INSERT INTO T_STRUCTURE_UNITS(parentId, title, description, view) VALUES(9, "get Baked Bread", "some loooooooooooooooooooooooooooong description", "${sqlBuilder.fromJSON({type: 'goal-view'})}");
        INSERT INTO T_STRUCTURE_UNITS(parentId, title, description, view) VALUES(9, "get Baked Bread", "", "${sqlBuilder.fromJSON({type: 'goal-view'})}");
        INSERT INTO T_STRUCTURE_UNITS(parentId, title, description, view) VALUES(9, "get Baked Bread", "", "${sqlBuilder.fromJSON({type: 'goal-view'})}");
        INSERT INTO T_STRUCTURE_UNITS(parentId, title, description, view) VALUES(9, "get Baked Bread", "", "${sqlBuilder.fromJSON({type: 'goal-view'})}");
        INSERT INTO T_STRUCTURE_UNITS(parentId, title, description, view) VALUES(9, "get Baked Bread", "", "${sqlBuilder.fromJSON({type: 'goal-view'})}");
        INSERT INTO T_STRUCTURE_UNITS(parentId, title, description, view) VALUES(9, "get Baked Bread", "", "${sqlBuilder.fromJSON({type: 'goal-view'})}");
        INSERT INTO T_STRUCTURE_UNITS(parentId, title, description, view) VALUES(9, "get Baked Bread", "", "${sqlBuilder.fromJSON({type: 'goal-view'})}");
        INSERT INTO T_STRUCTURE_UNITS(parentId, title, description, view) VALUES(9, "get Baked Bread", "", "${sqlBuilder.fromJSON({type: 'goal-view'})}");
        INSERT INTO T_STRUCTURE_UNITS(parentId, title, description, view) VALUES(9, "get Baked Bread", "", "${sqlBuilder.fromJSON({type: 'goal-view'})}");
        INSERT INTO T_STRUCTURE_UNITS(parentId, title, description, view) VALUES(9, "get Baked Bread", "", "${sqlBuilder.fromJSON({type: 'goal-view'})}");
        INSERT INTO T_STRUCTURE_UNITS(parentId, title, description, view) VALUES(9, "get Baked Bread", "", "${sqlBuilder.fromJSON({type: 'goal-view'})}");
        INSERT INTO T_STRUCTURE_UNITS(parentId, title, description, view) VALUES(9, "get Baked Bread", "", "${sqlBuilder.fromJSON({type: 'goal-view'})}");
    `);

    await sqlWorker.execute(`
        ${[
            'tabs-view',
            'list-view',
            'goal-view',
            'resource-view',
            'tool-view',
            'process-view'
        ].map((type) => `
            INSERT INTO T_STRUCTURE_UNITS(parentId, title, description, view) VALUES(2, "$${type}$", "#${type}#", "${sqlBuilder.fromJSON({type})}");
        `).join('')}
    `);

    await sqlWorker.execute(`
        ${[
            'tabs-view',
            'list-view',
            'goal-view',
            'resource-view',
            'tool-view',
            'process-view'
        ].map((type) => `
            INSERT INTO T_STRUCTURE_UNITS(parentId, title, description, view) VALUES(9, "$${type}$", "#${type}#", "${sqlBuilder.fromJSON({type})}");
        `).join('')}
    `);

    await sqlWorker.execute(`
        ${[
            'tabs-view',
            'list-view',
            'goal-view',
            'resource-view',
            'tool-view',
            'process-view'
        ].map((type) => `INSERT INTO T_STRUCTURE_UNITS(parentId, title, description, view) VALUES(1, "$${type}$", "#${type}#", "${sqlBuilder.fromJSON({type})}");`).join('')}
    `);

    await sqlWorker.execute(new Array(20).fill(null).map((value, index) => `INSERT INTO T_STRUCTURE_UNITS(parentId, title, description, view) VALUES(44, "get Baked Bread ${index}", "", "${sqlBuilder.fromJSON({type: 'goal-view'})}");`).join(''));

    await sqlWorker.execute(new Array(20).fill(null).map((value, index) => `INSERT INTO T_STRUCTURE_UNITS(parentId, title, description, view) VALUES(45, "get Baked Bread ${index}", "", "${sqlBuilder.fromJSON({type: 'goal-view'})}");`).join(''));

    require('app/actions/structure-units-actions').default.fetchStructureUnits();
})();
