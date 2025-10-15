<script>
	import toast from 'svelte-hot-french-toast';
	import { enhance } from '$app/forms';
	import { page } from '$app/stores';
	import { isInvalid } from '$lib/errors.js';

	let { quote, form } = $props();

	let editing = $state(false);

	async function submitUpdate() {
		return async ({ update }) => {
			await update();
			if ($page.status === 204) {
				editing = false;
				toast.success('Quote was successfully updated.');
			}
		};
	}

	async function submitDelete() {
		return async ({ update }) => {
			await update();
			if ($page.status === 204) {
				editing = false;
				toast.success('Quote was successfully deleted.');
			}
		};
	}
</script>

<div id={quote.id}>
	{#if !editing}
		<div
			class="mb-4 flex items-center justify-between gap-3 rounded-md bg-white px-4 py-2 shadow-[1px_3px_6px_hsl(0,0%,0%,0.1)]"
		>
			<a href="/quotes/{quote.id}">{quote.name}</a>
			<div class="flex flex-auto shrink-0 grow-0 gap-2 self-start">
				<form method="POST" action="?/delete" use:enhance={submitDelete}>
					<input type="hidden" name="id" value={quote.id} />
					<button class="button button-light">Delete</button>
				</form>
				<button
					type="button"
					class="button button-light"
					onclick={() => {
						editing = true;
						form = undefined;
					}}>Edit</button
				>
			</div>
		</div>
	{:else}
		<form
			method="POST"
			action="?/update"
			class="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-md bg-white px-4 py-2 shadow-[1px_3px_6px_hsl(0,0%,0%,0.1)]"
			autocomplete="off"
			novalidate
			accept-charset="UTF-8"
			use:enhance={submitUpdate}
		>
			{#if form?.error}
				<div class="bg-primary-bg text-primary w-full rounded-md p-2">
					{#each form.errors.all as error}
						<p>{error}</p>
					{/each}
				</div>
			{/if}
			<div class="[flex:1]">
				<input id="quote_id" name="id" type="hidden" value={quote.id} />
				<label class="visually-hidden" for="quote_name">Name</label>
				<input
					id="quote_name"
					name="name"
					class="form-input aria-invalid:border-primary"
					placeholder="Name of your quote"
					type="text"
					aria-invalid={isInvalid(form?.errors?.name)}
					value={quote.name}
				/>
			</div>
			<button
				class="button button-light"
				onclick={() => {
					editing = false;
					form = undefined;
				}}>Cancel</button
			>
			<input name="commit" type="submit" value="Update quote" class="button button-secondary" />
		</form>
	{/if}
</div>
