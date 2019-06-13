class SQLBuilder {
    static fromJSON(value) {
        return JSON.stringify(value).replace(/\x22/g, '/x22/');
    }
    static toJSON(value) {
        return JSON.parse(value.replace(/\/x22\//g, '\x22'));
    }
}

export default SQLBuilder;
