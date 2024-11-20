<script>
	import { Toaster } from 'svelte-hot-french-toast';
	import '../app.css';
	let { children } = $props();
</script>

<header class="mb-10 flex items-center bg-white px-4 py-2 shadow-[2px_4px_10px_hsl(0,0%,0%,0.1)]">
	<div class="text-xl/[1.5] font-bold text-header">ABC Corp</div>
	<div class="ml-auto mr-3 font-bold text-header">Accountant</div>
	<button type="button" class="button button-dark">Sign out</button>
</header>

<Toaster />

{@render children()}
