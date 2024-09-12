<script lang="ts">
	import { Button } from '../ui/button';
	import * as Command from '$lib/components/ui/command/index.js';
	import { SettingsIcon } from 'lucide-svelte';
	import { onMount } from 'svelte';

	let open = $state(false);

	onMount(() => {
		function handleKeyDown(e: KeyboardEvent) {
			if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
				e.preventDefault();
				open = !open;
			}
		}

		document.addEventListener('keydown', handleKeyDown);

		return () => {
			document.removeEventListener('keydown', handleKeyDown);
		};
	});
</script>

<Button
	variant="outline"
	class="flex w-[225px] items-center justify-between"
	onclick={() => (open = !open)}
>
	<span>Search anything...</span>
	<kbd
		class="bg-muted text-muted-foreground pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border px-1.5 font-mono text-[10px] font-medium opacity-100"
	>
		<span>Ctrl</span>K
	</kbd>
</Button>
<Command.Dialog bind:open>
	<Command.Input placeholder="Type a command or search..." />
	<Command.List>
		<Command.Empty>No results found.</Command.Empty>
		<Command.Group heading="Suggestions">
			<Command.Item>
				<SettingsIcon class="mr-2 size-4" />
				<span>My Trades</span>
			</Command.Item>
			<Command.Item>
				<SettingsIcon class="mr-2 size-4" />
				<span>Portfolio</span>
			</Command.Item>
		</Command.Group>
		<Command.Group heading="Settings">
			<Command.Item>
				<SettingsIcon class="mr-2 size-4" />
				<span>Profile</span>
			</Command.Item>
			<Command.Item>
				<SettingsIcon class="mr-2 size-4" />
				<span>Billing</span>
			</Command.Item>
			<Command.Item>
				<SettingsIcon class="mr-2 size-4" />
				<span>Settings</span>
			</Command.Item>
		</Command.Group>
	</Command.List>
</Command.Dialog>
