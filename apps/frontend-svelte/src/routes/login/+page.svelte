<script lang="ts">
	import { enhance } from '$app/forms';
	import { hasInitialMagicLinkBeenSent, sendMagicLink } from '$lib/auth';
	import Seo from '$lib/components/SEO.svelte';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import { Separator } from '$lib/components/ui/separator';
	import { onMount } from 'svelte';
	import { toast } from 'svelte-sonner';
	let isSending = $state(false);
	let isSent = $state(false);

	const handleSendLoginLink = async (data: unknown) => {
		try {
			console.log(data);
			isSending = true;
			toast.info('Sending magic link');
			await sendMagicLink('isaackoz130@gmail.com');
		} catch (err: unknown) {
			console.log(err);
		} finally {
			isSending = false;
		}
	};

	onMount(async () => {
		// Check if user has already submitted a magic link request
		const hasSubmitted = await hasInitialMagicLinkBeenSent();
		if (hasSubmitted) {
			isSent = true;
		}
	});
</script>

<Seo title="Login" description="Log into your TraderDash account" />

<div class="flex h-dvh items-center justify-center">
	<div class="relative mx-auto w-full max-w-3xl">
		<div class="grid grid-cols-1 gap-4">
			<div>
				<h2 class="pt-10 text-center text-2xl font-semibold text-white sm:pt-0 sm:text-3xl">
					Sign In
				</h2>
			</div>
			<p class="text-muted-foreground text-center">Welcome to TraderDash</p>
			<div class="relative m-auto w-full max-w-sm">
				{#if isSent === false}
					<form
						onsubmit={handleSendLoginLink}
						class="mx-auto flex flex-col items-center space-y-2 pl-3 pr-3 pt-4 sm:px-0"
					>
						<div class="flex w-full flex-col gap-1.5">
							<Label for="email">Email</Label>
							<Input type="email" id="email" placeholder="Enter your email..." />
						</div>
						<div class="w-full pt-4">
							<Button class="w-full" type="submit">Send Login Link</Button>
						</div>
						<div class="w-full pt-6">
							<div class="flex w-full items-center justify-between space-x-4">
								<Separator class="shrink" />
								<div class="whitespace-nowrap">
									<p>Or log in using</p>
								</div>
								<Separator class="shrink" />
							</div>
						</div>
					</form>
				{:else}
					<div>Already sent</div>
				{/if}
			</div>
		</div>
	</div>
</div>
