<script>
	import Birthday from './Birthday.svelte';
	import BirthdayForm from './BirthdayForm.svelte';
	import NextBirthday from './NextBirthday.svelte';
	import { birthdays } from '../../stores/birthdays.js';

	export let data;
	export let form = undefined;

	$: birthdays.set(data.birthdays);

	let editing = form?.id ? form : null;
</script>

<h1>Birthday list</h1>
<NextBirthday />
<ol>
	{#each data.birthdays as birthday}
		<li>
			{#if editing?.id === birthday.id}
				<BirthdayForm
					form={editing}
					on:cancel={() => (editing = null)}
				/>
			{:else}
				<Birthday
					name={birthday.name}
					dob={birthday.dob}
				/>
			{/if}
			{#if !editing}
				<button on:click={() => (editing = birthday)}
					>Edit</button
				>
			{/if}
		</li>
	{/each}
</ol>

{#if !editing}
	<h1>Add a new birthday</h1>
	<div>
		<BirthdayForm {form} />
	</div>
{/if}

<style>
	ol {
		list-style-type: none;
		padding-left: 0;
	}

	li,
	div {
		padding: 10px;
		margin: 5px;
		border: 1px solid #ccc;
		border-radius: 2px;
	}
</style>
