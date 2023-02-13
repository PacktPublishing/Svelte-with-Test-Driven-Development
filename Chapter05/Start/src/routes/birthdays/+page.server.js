const db = [];

const addNew = (item) => db.push(item);

addNew({ name: 'Hercules', dob: '1994-02-02' });
addNew({ name: 'Athena', dob: '1989-01-01' });

export const load = () => ({
	birthdays: Array.from(db)
});

export const actions = {
	default: async ({ request }) => {
		const data = await request.formData();
		addNew({
			name: data.get('name'),
			dob: data.get('dob')
		});
	}
};
