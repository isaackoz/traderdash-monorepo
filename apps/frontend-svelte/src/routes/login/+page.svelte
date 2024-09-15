<script lang="ts">
	import { enhance } from '$app/forms';
	import { hasInitialMagicLinkBeenSent, sendMagicLink } from '$lib/auth';
	import Seo from '$lib/components/SEO.svelte';
	import { Button } from '$lib/components/ui/button';
	import {
		Card,
		CardContent,
		CardDescription,
		CardHeader,
		CardTitle
	} from '$lib/components/ui/card';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import { Separator } from '$lib/components/ui/separator';
	import { loginSchema } from '$lib/schemas/auth';
	import { onMount } from 'svelte';
	import { toast } from 'svelte-sonner';
	let isSending = $state(false);
	let isSent = $state(false);
	let input = $state('');

	const handleSendLoginLink = async () => {
		try {
			loginSchema.parse({ email: input });
			isSending = true;
			toast.info('Sending magic link');
			await sendMagicLink(input);
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
	<div class="relative mx-auto w-full max-w-sm">
		<Card class="w-full">
			<CardHeader>
				<CardTitle class="text-center text-3xl">Sign In</CardTitle>
				<CardDescription class="text-center">Sign in to continue to TraderDash</CardDescription>
			</CardHeader>
			<CardContent class="w-full">
				{#if isSent === false}
					<form
						onsubmit={handleSendLoginLink}
						class="mx-auto flex flex-col items-center space-y-2 pl-3 pr-3 pt-4 sm:px-0"
					>
						<div class="flex w-full flex-col gap-1.5">
							<Label for="email">Email</Label>
							<Input
								type="email"
								id="email"
								placeholder="Enter your email..."
								value={input}
								onchange={(e) => {
									input = e.currentTarget.value;
								}}
							/>
						</div>
						<div class="w-full pt-4">
							<Button class="w-full" type="submit">Send Login Link</Button>
						</div>
						<div class="w-full pt-4">
							<div class="flex w-full items-center justify-between space-x-4">
								<Separator class="shrink" />
								<div class="whitespace-nowrap">
									<p>Or</p>
								</div>
								<Separator class="shrink" />
							</div>
							<div class="mt-4 w-full">
								<Button class="w-full" variant="outline">Continue with Google</Button>
							</div>
						</div>
					</form>
				{:else}
					<div>Already sent</div>
				{/if}
			</CardContent>
		</Card>
	</div>
</div>
