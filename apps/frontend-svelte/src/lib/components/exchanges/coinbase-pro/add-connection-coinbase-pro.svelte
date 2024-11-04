<script lang="ts">
	import AddConnectionWrapper from '$lib/components/shared/add-connection/add-connection-wrapper.svelte';
	import {
		Card,
		CardContent,
		CardDescription,
		CardHeader,
		CardTitle
	} from '$lib/components/ui/card';
	import { Input } from '$lib/components/ui/input';
</script>

<AddConnectionWrapper>
	<Card>
		<CardHeader>
			<CardTitle>General</CardTitle>
			<CardDescription
				>To retrieve your API key, please refer to the official <a
					class="text-blue-500 underline"
					href="https://help.coinbase.com/en/exchange/managing-my-account/how-to-create-an-api-key"
					target="_blank"
					referrerpolicy="no-referrer">Coinbase documentation</a
				></CardDescription
			>
		</CardHeader>
		<CardContent>
			<div>
				<Input placeholder="My Coinbase Pro Connection..." />
				<Input placeholder="" />
			</div>
		</CardContent>
	</Card>
	<Card>
		<CardHeader>
			<CardTitle>API Key</CardTitle>
			<CardDescription
				>To retrieve your API key, please refer to the official <a
					class="text-blue-500 underline"
					href="https://help.coinbase.com/en/exchange/managing-my-account/how-to-create-an-api-key"
					target="_blank"
					referrerpolicy="no-referrer">Coinbase documentation</a
				></CardDescription
			>
		</CardHeader>
		<CardContent>
			<div>dd coinbase pro foArm</div>
		</CardContent>
	</Card>
	<Card>
		<CardHeader>
			<CardTitle>Options</CardTitle>
			<CardDescription
				>To retrieve your API key, please refer to the official <a
					class="text-blue-500 underline"
					href="https://help.coinbase.com/en/exchange/managing-my-account/how-to-create-an-api-key"
					target="_blank"
					referrerpolicy="no-referrer">Coinbase documentation</a
				></CardDescription
			>
		</CardHeader>
		<CardContent>
			<div>dd coinbase pro foArm</div>
		</CardContent>
	</Card>
</AddConnectionWrapper>
