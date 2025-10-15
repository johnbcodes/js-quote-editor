<script>
	import toast from 'svelte-hot-french-toast';
	import { enhance } from '$app/forms';
	import { page } from '$app/stores';
	import { isInvalid } from '$lib/errors.js';
	import Quote from './Quote.svelte';

	let { data, form } = $props();

	let creating = $state(false);

	async function submitCreate() {
		return async ({ update }) => {
			await update();
			if ($page.status === 204) {
				creating = false;
				toast.success('Quote was successfully created.');
			}
		};
	}
</script>

<main id="container" class="mx-auto my-0 w-full max-w-[60rem] px-4 py-0">
	<div id="header" class="mt-4 mb-8 flex flex-wrap justify-between gap-3">
		<h1 class="text-header m-0 box-border p-0 text-[2rem]/[1.1] font-bold">Quotes</h1>
		<button
			type="button"
			class="button button-prime"
			onclick={() => {
				creating = true;
				form = undefined;
			}}>Add quote</button
		>
	</div>

	<div id="quotes">
		{#if creating}
			<form
				method="POST"
				action="?/create"
				class="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-md bg-white px-4 py-2 shadow-[1px_3px_6px_hsl(0,0%,0%,0.1)]"
				autocomplete="off"
				novalidate
				accept-charset="UTF-8"
				use:enhance={submitCreate}
			>
				{#if form?.error}
					<div class="bg-primary-bg text-primary w-full rounded-md p-2">
						{#each form.errors.all as error (error.id)}
							<p>{error}</p>
						{/each}
					</div>
				{/if}
				<div class="[flex:1]">
					<label class="visually-hidden" for="quote_name">Name</label>
					<input
						id="quote_name"
						name="name"
						class="form-input aria-invalid:border-primary"
						placeholder="Name of your quote"
						aria-invalid={isInvalid(form?.errors?.name)}
						type="text"
					/>
				</div>
				<button
					class="button button-light"
					onclick={() => {
						creating = false;
					}}>Cancel</button
				>
				<input name="commit" type="submit" value="Create quote" class="button button-secondary" />
			</form>
		{/if}
		{#if data.quotes.length}
			{#each data.quotes as quote (quote.id)}
				<Quote {quote} {form} />
			{/each}
		{:else}
			<div
				id="quotes_empty"
				class="hidden border-2 border-dashed border-[hsl(0,6%,93%)] p-4 text-center only:[display:revert]"
			>
				<p class="text-header mb-6 [font-size:1.125rem] font-bold">
					You don't have any quotes yet!
				</p>
				<button
					type="button"
					class="button button-prime"
					onclick={() => {
						creating = true;
						form = undefined;
					}}>Add quote</button
				>
			</div>
		{/if}
	</div>
</main>
