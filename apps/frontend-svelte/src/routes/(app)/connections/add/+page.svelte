<script lang="ts">
	import ConnectionCard from '$lib/components/connections/ConnectionCard.svelte';
	import { Button } from '$lib/components/ui/button';
	import { Tabs, TabsContent, TabsList, TabsTrigger } from '$lib/components/ui/tabs';
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
	<div class="mt-10">
		<Tabs>
			<TabsList>
				<TabsTrigger value="crypto">Crypto</TabsTrigger>
				<TabsTrigger value="stocks" disabled>Stocks (coming soon)</TabsTrigger>
			</TabsList>
			<TabsContent value="crypto">
				<div class="mt-2 grid grid-cols-3 gap-4">
					<ConnectionCard
						href="/connections/add/traderdash/"
						displayName="TraderDash (Crypto)"
						id="traderdash"
						description="Use the TraderDash connection to manually input and track trades."
					/>
					<ConnectionCard
						href="/connections/add/coinbase/"
						displayName="Coinbase"
						id="coinbase"
						description="Connect your Coinbase account to automatically track your trades."
					/>
					<ConnectionCard
						href="/connections/add/kraken/"
						displayName="Kraken US"
						id="kraken"
						description="Connect your Kraken US account to automatically track your trades."
					/>
				</div>
			</TabsContent>
		</Tabs>
	</div>
</div>
