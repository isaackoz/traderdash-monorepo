<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import Progress from '$lib/components/ui/progress/progress.svelte';
	import {
		Sheet,
		SheetTrigger,
		SheetContent,
		SheetHeader,
		SheetTitle,
		SheetDescription
	} from '$lib/components/ui/sheet';
	import { cn } from '$lib/utils';
	import { defaults, superForm } from 'sveltekit-superforms';
	import AddStepOne from './_components/add-step-one.svelte';
	import { zod } from 'sveltekit-superforms/adapters';
	import { addTradeSchema } from '@repo/shared-schemas';
	import AddStepTwo from './_components/add-step-two.svelte';
	import AddStepThree from './_components/add-step-three.svelte';
	import AddStepFour from './_components/add-step-four.svelte';
	import type { AddTradeMeta } from '$lib/types/trades';

	let step = $state<number>(3);
	let open = $state(false);

	function nextStep(i?: number) {
		if (i) {
			step = i;
		} else {
			step += 1;
		}
	}

	function prevStep(i?: number) {
		if (i) {
			step = i;
		} else {
			step -= 1;
		}
	}

	let formMeta = $state<AddTradeMeta>({
		liveMarket: null,
		trackType: null
	});

	const form = superForm(defaults(zod(addTradeSchema)), {
		SPA: true,
		resetForm: false,
		validators: zod(addTradeSchema),
		onUpdate({ form }) {
			if (form.valid) {
				console.log(form.data);
			}
		}
	});
</script>

<Sheet
	{open}
	controlledOpen={true}
	onOpenChange={(v) => {
		if (v === false) {
			// Reset the state
			step = 1;
			formMeta = {
				liveMarket: null,
				trackType: null
			};
			form.reset();
		}

		open = v;
	}}
>
	<SheetTrigger>
		{#snippet child({ props })}
			<Button {...props}>Add Trade</Button>
		{/snippet}
	</SheetTrigger>
	<SheetContent class="flex h-svh flex-col">
		<SheetHeader>
			<SheetTitle>Add Trade</SheetTitle>
			<SheetDescription>Add and track a new trade</SheetDescription>
		</SheetHeader>
		<form method="POST" use:form.enhance class="flex flex-grow flex-col">
			<div class="">
				<Progress value={(step - 1) * (100 / 3)} class="" />
				<div class="mt-1 flex w-full justify-between">
					<button
						class={cn(
							' text-xl ',
							step === 1 && 'font-extrabold text-orange-600',
							step > 1 && 'underline underline-offset-4'
						)}
						disabled={step === 1}
						onclick={() => (step = 1)}
						>1
					</button>
					<button
						class={cn(
							'text-xl',
							step === 1 && 'text-muted-foreground',
							step === 2 && 'font-extrabold text-orange-600',
							step > 2 && 'underline underline-offset-4'
						)}
						disabled={step < 3}
						onclick={() => {
							step = 2;
						}}
					>
						2
					</button>
					<button
						class={cn(
							'text-xl',
							step < 3 && 'text-muted-foreground',
							step === 3 && 'font-extrabold text-orange-600',
							step > 3 && 'underline underline-offset-4',
							!formMeta.liveMarket && 'text-muted-foreground no-underline'
						)}
						disabled={step < 4 || !formMeta.liveMarket}
						onclick={() => {
							step = 3;
						}}
					>
						3
					</button>
					<button
						class={cn(
							'text-xl',
							step < 4 && 'text-muted-foreground',
							step === 4 && 'font-extrabold text-orange-600'
						)}
						disabled
					>
						4
					</button>
				</div>
			</div>
			<div class="mt-4 flex h-full flex-col">
				{#if step === 1}
					<AddStepOne {nextStep} {form} bind:addTradeMeta={formMeta} />
				{:else if step === 2}
					<AddStepTwo {form} {nextStep} {prevStep} bind:addTradeMeta={formMeta} />
				{:else if step === 3}
					<AddStepThree {form} {nextStep} {prevStep} bind:addTradeMeta={formMeta} />
				{:else if step === 4}
					<AddStepFour {form} {nextStep} {prevStep} bind:addTradeMeta={formMeta} />
				{/if}
			</div>
		</form>
	</SheetContent>
</Sheet>
