import { randomUUID } from 'crypto';

const db = new Map();

export const addNew = (item) => {
	const id = randomUUID();
	db.set(id, { ...item, id });
};

export const getAll = () => Array.from(db.values());

export const clear = () => db.clear();
