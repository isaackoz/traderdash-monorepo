<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import {
		FormControl,
		FormDescription,
		FormField,
		FormFieldErrors,
		FormLabel
	} from '$lib/components/ui/form';
	import { Input } from '$lib/components/ui/input';
	import { Popover, PopoverContent, PopoverTrigger } from '$lib/components/ui/popover';
	import { Select, SelectContent, SelectItem, SelectTrigger } from '$lib/components/ui/select';
	import { Separator } from '$lib/components/ui/separator';
	import type { AddTradeMeta } from '$lib/types/trades';
	import type { AddTradeData } from '@repo/shared-schemas';
	import { CircleHelp } from 'lucide-svelte';
	import type { SuperForm, SuperFormData } from 'sveltekit-superforms/client';
	import { DateInput } from 'date-picker-svelte';

	let {
		nextStep,
		form = $bindable(),
		prevStep,
		addTradeMeta = $bindable()
	}: {
		nextStep: () => void;
		prevStep: () => void;
		form: SuperForm<AddTradeData>;
		addTradeMeta: AddTradeMeta;
	} = $props();
	const { form: formData } = form;

	let isMounted = $state(false);
	let error = $state<null | string>(null);
	let isLoading = $state(false);

	let fromTime = $state<Date | null>(
		$formData.fromTimestamp ? new Date($formData.fromTimestamp) : null
	);
	let toTime = $state<Date | null>($formData.toTimestamp ? new Date($formData.toTimestamp) : null);

	// Handle from time picker changing
	$effect(() => {
		// Convert Date instance to milliseconds
		$formData.fromTimestamp = fromTime ? fromTime.getTime() : Date.now();
	});

	$effect(() => {
		$formData.toTimestamp = toTime ? toTime.getTime() : Date.now();
	});
</script>

<div class="flex h-full w-full flex-col overflow-y-hidden">
	<h3 class="font-semibold">Overview</h3>
	<p class="my-2 text-sm text-muted-foreground">
		Once you add a trade, you will be able to track it and view its performance.
	</p>
	<Separator />
	<div class="flex w-full flex-grow flex-col overflow-y-auto">
		<span class="flex-grow">
			<FormField {form} name="marketSymbol">
				<FormControl>
					{#snippet children({ props })}
						<div class="flex items-center space-x-2">
							<FormLabel>Market Symbol</FormLabel>
							<Popover>
								<PopoverTrigger class="text-sm text-blue-500"
									><CircleHelp class="size-5" /></PopoverTrigger
								>
								<PopoverContent class="text-sm">
									{#if addTradeMeta.liveMarket}
										This value can not be changed as you selected a market in step 2.
									{:else}
										Enter a symbol or nickname separated by a /. For example BOG/USD
									{/if}
								</PopoverContent>
							</Popover>
						</div>
						<Input
							{...props}
							bind:value={$formData.marketSymbol}
							disabled={isLoading || addTradeMeta.liveMarket}
						/>
					{/snippet}
				</FormControl>
				<FormFieldErrors />
			</FormField>
			<FormField {form} name="side">
				<FormControl>
					{#snippet children({ props })}
						<div class="flex items-center space-x-2">
							<FormLabel>Side</FormLabel>
							<Popover>
								<PopoverTrigger class="text-sm text-blue-500"
									><CircleHelp class="size-5" /></PopoverTrigger
								>
								<PopoverContent class="text-sm">
									Select a direction (sell/short or buy/long).
								</PopoverContent>
							</Popover>
						</div>
						<Select type="single" bind:value={$formData.side} name={props.name}>
							<SelectTrigger {...props} class="capitalize">
								{$formData.side ? $formData.side : 'Select a side'}
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="buy" label="Buy" />
								<SelectItem value="sell" label="Sell" />
							</SelectContent>
						</Select>
					{/snippet}
				</FormControl>
				<FormFieldErrors />
			</FormField>
			<FormField {form} name="initialAmount">
				<FormControl>
					{#snippet children({ props })}
						<div class="flex items-center space-x-2">
							<FormLabel>Initial Amount</FormLabel>
							<Popover>
								<PopoverTrigger class="text-sm text-blue-500"
									><CircleHelp class="size-5" /></PopoverTrigger
								>
								<PopoverContent class="text-sm">
									{#if addTradeMeta.trackType === 'automatic'}
										This value can not be changed as you selected a value in step 3.
									{:else}
										Enter the initial amount for this trade. For example, 0.01 BTC
									{/if}
								</PopoverContent>
							</Popover>
						</div>
						<Input
							{...props}
							type="number"
							step="any"
							bind:value={$formData.initialAmount}
							disabled={isLoading || addTradeMeta.trackType === 'automatic'}
						/>
					{/snippet}
				</FormControl>

				<FormFieldErrors />
			</FormField>
			<FormField {form} name="entryPrice">
				<FormControl>
					{#snippet children({ props })}
						<div class="flex items-center space-x-2">
							<FormLabel>Entry Price</FormLabel>
							<Popover>
								<PopoverTrigger class="text-sm text-blue-500"
									><CircleHelp class="size-5" /></PopoverTrigger
								>
								<PopoverContent class="text-sm">
									{#if addTradeMeta.trackType === 'automatic'}
										This value can not be changed as you selected a value in step 3.
									{:else}
										Choose an entry price for the first trade.
									{/if}
								</PopoverContent>
							</Popover>
						</div>
						<Input
							{...props}
							type="number"
							step="any"
							bind:value={$formData.entryPrice}
							disabled={isLoading || addTradeMeta.trackType === 'automatic'}
						/>
					{/snippet}
				</FormControl>
				<FormFieldErrors />
			</FormField>
			<FormField {form} name="fromTimestamp">
				<FormControl>
					{#snippet children({ props })}
						<div class="flex items-center space-x-2">
							<FormLabel>From Date/Time</FormLabel>
							<Popover>
								<PopoverTrigger class="text-sm text-blue-500"
									><CircleHelp class="size-5" /></PopoverTrigger
								>
								<PopoverContent class="text-sm">
									This is the date/time to begin tracking the trade from. <br />
									{#if addTradeMeta.trackType === 'automatic'}
										This value can not be changed as you selected a value in step 3.
									{:else}
										Choose a date to begin tracking from
									{/if}
								</PopoverContent>
							</Popover>
						</div>
						<DateInput
							bind:value={fromTime}
							timePrecision="second"
							placeholder=""
							disabled={isLoading || addTradeMeta.trackType === 'automatic'}
							dynamicPositioning
						/>
					{/snippet}
				</FormControl>
			</FormField>
			{#if addTradeMeta.liveMarket && addTradeMeta.trackType === 'automatic'}
				<FormField {form} name="toTimestamp">
					<FormControl>
						{#snippet children({ props })}
							<div class="flex items-center space-x-2">
								<FormLabel>To Date/Time</FormLabel>
								<Popover>
									<PopoverTrigger class="text-sm text-blue-500"
										><CircleHelp class="size-5" /></PopoverTrigger
									>
									<PopoverContent class="text-sm">
										This is the date/time to end tracking the trade from. <br />
										{#if addTradeMeta.syncTrade}
											You can not change this as you opted to automatically sync your trades up to
											date.
										{:else}
											Choose a date to end tracking trades from
										{/if}
									</PopoverContent>
								</Popover>
							</div>
							{#if addTradeMeta.syncTrade}
								<Input disabled readonly value="Sync up to date" />
							{:else}
								<DateInput
									bind:value={toTime}
									timePrecision="second"
									placeholder=""
									disabled={isLoading || addTradeMeta.syncTrade}
									dynamicPositioning
								/>
							{/if}
						{/snippet}
					</FormControl>
				</FormField>
			{/if}
		</span>
		<Button class="w-full" type="submit">Finish</Button>
	</div>
</div>

<style>
	:global(body) {
		--date-picker-foreground: #f7f7f7;
		--date-picker-background: #16171c;
		--date-picker-highlight-border: hsl(var(--deg), 98%, 49%);
		--date-picker-highlight-shadow: hsla(var(--deg), 98%, 49%, 50%);
		--date-picker-selected-color: hsl(var(--deg), 100%, 85%);
		--date-picker-selected-background: hsla(var(--deg), 98%, 49%, 20%);
	}
</style>
