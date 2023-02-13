import { randomUUID } from 'crypto';

const db = new Map();

export const addNew = (item) => {
	const validationResult = validate(item);
	if (validationResult) {
		return validationResult;
	}

	return set(randomUUID(), item);
};

export const getAll = () => Array.from(db.values());

export const clear = () => db.clear();

export const replace = (id, item) => {
	if (!has(id))
		return { error: 'An unknown ID was provided.' };

	const validationResult = validate(item);
	if (validationResult) {
		return validationResult;
	}

	return set(id, item);
};

export const has = (id) => db.has(id);

const validate = ({ name, dob }) => {
	if (empty(name)) {
		return { error: 'Please provide a name.' };
	}

	if (invalidDob(dob)) {
		return {
			error:
				'Please provide a date of birth in the YYYY-MM-DD format.'
		};
	}
};

const set = (id, item) => {
	const itemWithId = { ...item, id };
	db.set(id, itemWithId);
	return itemWithId;
};

const empty = (value) =>
	value === undefined ||
	value === null ||
	value.trim() === '';

const invalidDob = (dob) => isNaN(Date.parse(dob));
