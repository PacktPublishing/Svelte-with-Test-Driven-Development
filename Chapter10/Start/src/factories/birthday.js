export const createBirthday = (
	name,
	dob,
	extra = {}
) => ({
	name,
	dob,
	...extra
});
