<script>
	import { createEventDispatcher } from 'svelte';
	const dispatcher = createEventDispatcher();
	export let form;
</script>

<div data-testid="BirthdayForm">
	Editing {JSON.stringify(form)}

	<button on:click={() => dispatcher('cancel')} />
</div>
