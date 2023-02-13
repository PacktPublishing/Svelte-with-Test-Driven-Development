<script>
	import { birthdays } from '../../stores/birthdays.js';

	const currentDate = new Date();

	let nextBirthday = null;

	const toNextBirthdayTime = (dob) => {
		const birthdayThisYear = new Date(dob);
		birthdayThisYear.setFullYear(
			currentDate.getFullYear()
		);
		if (
			birthdayThisYear.getTime() >
			currentDate.getTime()
		) {
			return birthdayThisYear.getTime();
		} else {
			const birthdayNextYear = new Date(dob);
			birthdayNextYear.setFullYear(
				currentDate.getFullYear() + 1
			);
			return birthdayNextYear.getTime();
		}
	};

	const findNextBirthday = (birthdays) =>
		birthdays.reduce(
			({ nextBirthdayTime, who }, thisBirthday) => {
				const thisBirthdayTime = toNextBirthdayTime(
					thisBirthday.dob
				);
				if (
					nextBirthdayTime === null ||
					thisBirthdayTime < nextBirthdayTime
				) {
					return {
						nextBirthdayTime: thisBirthdayTime,
						who: thisBirthday
					};
				}
				return { nextBirthdayTime, who };
			},
			{ nextBirthdayTime: null, who: null }
		);

	const formatTime = (time) =>
		new Date(time).toISOString().substring(0, 10);

	$: nextBirthday = findNextBirthday($birthdays);
</script>

{#if nextBirthday.who}
	<strong>{nextBirthday.who.name}</strong> has the
	next birthday, on
	<strong
		>{formatTime(
			nextBirthday.nextBirthdayTime
		)}</strong
	>.
{/if}
