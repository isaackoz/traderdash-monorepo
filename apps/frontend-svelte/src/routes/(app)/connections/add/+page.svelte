<script lang="ts">
	import ConnectionCard from '$lib/components/connections/ConnectionCard.svelte';
	import { Button } from '$lib/components/ui/button';
	import { Tabs, TabsContent, TabsList, TabsTrigger } from '$lib/components/ui/tabs';
	import { exchangeDetails } from '$lib/exchanges';
</script>

<div class="mx-auto max-w-screen-2xl p-8">
	<div class="flex items-center justify-between">
		<div>
			<h1 class="text-2xl font-bold">Add Connection</h1>
			<p class="text-primary/50 text-sm">
				Choose one of the supported exchanges below to connect your account. If you don't see your
				exchange below, either use the TraderDash connection to manually track your trades or please
				<a href="/request/" class="text-blue-500 underline underline-offset-4">send a request!</a>
				<br />
				You are able to add multiple of the same exchange. This is useful if you need to track separate
				accounts or profiles per exchange.
			</p>
		</div>
		<div></div>
	</div>
	<div class="mt-4">
		<Tabs value="crypto">
			<TabsList>
				<TabsTrigger value="crypto">Crypto</TabsTrigger>
				<TabsTrigger value="stocks" disabled>Stocks (coming soon)</TabsTrigger>
			</TabsList>
			<TabsContent value="crypto">
				<div class="mt-2 grid grid-cols-3 gap-4">
					{#each Object.entries(exchangeDetails) as [id, details]}
						<ConnectionCard
							{id}
							displayName={details.displayName}
							description={details.description}
							href={`/connections/add/${id}`}
						/>
					{/each}
				</div>
			</TabsContent>
		</Tabs>
	</div>
</div>
