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
	import { handleAddTradeFinish } from '$lib/api/user/trade';
	import { toast } from 'svelte-sonner';
	import { invalidateAll } from '$app/navigation';
	import { LoaderCircle } from 'lucide-svelte';

	let step = $state<number>(1);
	let open = $state(false);
	let isSubmitting = $state(false);

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
		trackType: null,
		syncTrade: true
	});

	const form = superForm(defaults(zod(addTradeSchema)), {
		SPA: true,
		resetForm: false,
		validators: zod(addTradeSchema),
		async onUpdate({ form }) {
			if (form.valid) {
				try {
					isSubmitting = true;
					const { data, error } = await handleAddTradeFinish(form.data, formMeta);
					if (error) {
						toast.error(error.message);
					} else {
						toast.success(`Added trade! Id is ${data}`);
						invalidateAll();
						open = false;
					}
				} catch (e) {
					console.error(e);
					toast.error('Uh oh there was an unknown error.');
				} finally {
					isSubmitting = false;
				}
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
				trackType: null,
				syncTrade: true
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
		{#if isSubmitting}
			<div
				class="absolute bottom-0 left-0 right-0 top-0 z-[99999] flex items-center justify-center bg-background/80"
			>
				<div class="animate-spin">
					<LoaderCircle />
				</div>
			</div>
		{/if}
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
