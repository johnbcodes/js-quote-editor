<script>
	import toast from 'svelte-hot-french-toast';
	import { enhance } from '$app/forms';
	import { page } from '$app/stores';
	import { isInvalid } from '$lib/errors.js';
	import LineItem from './LineItem.svelte';

	let { lineItemDate, form } = $props();

	let editingDate = $state(false);
	let creatingItem = $state(false);

	async function submitUpdate() {
		return async ({ update }) => {
			await update();
			if ($page.status === 204) {
				editingDate = false;
				toast.success('Date was successfully updated.');
			}
		};
	}

	async function submitDelete({ cancel }) {
		if (confirm('Are you sure?')) {
			return async ({ update }) => {
				await update();
				if ($page.status === 204) {
					editingDate = false;
					toast.success('Date was successfully deleted.');
				}
			};
		} else {
			cancel();
		}
	}

	async function submitCreate() {
		return async ({ update }) => {
			await update();
			if ($page.status === 204) {
				creatingItem = false;
				toast.success('Item was successfully created.');
			}
		};
	}
</script>

<div class="mt-8 mb-1.5">
	{#if !editingDate}
		<div class="flex items-center justify-between gap-2">
			<h2 class="text-[1.5rem] font-bold">
				{new Date(lineItemDate.date).toLocaleDateString('en-us', {
					timeZone: 'UTC',
					year: 'numeric',
					month: 'long',
					day: 'numeric'
				})}
			</h2>
			<div class="flex gap-2">
				<form method="POST" action="?/deleteDate" use:enhance={submitDelete}>
					<input name="id" type="hidden" value={lineItemDate.id} />
					<button class="button button-light">Delete</button>
				</form>
				<button
					type="button"
					class="button button-light"
					onclick={() => {
						editingDate = true;
						form = undefined;
					}}>Edit</button
				>
			</div>
		</div>
	{:else}
		<form
			method="POST"
			action="?/updateDate"
			class="mt-8 mb-1.5 flex flex-wrap items-center justify-between gap-2"
			autocomplete="off"
			novalidate
			accept-charset="UTF-8"
			use:enhance={submitUpdate}
		>
			{#if form?.error}
				<div class="bg-primary-bg text-primary w-full rounded-md p-2">
					{#each form.errors.all as error (error.id)}
						<p>{error}</p>
					{/each}
				</div>
			{/if}
			<div class="[flex:1]">
				<input name="id" type="hidden" value={lineItemDate.id} />
				<input
					name="date"
					class="form-input aria-invalid:border-primary"
					required
					type="date"
					aria-invalid={isInvalid(form?.errors?.date)}
					value={lineItemDate.date}
				/>
			</div>
			<button
				class="button button-light"
				onclick={() => {
					editingDate = false;
					form = undefined;
				}}>Cancel</button
			>
			<input name="commit" type="submit" value="Update date" class="button button-secondary" />
		</form>
	{/if}

	<div class="mt-2 rounded-md bg-white p-4 shadow-[1px_3px_6px_hsl(0,0%,0%,0.1)]">
		<div class="bg-light mb-3 flex flex-wrap items-start gap-2 rounded-md p-2">
			<div class="flex-1 text-[0.875rem] font-bold tracking-[1px] uppercase">Article</div>
			<div
				class="display-[revert] flex-[0_0_7rem] text-[0.875rem] font-bold tracking-[1px] uppercase"
			>
				Quantity
			</div>
			<div
				class="display-[revert] flex-[0_0_9rem] text-[0.875rem] font-bold tracking-[1px] uppercase"
			>
				Price
			</div>
			<div
				class="order-[revert] flex flex-[0_0_10rem] gap-2 text-[0.875rem] font-bold tracking-[1px] uppercase"
			></div>
		</div>

		{#each lineItemDate.lineItems as lineItem (lineItem.id)}
			<LineItem {lineItem} {form} />
		{/each}

		{#if creatingItem}
			<form
				method="POST"
				action="?/createItem"
				class="mb-3 flex flex-wrap items-start gap-2 rounded-md bg-white p-2"
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
				<input name="lineItemDateId" type="hidden" value={lineItemDate.id} />
				<div class="mb-0 flex-1 font-bold">
					<input
						name="name"
						,
						class="form-input aria-invalid:border-primary"
						placeholder="Name of your item"
						required
						type="text"
						aria-invalid={isInvalid(form?.errors?.name)}
					/>
				</div>
				<div class="mb-0 block flex-[0_0_7rem]">
					<input
						name="quantity"
						class="form-input aria-invalid:border-primary"
						placeholder="1"
						required,
						type="number"
						min="1"
						step="1"
						aria-invalid={isInvalid(form?.errors?.quantity)}
					/>
				</div>
				<div class="mb-0 block flex-[0_0_9rem]">
					<input
						name="unitPrice"
						class="form-input aria-invalid:border-primary"
						placeholder="$100.00"
						required
						type="number"
						min="0.01"
						step="0.01"
						aria-invalid={isInvalid(form?.errors?.unitPrice)}
					/>
				</div>
				<div
					class="m-w-100 order-2 mb-0 basis-full text-[0.875rem] font-normal text-[hsl(0,1%,44%)]"
				>
					<textarea
						name="description"
						class="form-input resize-none"
						placeholder="Description (optional)"
					></textarea>
				</div>
				<button
					class="button button-light"
					onclick={() => {
						creatingItem = false;
						form = undefined;
					}}>Cancel</button
				>
				<input name="commit" type="submit" value="Create item" class="button button-secondary" />
			</form>
		{/if}

		<div class="rounded-md border-2 border-dashed border-[hsl(0,6%,93%)] p-4 text-center">
			<button
				type="button"
				class="button button-prime"
				onclick={() => {
					creatingItem = true;
					form = undefined;
				}}>Add item</button
			>
		</div>
	</div>
</div>
