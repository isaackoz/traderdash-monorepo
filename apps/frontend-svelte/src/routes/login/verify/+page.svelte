<script lang="ts">
	import { browser } from '$app/environment';
	import { goto, invalidateAll } from '$app/navigation';
	import { handleMagicLinkClicked, isThisSameBrowserAndDevice } from '$lib/auth';
	import { Button } from '$lib/components/ui/button';
	import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '$lib/components/ui/card';
	import { Skeleton } from '$lib/components/ui/skeleton';
	import { onMount } from 'svelte';
	import { toast } from 'svelte-sonner';
	let isLoading = $state(true);
	let isSameDevice = $state<null | boolean>(null);
	let errorMsg = $state<null | string>(null);
	let status = $state<'success' | 'pending' | 'error' | null>(null);

	onMount(() => {
		void checkLink();
	});

	async function handleMagicLink() {
		try {
			isLoading = true;
			const res = await handleMagicLinkClicked();
			if (res.success) {
				toast.success('You have been logged in');
				await invalidateAll();
				goto('/home/');
			} else {
				errorMsg = res.reason;
				status = 'error';
			}
		} catch {
			errorMsg = 'An unknown error occured.';
			status = 'error';
		} finally {
			isLoading = false;
		}
	}

	async function checkLink() {
		try {
			isSameDevice = await isThisSameBrowserAndDevice();
			if (isSameDevice) {
				await handleMagicLink();
			} else {
				isLoading = false;
				status = 'pending';
			}
		} catch (e: unknown) {
			console.log(e);
			isLoading = false;
			status = 'error';
			errorMsg = 'Uh oh';
		}
	}
</script>

<div class="flex h-dvh w-full items-center justify-center">
	<Card class="w-[250px]">
		<CardHeader>
			<CardTitle>Magic Link Login</CardTitle>
		</CardHeader>
		<CardContent>
			{#if isLoading}
				<Skeleton class="h-14 w-full" />
			{:else if status === 'success'}
				<p>You have succesfully been logged in...</p>
			{:else if status === 'pending'}
				<div>
					<p>To finish logging in, press the button below.</p>
				</div>
			{:else}
				<div class="text-sm text-red-500">
					<p>{errorMsg}</p>
				</div>
			{/if}
		</CardContent>
		<CardFooter>
			{#if status === 'pending'}
				<Button class="w-full" onclick={handleMagicLink}>Continue</Button>
			{:else if status === 'error'}
				<Button class="w-full" href="/login/">Back to login</Button>
			{/if}
		</CardFooter>
	</Card>
</div>
