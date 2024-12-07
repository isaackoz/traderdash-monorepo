<script lang="ts">
	import type { HTMLInputAttributes } from 'svelte/elements';
	import type { WithElementRef } from 'bits-ui';
	import { cn } from '$lib/utils.js';
	import { Button } from '../button';
	import { EyeIcon } from 'lucide-svelte';

	let {
		ref = $bindable(null),
		value = $bindable(),
		class: className,
		isPassword,
		...restProps
	}: WithElementRef<HTMLInputAttributes> & { isPassword?: boolean } = $props();

	let isHidden = $state(true);
</script>

{#if isPassword}
	<div class="relative">
		<Button
			onclick={() => (isHidden = !isHidden)}
			variant="ghost"
			size="icon"
			class="absolute right-2 top-1/2 -translate-y-1/2"
		>
			<EyeIcon />
		</Button>
		<input
			bind:this={ref}
			class={cn(
				'border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-10 w-full rounded-md border px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
				className
			)}
			bind:value
			{...restProps}
			type={isHidden ? 'password' : 'text'}
		/>
	</div>
{:else}
	<input
		bind:this={ref}
		class={cn(
			'border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-10 w-full rounded-md border px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
			className
		)}
		bind:value
		{...restProps}
	/>
{/if}
