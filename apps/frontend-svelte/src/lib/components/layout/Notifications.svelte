<script lang="ts">
	import { Button } from '../ui/button';
	import { BellIcon, XIcon } from 'lucide-svelte';
	import * as Popover from '../ui/popover';
</script>

<Popover.Root>
	<Popover.Trigger>
		<Button variant="outline" size="icon" class="px-2">
			<BellIcon class="size-5" />
		</Button>
	</Popover.Trigger>
	<Popover.Content class="bg-card w-full max-w-xs px-0" align="start">
		<h2 class="font-semibold">Notifications</h2>
		<ul class="mt-4 flex w-full flex-col space-y-1">
			<a href="/notifications">
				<li
					class="hover:bg-card-foreground/5 relative flex border-b border-t py-2 pl-4 pr-8 text-sm transition-colors"
				>
					<p>This is a notifcations and this is a longer one and I think its a good one</p>
					<div class="absolute right-2 top-1/2 -translate-y-1/2">
						<Button
							variant="ghost"
							size="icon"
							class="z-10 h-fit w-fit p-1"
							type="button"
							onclick={(e) => e.stopPropagation()}
						>
							<XIcon class="size-4" />
						</Button>
					</div>
				</li>
			</a>
			<li class="text-sm">This is a notifcations</li>
			<li class="text-sm">This is a notifcations</li>
			<li class="text-sm">This is a notifcations</li>
		</ul>
	</Popover.Content>
</Popover.Root>
