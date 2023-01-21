import { randomUUID } from 'crypto';

let db = [];

export const addNew = (item) =>
	db.push({ ...item, id: randomUUID() });

export const getAll = () => Array.from(db);

export const clear = () => (db = []);
