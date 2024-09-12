<script lang="ts">
	import Seo from '$lib/components/SEO.svelte';
	import { Button } from '$lib/components/ui/button';
	import {
		Card,
		CardDescription,
		CardFooter,
		CardHeader,
		CardTitle
	} from '$lib/components/ui/card';
</script>

<Seo title="Home" />

<main class="flex h-dvh w-full flex-col items-center justify-center">
	<div class="text-center">
		<h1 class="text-4xl font-bold">TraderDash.app</h1>
		<p>A cross-exchange, realtime trade journaling platform.</p>
	</div>
	<div class="mt-12">
		<p>Public beta available December 2024.</p>
	</div>
	<Card class="mt-8 max-w-xs">
		<CardHeader>
			<CardTitle>Join the Waitlist</CardTitle>
			<CardDescription>
				Get notified when we launch and tell us what features you would like to see
			</CardDescription>
			<CardFooter class="mt-4 w-full px-0 pt-4">
				<Button class="w-full" href="/waitlist">Join Waitlist</Button>
			</CardFooter>
		</CardHeader>
	</Card>
</main>
