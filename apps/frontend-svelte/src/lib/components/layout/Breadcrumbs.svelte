<script lang="ts">
	import { page } from '$app/stores';
	import * as Breadcrumb from '$lib/components/ui/breadcrumb/index.js';
	import { cn } from '$lib/utils';
	const breadcrumbs: Array<{
		label: string;
		href: string;
		isActive?: boolean;
	}> = $derived.by(() => {
		if (($page?.data?.labels ?? []).length > 0) {
			return $page.data.labels!.map((label, index) => {
				return {
					label: label.title,
					href: label.href,
					isActive: label.active
				};
			});
		}

		const tokens = $page.url.pathname
			.split('/')
			.filter((t) => t !== '')
			.filter((t) => t !== 'home');
		let tokenPath = '';
		return tokens.map((t) => {
			tokenPath += '/' + t;
			t = t.charAt(0).toUpperCase() + t.slice(1);
			return {
				label: $page.data.label || t,
				href: tokenPath
			};
		});
	});
</script>

<Breadcrumb.Root>
	<Breadcrumb.List>
		<Breadcrumb.Item>
			<Breadcrumb.Link href="/home/">Home</Breadcrumb.Link>
		</Breadcrumb.Item>
		{#each breadcrumbs as crumb}
			{#if $page.data.showBreadcrumb}
				<Breadcrumb.Separator />
				<Breadcrumb.Item>
					<Breadcrumb.Link href={crumb.href} class={cn(crumb.isActive && 'font-bold')}>
						{crumb.label}
					</Breadcrumb.Link>
				</Breadcrumb.Item>
			{/if}
		{/each}
	</Breadcrumb.List>
</Breadcrumb.Root>
