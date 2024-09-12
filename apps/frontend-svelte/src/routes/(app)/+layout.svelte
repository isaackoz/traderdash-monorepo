<script lang="ts">
	import NavLinkList from '$lib/components/layout/NavLinkList.svelte';
	import { ScrollArea } from '$lib/components/ui/scroll-area';
	import Header from '$lib/components/layout/Header.svelte';
	import Seo from '$lib/components/SEO.svelte';
	import { onMount } from 'svelte';
	import { checkAuth } from '$lib/auth';
	import { auth } from '$stores/global';
	import { goto } from '$app/navigation';
	import { Skeleton } from '$lib/components/ui/skeleton';
	import {
		Card,
		CardContent,
		CardDescription,
		CardHeader,
		CardTitle
	} from '$lib/components/ui/card';
	import { LoaderIcon } from 'lucide-svelte';

	let isLoggedIn = $state<boolean | null>(null);
	onMount(async () => {
		await checkAuth();
		auth.subscribe((val) => {
			isLoggedIn = val.isLoggedIn;
			if (!isLoggedIn) {
				goto('/login/');
			}
		});
	});
</script>

<Seo title="Trades" description="View your trades." />

{#if isLoggedIn}
	<div class="bg-background flex h-screen w-full overflow-hidden">
		<ScrollArea class="border-muted max-h-screen border-r pr-2" type="hover">
			<aside class=" hidden min-h-screen flex-col p-4 xl:flex xl:w-[250px]">
				<!-- Logo -->
				<div class="flex">
					<a href="/home/" class="flex w-full items-center">
						<!-- <img
						src="/logo.png"
						alt="TraderDash Logo"
						class="object-contain"
						width={24}
						height={24}
					/> -->
						<div class="ml-2 flex text-xl font-bold">
							<span class="">Trader</span>
							<span class="">Dash</span>
							<span>.app</span>
						</div>
					</a>
				</div>
				<div>
					<NavLinkList />
				</div>
			</aside>
		</ScrollArea>
		<div class="flex w-full flex-col">
			<Header />
			<ScrollArea class="max-h-screen">
				<main class="min-h-[calc(100vh-3.5rem)] p-2 xl:p-4">
					<slot></slot>
				</main>
			</ScrollArea>
		</div>
	</div>
{:else if isLoggedIn === false}
	<div class="fixed flex h-screen w-screen items-center justify-center">
		<Card class="w-[300px]">
			<CardHeader>
				<CardTitle>Not logged in</CardTitle>
				<CardDescription>Redirecting you to to the login...</CardDescription>
				<CardContent class="px-0">
					<a href="/login/" class="text-xs text-blue-500 underline underline-offset-4"
						>If you are not automatically redirected, click here</a
					>
				</CardContent>
			</CardHeader>
		</Card>
	</div>
{:else if isLoggedIn === null}
	<Skeleton class="fixed flex h-screen w-screen flex-col items-center justify-center">
		<LoaderIcon class="size-8 animate-spin" />
		<div>Logging you in...</div>
	</Skeleton>
{/if}
