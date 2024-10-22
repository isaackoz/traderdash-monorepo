<script lang="ts">
	import { BitcoinIcon, Loader2Icon } from 'lucide-svelte';
	import { CardContent, CardFooter } from '../ui/card';
	import { Button } from '../ui/button';
	import { Input } from '../ui/input';
	import { Label } from '../ui/label';
	import type { InputConstraint } from 'sveltekit-superforms';
	import debounce from '$lib/utils/debounce';
	import { checkUsernameSchema } from '$lib/schemas/user';
	import type { ZodError } from 'zod';
	import { checkUsername } from '$lib/api/user/check-username';
	import { cn } from '$lib/utils';

	let {
		nextStep,
		username = $bindable()
	}: {
		nextStep: () => void;
		username: string;
	} = $props();

	let usernameInput = $state('');
	let errors = $state<ZodError['issues']>([]);
	let isLoading = $state(false);

	const checkUsernameVal = async () => {
		try {
			isLoading = true;
			const { data, success, error } = checkUsernameSchema.safeParse(usernameInput);
			if (success) {
				// Check on server
				const res = await checkUsername(data);
				console.log(res);
				if (res.isAvailable) {
					errors = [];
					username = data;
				} else {
					username = '';
					errors = [
						{ path: ['username'], code: 'custom', message: 'This username is not available' }
					];
				}
			} else {
				errors = error.issues;
				username = '';
			}
		} catch {
			errors = [{ path: ['username'], code: 'custom', message: 'Unknown server error occured' }];
			username = '';
		} finally {
			isLoading = false;
		}
	};

	const checkUserDebounced = debounce(300, checkUsernameVal);
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
		<Label
			for="username"
			class={cn(
				'mb-1 flex space-x-2 text-base font-semibold',
				!username ? 'text-red-500' : 'text-green-500'
			)}
		>
			<span> Choose your username </span>
			{#if isLoading}
				<div class="animate-spin">
					<Loader2Icon />
				</div>
			{/if}
		</Label>
		<Input
			id="username"
			placeholder="Bogdanoff..."
			bind:value={usernameInput}
			oninput={checkUserDebounced}
			autocomplete={'off'}
		/>
		{#if errors}
			<p class="text-sm text-red-500">{errors[0]?.message}</p>
		{/if}
	</div>
</CardContent>
<CardFooter class="mt-2">
	<Button class="w-full" onclick={nextStep} disabled={!username || isLoading}>Next</Button>
</CardFooter>
