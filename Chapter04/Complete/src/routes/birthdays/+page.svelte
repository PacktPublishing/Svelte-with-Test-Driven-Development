<script>
	import Birthday from './Birthday.svelte';
	import BirthdayForm from './BirthdayForm.svelte';

	export let data;
</script>

<h1>Birthday list</h1>
<ol>
	{#each data.birthdays as birthday}
		<li>
			<Birthday {...birthday} />
		</li>
	{/each}
</ol>

<h1>Add a new birthday</h1>
<div>
	<BirthdayForm />
</div>

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
