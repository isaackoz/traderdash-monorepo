<script lang="ts">
	import { goto, invalidateAll } from '$app/navigation';
	import { completeOnboarding } from '$lib/api/user/complete-onboarding';
	import { cn } from '$lib/utils';
	import { redirect } from '@sveltejs/kit';
	import { Button } from '../ui/button';
	import { CardContent, CardFooter } from '../ui/card';
	import { Checkbox } from '../ui/checkbox';
	import { Label } from '../ui/label';
	import { toast } from 'svelte-sonner';

	let agree = $state<boolean | 'indeterminate' | undefined>(false);
	let isLoading = $state(false);
	let error = $state<string | null>(null);

	let { username }: { username: string } = $props();

	const handleFinish = async () => {
		try {
			isLoading = true;
			const res = await completeOnboarding(username);
			if (res.success) {
				await invalidateAll();
				goto('/home/');
			} else {
				toast.error(res.message);
			}
		} catch {
			error = 'Unknown error occured. Try again later.';
		} finally {
			isLoading = false;
		}
	};
</script>

<CardContent>
	<p class="text-sm">
		While TraderDash aims to provide accurate and up-to-date pricing data, we cannot guarantee the
		precision of this information. It is your responsibility to double-check prices before making
		any decisions. <br /> <br />By using TraderDash, you agree to our Terms and Conditions and
		acknowledge that TraderDash is not liable for any financial losses or gains that may result from
		your use of the platform.
	</p>
</CardContent>
<CardFooter class="flex flex-col space-y-4">
	<div class="flex w-full items-center space-x-2 text-sm">
		<Checkbox id="agree" bind:checked={agree} />
		<Label for="agree" class={cn('hover:cursor-pointer', agree !== true && 'text-red-500')}
			>I agree to the terms above</Label
		>
	</div>
	<Button class="w-full" disabled={agree !== true || isLoading} type="button" onclick={handleFinish}
		>Finish</Button
	>
</CardFooter>
