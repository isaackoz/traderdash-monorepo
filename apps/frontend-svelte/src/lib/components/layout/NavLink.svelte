<script lang="ts">
	import type { TNavLinkParent } from '../../../types/ui/NavLink';
	import * as Collapsible from '$lib/components/ui/collapsible';
	import { buttonVariants } from '$lib/components/ui/button';
	import { cn } from '$lib/utils';
	import { ChevronDown } from 'lucide-svelte';
	import Button from '../ui/button/button.svelte';

	const { parent, children }: TNavLinkParent = $props();

	let collapsibleOpen = $state(false);
</script>

{#if children && children.length > 0}
	<Collapsible.Root open={collapsibleOpen} onOpenChange={(v) => (collapsibleOpen = v)}>
		<Collapsible.Trigger class="w-full">
			<div class={cn(buttonVariants({ variant: 'ghost' }), 'w-full justify-between')}>
				<div class="flex items-center">
					<div class="w-8">
						<parent.icon class="size-6" />
					</div>
					<span>
						{parent.label}
					</span>
				</div>
				<div class={cn(collapsibleOpen ? '-rotate-180' : '', 'transition-transform')}>
					<ChevronDown />
				</div>
			</div>
		</Collapsible.Trigger>
		<Collapsible.Content class="border-primary/40 ml-10 mt-2 border-l">
			{#each children as child}
				<Button variant="link" href={child.href} class="w-full justify-start">
					{child.label}
				</Button>
			{/each}
		</Collapsible.Content>
	</Collapsible.Root>
{:else if parent && !children}
	<Button class="flex w-full items-center justify-start" variant="ghost" href={parent.href}>
		<div class="w-8">
			<parent.icon class="size-6" />
		</div>
		<span>
			{parent.label}
		</span>
	</Button>
{/if}
