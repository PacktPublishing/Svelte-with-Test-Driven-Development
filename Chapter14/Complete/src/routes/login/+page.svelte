<script>
	import {
		signIn,
		signOut
	} from '@auth/sveltekit/client';
	import { page } from '$app/stores';

	export let data = {};
</script>

<h1>Please login</h1>
<p>
	{#if $page.data.session}
		{#if $page.data.session.user?.image}
			<span
				style="background-image: url('{$page.data
					.session.user.image}')"
				class="avatar"
			/>
		{/if}
		<span class="signedInText">
			<small>Signed in as</small><br />
			<strong
				>{$page.data.session.user?.name ??
					'User'}</strong
			>
		</span>
		<button on:click={() => signOut()} class="button"
			>Sign out</button
		>
	{:else}
		<span class="notSignedInText"
			>You are not signed in</span
		>
		{#each data.providers as authProvider}
			<button
				on:click={() =>
					signIn(authProvider, {
						callbackUrl: '/birthdays'
					})}>Sign in with {authProvider}</button
			>
		{/each}
	{/if}
</p>
