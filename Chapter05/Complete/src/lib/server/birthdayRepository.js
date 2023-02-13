let db = [];

export const addNew = (item) => db.push(item);

export const getAll = () => Array.from(db);

export const clear = () => (db = []);
