<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Popover, PopoverContent, PopoverTrigger } from '$lib/components/ui/popover';
	import { Separator } from '$lib/components/ui/separator';
	import { Switch } from '$lib/components/ui/switch';
	import type { AddTradeMeta, AggregatedTrade } from '$lib/types/trades';
	import { cn } from '$lib/utils';
	import type { AddTradeData } from '@repo/shared-schemas';
	import type { Trade } from 'ccxt';
	import { DateInput } from 'date-picker-svelte';
	import { CircleHelp } from 'lucide-svelte';
	import { fade, fly } from 'svelte/transition';
	import type { SuperFormData } from 'sveltekit-superforms/client';

	let {
		isDetailsVisible = $bindable(),
		formData = $bindable(),
		detailItem,
		addTradeMeta = $bindable(),
		nextStep
	}: {
		isDetailsVisible: boolean;
		detailItem: AggregatedTrade;
		formData: SuperFormData<AddTradeData>;
		nextStep: () => void;
		addTradeMeta: AddTradeMeta;
	} = $props();

	function stepOneContinue() {
		if (addTradeMeta.syncTrade === true) {
			// If the user wants to sync their trades, go to last step
			// (we don't need a toTimestamp)
			if (!detailItem) return;
			const { aggregatedAmount, side, price, timestamp, order } = detailItem;

			// Set side
			if (side === 'buy') {
				$formData.side = 'buy';
			} else {
				$formData.side = 'sell';
			}

			// Set initial amount
			$formData.initialAmount = Number(aggregatedAmount);

			// Set Entry price
			$formData.entryPrice = Number(price);

			// Set the initial date/timestamp
			$formData.fromTimestamp = Number(timestamp);

			// Set the trade id
			$formData.fromTradeId = order as string;
			addTradeMeta.trackType = 'automatic';

			nextStep();
		} else {
			step = '2';
		}
	}

	function stepTwoContinue() {
		if (!detailItem) return;
		const { aggregatedAmount, side, price, timestamp, order } = detailItem;

		if (side === 'buy') {
			$formData.side = 'buy';
		} else {
			$formData.side = 'sell';
		}
		// Set initial amount
		$formData.initialAmount = Number(aggregatedAmount);

		// Set Entry price
		$formData.entryPrice = Number(price);

		// Set the initial date/timestamp
		$formData.fromTimestamp = Number(timestamp);

		// Set the trade id
		$formData.fromTradeId = order as string;
		addTradeMeta.trackType = 'automatic';

		// Set the toDate
		$formData.toTimestamp = toDate.getTime();
		nextStep();
	}

	let step = $state<'1' | '2'>('1');

	let toDate = $state<Date>(new Date());
</script>

<!--
When the user selects a trade, we will then ask them if they would like to choose an end date/trade
or if they would like to track their trades to the current moment
-->

<div
	class="bg-muted absolute bottom-0 left-0 right-0 top-0 z-10 flex min-h-[620px] flex-col rounded-md p-4"
	transition:fade={{ duration: 100 }}
>
	<button
		class="bg-muted group absolute right-4 top-2 z-20 flex size-6 items-center justify-center rounded-full transition-colors hover:cursor-pointer hover:bg-red-600"
		onclick={() => {
			isDetailsVisible = false;
		}}
		type="button"
	>
		<span class="text-red-500 group-hover:text-white">x</span>
	</button>
	<h4 class="text-xl font-bold">{detailItem.symbol}</h4>
	<p class="text-muted-foreground">
		{new Date(detailItem?.timestamp ?? '').toLocaleString()} (local time)
	</p>
	<Separator class="my-2 bg-black" />
	{#if step === '1'}
		<div class="flex flex-grow flex-col justify-between">
			<div class="grid grid-cols-2 gap-y-4">
				<!--  -->
				<div>Symbol</div>
				<div>
					{detailItem.symbol}
				</div>
				<!--  -->
				<!--  -->
				<div>Amount</div>
				<div>
					{detailItem.aggregatedAmount}
					{detailItem.symbol?.split('/')[0] ?? ''}
				</div>
				<!--  -->
				<!--  -->
				<div>Price</div>
				<div>
					{detailItem.price}
				</div>
				<!--  -->
				<!--  -->
				<div>Cost</div>
				<div>
					{detailItem.aggregatedCost}
				</div>
				<!--  -->
				<!--  -->
				<div>Side</div>
				<div class={cn(detailItem.side === 'buy' ? 'text-green-500' : 'text-red-500')}>
					{detailItem.side}
				</div>
				<!--  -->
				<!--  -->
				<div>Fees</div>
				<div>
					{detailItem.aggregatedFees?.toFixed(2)}
					{detailItem.feeCurrency}
				</div>
				<!--  -->
			</div>
			<div
				class="bg-background mb-4 mt-auto flex flex-row items-center justify-between rounded-lg border p-4"
			>
				<div class="flex items-center space-x-2">
					<label class="font-semibold" for="">Sync trades up to date</label>
					<Popover>
						<PopoverTrigger class="text-sm text-blue-500"
							><CircleHelp class="size-5" /></PopoverTrigger
						>
						<PopoverContent class="text-sm" side="top">
							When enabled, your trades for this market will be synced up to the current time each
							time you sync this market. This means any new trades for this market will
							automatically be added when you sync your trades.
							<br /> <br />
							When disabled, you will need to input an end date and time that you want to track your
							trades up to this market.
						</PopoverContent>
					</Popover>
				</div>
				<Switch bind:checked={addTradeMeta.syncTrade} />
			</div>
			<Button type="button" class="w-full" onclick={stepOneContinue}>Continue</Button>
		</div>
	{:else if step === '2'}
		<div class="flex flex-grow flex-col justify-between" in:fade>
			<div>
				<p class="text-lg font-semibold">Choose a date and time</p>
				<p class="text-muted-foreground text-sm">
					Choose a date and time anytime after {new Date(
						detailItem?.timestamp ?? ''
					).toLocaleString()}. This will create and sync your trades up to this date. Any future
					trades after this date and time will not be synced or added. You are still able to
					manually add trades.
				</p>
				<Separator class="my-4 bg-black" />
				<DateInput
					bind:value={toDate}
					timePrecision="second"
					placeholder=""
					class="w-full [&>input]:w-full"
					min={new Date(detailItem?.timestamp ?? '')}
				/>
			</div>
			<div class="">
				<Button variant="ghost" onclick={() => (step = '1')} class="w-full">Back</Button>
				<Button variant="default" onclick={stepTwoContinue} class="w-full">Continue</Button>
			</div>
		</div>
	{/if}
</div>

<style>
	:global(body) {
		--date-picker-foreground: #f7f7f7;
		--date-picker-background: #16171c;
		--date-picker-highlight-border: hsl(var(--deg), 98%, 49%);
		--date-picker-highlight-shadow: hsla(var(--deg), 98%, 49%, 50%);
		--date-picker-selected-color: hsl(var(--deg), 100%, 85%);
		--date-picker-selected-background: hsla(var(--deg), 98%, 49%, 20%);
		--date-input-width: 100%;
	}
</style>
