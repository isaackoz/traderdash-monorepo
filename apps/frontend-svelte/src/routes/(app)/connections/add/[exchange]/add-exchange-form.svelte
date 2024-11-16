<script lang="ts">
	import { exchangeConfigs, type Exchanges } from '@repo/exchange-info';
	import { defaults, superForm } from 'sveltekit-superforms';
	import { zod } from 'sveltekit-superforms/adapters';
	import { addUserExchangeSchema } from '@repo/shared-schemas';
	import ccxt, { exchanges } from 'ccxt';
	import {
		FormControl,
		FormDescription,
		FormField,
		FormFieldErrors,
		FormLabel
	} from '$lib/components/ui/form';
	import { Input } from '$lib/components/ui/input';
	import { Button, buttonVariants } from '$lib/components/ui/button';
	import { toast } from 'svelte-sonner';
	import {
		Collapsible,
		CollapsibleContent,
		CollapsibleTrigger
	} from '$lib/components/ui/collapsible';
	import { ChevronDown } from 'lucide-svelte';
	import { Switch } from '$lib/components/ui/switch';

	let { exchangeId }: { exchangeId: Exchanges } = $props();
	const exchangeInfo = exchangeConfigs[exchangeId];

	const form = superForm(
		defaults({ exchangeId: exchangeId, selfEncrypted: false }, zod(addUserExchangeSchema)),
		{
			SPA: true,
			validators: zod(addUserExchangeSchema),
			onUpdate({ form }) {
				if (form.valid) {
					console.log(form.data);
				}
			}
		}
	);
	const { validateForm, enhance, form: formData } = form;

	async function verifyCredentials() {
		try {
			isVerifying = true;
			if (exchangeId !== 'traderdash') {
				const exchangeClass = ccxt[exchangeId];
				const exchange = new exchangeClass({
					apiKey: $formData.apiKey,
					secret: $formData.secret?.replace(/\\n/g, '\n').trim(),
					uid: $formData.uid,
					passwoord: $formData.password,
					proxy: 'http://localhost2.test:8080/',
					origin: 'localhost.test',
					options: {
						maxRetriesOnFailure: 1
					}
				});

				// Check if we have required fields
				const res = exchange.checkRequiredCredentials(false);
				if (!res) {
					throw new Error('Missing required credentials');
				}

				// Some exchanges require signin. Do so here
				try {
					if (exchange.has['signIn']) {
						await exchange.signIn();
					}
				} catch {}

				// Check
				try {
					const r = await exchange.fetchBalance();
					console.log(r);
				} catch (e) {
					console.log(e);
					throw new Error('Invalid keys');
				}

				// Check if we can
			} else {
				throw new Error('Can not check traderdash');
			}
		} finally {
			isVerifying = false;
		}
	}

	let isVerifying = $state(false);

	function handleVerifyApiKeys() {
		toast.promise(verifyCredentials, {
			success: () => {
				return `Successfully connected to ${exchangeInfo.displayName}`;
			},
			loading: 'Checking API Keys...',
			error: (e) => {
				console.log(e);
				return `Error verifying: ${e instanceof Error ? e.message : 'An unknown error occured'}`;
			}
		});
	}

	// validateForm({ update: true });
</script>

<div>
	<h1 class="text-3xl font-bold">Add {exchangeInfo.displayName}</h1>
	<p class="text-muted-foreground mt-1 text-sm">
		For your security, TraderDash only uses Read-Only APIs on the frontend for each exchange (we
		don't use it in the backend). If your exchange offers an option for read-only API keys, we
		highly recommend you use that. TraderDash will store your API keys encrypted using standard
		bank-grade encryption. We also offer you the option to self-encrypt your API keys. For more
		information,
		<a href="/help/api-keys" class="text-blue-500 underline">click here.</a>
	</p>
</div>
<form use:enhance method="POST" class="mt-8 space-y-8">
	<div class="bg-muted/50 border-muted grid grid-cols-2 rounded-lg p-8">
		<div class="font-semibold">General</div>
		<div>
			<FormField {form} name="nickname">
				<FormControl>
					{#snippet children({ props })}
						<FormLabel>Nickname</FormLabel>
						<Input {...props} bind:value={$formData.nickname} />
					{/snippet}
				</FormControl>
				<FormDescription
					>Add a nickname to identify this exchange throughout TraderDash</FormDescription
				>
				<FormFieldErrors />
			</FormField>
		</div>
	</div>
	{#if exchangeInfo.authentication.enabled}
		<div class="bg-muted/50 border-muted grid grid-cols-2 rounded-lg p-8">
			<div class="font-semibold">Exchange API Keys</div>
			<div class="space-y-8">
				{#if exchangeInfo.authentication.requireApiKey}
					<FormField {form} name="apiKey">
						<FormControl>
							{#snippet children({ props })}
								<FormLabel>API Key</FormLabel>
								<Input
									{...props}
									bind:value={$formData.apiKey}
									autocomplete="new-password"
									isPassword
								/>
							{/snippet}
						</FormControl>
						<FormDescription>
							{exchangeInfo.authentication.apiKeyDescription}
						</FormDescription>
						<FormFieldErrors />
					</FormField>
				{/if}
				{#if exchangeInfo.authentication.requirePassword}
					<FormField {form} name="password">
						<FormControl>
							{#snippet children({ props })}
								<FormLabel>API Password</FormLabel>
								<Input
									{...props}
									bind:value={$formData.password}
									autocomplete="new-password"
									isPassword
								/>
							{/snippet}
						</FormControl>
						<FormDescription>
							{exchangeInfo.authentication.passwordDescription}
						</FormDescription>
						<FormFieldErrors />
					</FormField>
				{/if}
				{#if exchangeInfo.authentication.requireSecret}
					<FormField {form} name="secret">
						<FormControl>
							{#snippet children({ props })}
								<FormLabel>API Secret</FormLabel>
								<Input
									{...props}
									bind:value={$formData.secret}
									autocomplete="new-password"
									isPassword
								/>
							{/snippet}
						</FormControl>
						<FormDescription>
							{exchangeInfo.authentication.secretDescription}
						</FormDescription>
						<FormFieldErrors />
					</FormField>
				{/if}
				{#if exchangeInfo.authentication.requireUid}
					<FormField {form} name="uid">
						<FormControl>
							{#snippet children({ props })}
								<FormLabel>API User ID</FormLabel>
								<Input
									{...props}
									bind:value={$formData.uid}
									autocomplete="new-password"
									isPassword
								/>
							{/snippet}
						</FormControl>
						<FormDescription>{exchangeInfo.authentication.uidDescription}</FormDescription>
						<FormFieldErrors />
					</FormField>
				{/if}
				<Collapsible>
					<div class="flex w-full justify-end">
						<CollapsibleTrigger
							disabled
							class={buttonVariants({
								variant: 'link',
								size: 'sm',
								class: 'w-9, group  ml-auto p-2'
							})}
						>
							<span class="text-xs">Advanced Options</span>
							<ChevronDown class="size-4 transition-transform group-data-[state=open]:rotate-180" />
						</CollapsibleTrigger>
					</div>
					<CollapsibleContent>
						<div>
							<FormField
								class="border-muted bg-background mt-2 flex flex-row items-center justify-between space-x-2 rounded-lg border p-4"
								{form}
								name="selfEncrypted"
							>
								<FormControl>
									{#snippet children({ props })}
										<div class="space-y-0.5">
											<FormLabel>Self Encrypt</FormLabel>
											<FormDescription>
												To use this feature, read
												<a class="text-blue-500 underline" href="/help/self-encrypt" target="_blank"
													>how to setup self-encrypt &nearr;</a
												>
											</FormDescription>
										</div>
										<Switch {...props} bind:checked={$formData.selfEncrypted} />
									{/snippet}
								</FormControl>
							</FormField>
						</div>
					</CollapsibleContent>
				</Collapsible>
				<div class="flex w-full justify-end">
					<Button
						size="sm"
						variant="ghost"
						disabled={isVerifying}
						class="text-blue-500 hover:text-blue-500"
						type="button"
						onclick={handleVerifyApiKeys}>Verify API Keys</Button
					>
				</div>
			</div>
		</div>
	{/if}
	<div class="col-span-2 flex w-full justify-end">
		<Button type="submit">Add Exchange</Button>
	</div>
</form>
