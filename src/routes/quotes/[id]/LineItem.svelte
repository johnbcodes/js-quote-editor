<script>
	import toast from 'svelte-hot-french-toast';
	import { enhance } from '$app/forms';
	import { page } from '$app/stores';
	import { isInvalid } from '$lib/errors.js';

	let { lineItem, form } = $props();

	let editing = $state(false);

	const currenyFormatter = new Intl.NumberFormat('en-US', {
		style: 'currency',
		currency: 'USD'
	});

	async function submitUpdate() {
		return async ({ update }) => {
			await update();
			if ($page.status === 204) {
				editing = false;
				toast.success('Item was successfully updated.');
			}
		};
	}

	async function submitDelete() {
		return async ({ update }) => {
			await update();
			if ($page.status === 204) {
				editing = false;
				toast.success('Item was successfully deleted.');
			}
		};
	}
</script>

{#if !editing}
	<div class="mb-3 flex flex-wrap items-start gap-2 rounded-md bg-white p-2">
		<div class="mb-0 flex-1 font-bold">
			{lineItem.name}
			<div class="m-w-100 basis-full text-[0.875rem] font-normal text-[hsl(0,1%,44%)]">
				{lineItem.description}
			</div>
		</div>
		<div class="display-[revert] mb-0 flex-[0_0_7rem]">
			{lineItem.quantity}
		</div>
		<div class="display-[revert] mb-0 flex-[0_0_9rem]">
			{currenyFormatter.format(lineItem.unitPrice)}
		</div>
		<div class="order-[revert] flex flex-[0_0_10rem] gap-2">
			<form method="POST" action="?/deleteItem" use:enhance={submitDelete}>
				<input name="id" type="hidden" value={lineItem.id} />
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
		action="?/updateItem"
		class="mb-3 flex flex-wrap items-start gap-2 rounded-md bg-white p-2"
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
		<input name="id" type="hidden" value={lineItem.id} />
		<div class="mb-0 flex-1 font-bold">
			<input
				name="name"
				,
				class="form-input aria-invalid:border-primary"
				placeholder="Name of your item"
				required
				type="text"
				aria-invalid={isInvalid(form?.errors?.name)}
				value={lineItem.name}
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
				value={lineItem.quantity}
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
				value={lineItem.unitPrice}
			/>
		</div>
		<div class="m-w-100 order-2 mb-0 basis-full text-[0.875rem] font-normal text-[hsl(0,1%,44%)]">
			<textarea
				name="description"
				class="form-input resize-none"
				placeholder="Description (optional)">{lineItem.description}</textarea
			>
		</div>
		<button
			class="button button-light"
			onclick={() => {
				editing = false;
				form = undefined;
			}}>Cancel</button
		>
		<input name="commit" type="submit" value="Update item" class="button button-secondary" />
	</form>
{/if}
