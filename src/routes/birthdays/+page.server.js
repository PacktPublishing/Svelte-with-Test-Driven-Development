const db = [];

const addNew = (item) => db.push(item);

addNew({ name: 'Hercules', dob: '1994-02-02' });
addNew({ name: 'Athena', dob: '1989-01-01' });

export const load = () => ({
	birthdays: Array.from(db)
});
