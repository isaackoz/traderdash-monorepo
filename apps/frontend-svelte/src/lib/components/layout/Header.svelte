<script lang="ts">
	import Breadcrumbs from './Breadcrumbs.svelte';
	import * as Avatar from '$lib/components/ui/avatar';
	import SearchAnything from './SearchAnything.svelte';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import Notifications from './Notifications.svelte';
	import { signOut } from 'supertokens-web-js/recipe/session';
	import { goto, invalidateAll } from '$app/navigation';

	const handleLogout = async () => {
		await signOut();
		await invalidateAll();
		goto('/login/');
	};
</script>

<header
	class="bg-muted/20 border-muted flex h-14 w-full items-center justify-between border-b px-2 py-1 xl:px-4"
>
	<div id="breadcrumb">
		<Breadcrumbs />
	</div>
	<div class="flex items-center space-x-4">
		<SearchAnything />

		<Notifications />
		<DropdownMenu.Root>
			<DropdownMenu.Trigger>
				<Avatar.Root>
					<Avatar.Fallback>TD</Avatar.Fallback>
				</Avatar.Root>
			</DropdownMenu.Trigger>
			<DropdownMenu.Content class="w-[150px]">
				<DropdownMenu.Group>
					<DropdownMenu.Label>My Account</DropdownMenu.Label>
					<DropdownMenu.Separator />
					<DropdownMenu.Item>Profile</DropdownMenu.Item>
					<DropdownMenu.Item>Billing</DropdownMenu.Item>
					<DropdownMenu.Item>Team</DropdownMenu.Item>
					<DropdownMenu.Item>Subscription</DropdownMenu.Item>
					<DropdownMenu.Item onclick={handleLogout}>Signout</DropdownMenu.Item>
				</DropdownMenu.Group>
			</DropdownMenu.Content>
		</DropdownMenu.Root>
	</div>
</header>
