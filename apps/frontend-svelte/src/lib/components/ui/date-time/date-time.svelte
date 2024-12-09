<script lang="ts">
	import type { WithoutChildrenOrChild } from 'bits-ui';
	import flatpickr from 'flatpickr';
	import 'flatpickr/dist/themes/dark.css';
	import { onMount } from 'svelte';
	import { Input } from '../input';

	let {
		value = $bindable(),
		minDate
	}: {
		minDate?: string;
		value: number;
	} = $props();

	let ref = $state<HTMLInputElement | null>(null);

	let isMounted = $state(false);

	onMount(() => {
		if (!ref) return;
		flatpickr(ref, {
			enableTime: true,
			allowInput: true,
			clickOpens: true,
			minDate: minDate
		});

		isMounted = true;
	});
</script>

<Input bind:ref disabled={!isMounted} />
