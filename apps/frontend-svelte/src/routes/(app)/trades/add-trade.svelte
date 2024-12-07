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
	import AddStepOne from './_components/add-step-one.svelte';

	let step = $state<number>(1);
</script>

<Sheet open={true}>
	<SheetTrigger>
		{#snippet child({ props })}
			<Button {...props}>Add Trade</Button>
		{/snippet}
	</SheetTrigger>
	<SheetContent>
		<SheetHeader>
			<SheetTitle>Add Trade</SheetTitle>
			<SheetDescription>Add and track a new trade</SheetDescription>
		</SheetHeader>
		<div class="relative mt-8">
			<Progress value={(step - 1) * 50} class="" />
			<div class="mt-1 flex w-full justify-between">
				<span class={cn(' text-xl ', step === 1 && 'font-extrabold text-orange-600')}>1 </span>
				<span
					class={cn(
						'text-xl',
						step === 1 && 'text-muted-foreground',
						step === 2 && 'font-extrabold text-orange-600'
					)}
				>
					2
				</span>
				<span
					class={cn(
						'text-xl',
						step < 3 && 'text-muted-foreground',
						step === 3 && 'font-extrabold text-orange-600'
					)}
				>
					3
				</span>
			</div>
		</div>
		<div class="mt-4">
			{#if step === 1}
				<AddStepOne />
			{/if}
		</div>
	</SheetContent>
</Sheet>
