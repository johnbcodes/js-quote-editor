<script>
	import toast from 'svelte-hot-french-toast';
	import { enhance } from '$app/forms';
	import { page } from '$app/stores';
	import { isInvalid } from '$lib/errors.js';
	import LineItemDate from './LineItemDate.svelte';

	const currenyFormatter = new Intl.NumberFormat('en-US', {
		style: 'currency',
		currency: 'USD'
	});

	let { data, form } = $props();

	let creating = $state(false);

	async function submitCreate() {
		return async ({ update }) => {
			await update();
			if ($page.status === 204) {
				creating = false;
				toast.success('Date was successfully created.');
			}
		};
	}
</script>

<main id="container" class="mx-auto my-0 mb-16 w-full max-w-[60rem] px-4 py-0">
	<a href="/quotes">← Back to quotes</a>
	<div class="mb-8 mt-4 flex flex-wrap justify-between gap-3">
		<h1 class="m-0 p-0 text-[2rem]/[1.1] font-bold text-header">
			{data.quote.name}
		</h1>
		<button
			type="button"
			class="button button-prime"
			onclick={() => {
				creating = true;
				form = undefined;
			}}>New date</button
		>
	</div>

	<div>
		{#if creating}
			<form
				method="POST"
				action="?/createDate"
				class="mb-1.5 mt-8 flex flex-wrap items-center justify-between gap-2"
				autocomplete="off"
				novalidate
				accept-charset="UTF-8"
				use:enhance={submitCreate}
			>
				{#if form?.error}
					<div class="w-full rounded-md bg-primary-bg p-2 text-primary">
						{#each form.errors.all as error}
							<p>{error}</p>
						{/each}
					</div>
				{/if}
				<input name="quoteId" type="hidden" value={data.quote.id} />
				<div class="[flex:1]">
					<label class="visually-hidden" for="line_item_date_date">Date</label>
					<input
						name="date"
						class="form-input aria-invalid:border-primary"
						required
						aria-invalid={isInvalid(form?.errors?.date)}
						type="date"
					/>
				</div>
				<button
					class="button button-light"
					onclick={() => {
						creating = false;
					}}>Cancel</button
				>
				<input name="commit" type="submit" value="Create date" class="button button-secondary" />
			</form>
		{/if}
	</div>

	<div>
		{#each data.quote.lineItemDates as lineItemDate (lineItemDate.id)}
			<LineItemDate {lineItemDate} {form} />
		{/each}
	</div>
</main>
<footer
	class="fixed bottom-0 w-full bg-white py-4 text-[1.25rem] font-bold shadow-[2px_4px_10px_hsl(0,0%,0%,0.1)]"
>
	<div class="mx-auto flex w-full max-w-[60rem] items-center justify-between px-4">
		<div>Total:</div>
		<div>{currenyFormatter.format(data.total)}</div>
	</div>
</footer>
