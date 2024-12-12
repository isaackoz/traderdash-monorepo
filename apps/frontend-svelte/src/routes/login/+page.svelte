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
	import { clearLoginAttemptInfo } from 'supertokens-web-js/recipe/passwordless';
	import { onMount } from 'svelte';
	import { toast } from 'svelte-sonner';
	let isSending = $state(false);
	let isSuccess = $state(false);
	let isAlreadySent = $state(false);
	let errorMsg = $state<string | null>(null);
	let input = $state('');

	const handleSendLoginLink = async () => {
		try {
			errorMsg = null;
			const parsedData = loginSchema.safeParse({ email: input });
			if (!parsedData.success) {
				errorMsg = 'Invalid email';
				return;
			}
			isSending = true;
			const res = await sendMagicLink(parsedData.data.email);
			if (res) {
				isSuccess = true;
				toast.success('Email sent');
			} else {
				toast.error('Sign in is not available at this time.');
			}
		} catch (err: unknown) {
			errorMsg = 'An unknown error occured. Try again';
		} finally {
			isSending = false;
		}
	};

	const clearLoginAttempt = async () => {
		try {
			await clearLoginAttemptInfo();
			isAlreadySent = false;
		} catch {
			toast.error('There was an unknown error resetting the login process.');
		}
	};

	onMount(async () => {
		// Check if user has already submitted a magic link request
		const hasSubmitted = await hasInitialMagicLinkBeenSent();
		if (hasSubmitted) {
			isAlreadySent = true;
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
				{#if isAlreadySent === false}
					{#if isSuccess}
						<div class="rounded-lg bg-muted p-2 text-sm">Success! Check your email</div>
					{:else}
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
									bind:value={input}
								/>
								<div class="h-4 text-xs text-red-500">
									{#if errorMsg}
										<p>{errorMsg}</p>
									{/if}
								</div>
							</div>
							<div class="w-full pt-4">
								<Button class="w-full" type="submit" disabled={isSending || !input}
									>Send Login Link</Button
								>
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
									<Button class="w-full" variant="outline" disabled>Continue with Google</Button>
								</div>
							</div>
						</form>
					{/if}
				{:else}
					<div class="rounded-lg bg-muted p-2 text-sm">
						<p>A code has already been sent to your email.</p>
						<button onclick={clearLoginAttempt} class="text-blue-500 underline">
							No email? Click here to reset the process
						</button>
					</div>
				{/if}
			</CardContent>
		</Card>
	</div>
</div>
