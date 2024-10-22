<script lang="ts">
	import { checkUsername } from '$lib/api/user/check-username';
	import OnboardingOne from '$lib/components/onboarding/OnboardingOne.svelte';
	import OnboardingTwo from '$lib/components/onboarding/OnboardingTwo.svelte';

	import {
		Card,
		CardContent,
		CardDescription,
		CardFooter,
		CardHeader,
		CardTitle
	} from '$lib/components/ui/card';

	import { BitcoinIcon, ArrowLeft } from 'lucide-svelte';

	import OnboardingThree from '$lib/components/onboarding/OnboardingThree.svelte';

	let step = $state<'1' | '2' | '3'>('1');
	let username = $state<string>('');
</script>

<div class="mx-auto flex min-h-[calc(100dvh-3.5rem)] w-full max-w-lg items-center">
	<Card class="relative w-full">
		{#if step !== '1'}
			<button
				class="absolute left-4 top-4 hover:cursor-pointer"
				onclick={() => {
					step === '2' ? (step = '1') : (step = '2');
				}}
			>
				<ArrowLeft class="size-8" />
			</button>
		{/if}
		<CardHeader>
			<CardTitle class="text-center text-3xl">TraderDash.app</CardTitle>
			<CardDescription class="text-center">Track your trades like a pro</CardDescription>
		</CardHeader>
		{#if step === '1'}
			<OnboardingOne nextStep={() => (step = '2')} />
		{:else if step === '2'}
			<OnboardingTwo nextStep={() => (step = '3')} bind:username />
		{:else if step === '3'}
			<OnboardingThree {username} />
		{/if}
	</Card>
</div>
