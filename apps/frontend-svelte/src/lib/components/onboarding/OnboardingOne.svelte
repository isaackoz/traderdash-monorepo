<script lang="ts">
	import { BitcoinIcon } from 'lucide-svelte';
	import { CardContent, CardFooter } from '../ui/card';
	import { Button } from '../ui/button';

	const { nextStep }: { nextStep: () => void } = $props();
</script>

<CardContent>
	<div class="grid w-full grid-cols-3 gap-x-2 text-sm">
		<div class="flex flex-col items-center">
			<BitcoinIcon class="size-10" />
			<p>Multiple Currencies</p>
		</div>
		<div class="flex flex-col items-center">
			<BitcoinIcon class="size-10" />
			<p>Real-time updates</p>
		</div>
		<div class="flex flex-col items-center">
			<BitcoinIcon class="size-10" />
			<p>Secure Wallet</p>
		</div>
	</div>
	<div class="mt-8">
		<h4 class="text-xl font-semibold">Welcome to TraderDash.app</h4>
		<p class="mt-2 text-sm text-primary/90">
			TraderDash is your all-in-one platform for tracking your trades across multiple exchanges and
			currencies. TraderDash was made by traders for traders. With that in mind, we know that
			tracking and analyzing trades is something that nobody wants to do manually. Our goal is for
			you to be able to track your trades automatically.
		</p>
	</div>
</CardContent>
<CardFooter class="mt-8">
	<Button class="w-full" onclick={nextStep}>Next</Button>
</CardFooter>
