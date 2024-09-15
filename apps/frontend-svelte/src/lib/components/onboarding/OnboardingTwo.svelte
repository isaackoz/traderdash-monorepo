<script lang="ts">
	import { BitcoinIcon } from 'lucide-svelte';
	import { CardContent, CardFooter } from '../ui/card';
	import { Button } from '../ui/button';
	import { Input } from '../ui/input';
	import { Label } from '../ui/label';
	import { checkUsername } from '$lib/api/user/check-username';
	import type { InputConstraint } from 'sveltekit-superforms';

	let {
		nextStep,
		value = $bindable(),
		constraints = undefined,
		errors = undefined,
		label = undefined
	}: {
		nextStep: () => void;
		value: string | undefined;
		label: string | undefined;
		errors: string[] | undefined;
		constraints: InputConstraint | undefined;
	} = $props();
</script>

<CardContent>
	<p class="text-sm">
		TraderDash offers a community where you can share your trades and insights with fellow traders.
		You can also follow others to stay updated on their trading activities. <br /> <br />
		All of your trades and personal information remain private by default unless you choose to share
		them.
		<br /><br />
		To get started, please choose a unique username. This will be your identity in the TraderDash community,
		visible to other traders when you share trades or follow them.
	</p>
	<div class="mt-8">
		<Label for="username" class="text-base font-semibold">Choose your username</Label>
		<Input id="username" placeholder="Bogdanoff..." bind:value />
		<button
			onclick={async () => {
				if (!value) return;
				console.log(await checkUsername(value));
			}}
		>
			Check username
		</button>
	</div>
</CardContent>
<CardFooter class="mt-2">
	<Button class="w-full" onclick={nextStep}>Next</Button>
</CardFooter>
