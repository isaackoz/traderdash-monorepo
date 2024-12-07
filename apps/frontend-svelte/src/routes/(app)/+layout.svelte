<script lang="ts">
	import NavLinkList from '$lib/components/layout/NavLinkList.svelte';
	import { ScrollArea } from '$lib/components/ui/scroll-area';
	import Header from '$lib/components/layout/Header.svelte';
	import Seo from '$lib/components/SEO.svelte';
	import {
		Card,
		CardContent,
		CardDescription,
		CardHeader,
		CardTitle
	} from '$lib/components/ui/card';
	import { serverStatusStore } from '$lib/stores/global.js';
	import { fade } from 'svelte/transition';
	import { QueryClient, QueryClientProvider } from '@tanstack/svelte-query';
	import { browser } from '$app/environment';
	import type { LayoutData } from './$types';
	import { setConnectionState } from '$lib/context/connection-context.svelte';

	export let data: LayoutData;

	const serverStatus = serverStatusStore();
</script>

<QueryClientProvider client={data.queryClient}>
	<Seo title="Trades" description="View your trades." />

	{#if $serverStatus === 'dead'}
		<div
			class="bg-muted text-foreground fixed bottom-12 right-1/2 z-[999] translate-x-1/2 rounded-xl border-2 border-red-900 p-2 shadow-sm shadow-orange-900"
			in:fade
			out:fade
		>
			<p class="">Unable to reach API server</p>
			<a
				href="https://traderdash.instatus.com/"
				target="_blank"
				referrerpolicy="no-referrer"
				class="text-sm text-blue-400 underline">Check for status updates &rarr;</a
			>
		</div>
	{/if}

	{#if data.isAuth}
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
					<main class="h-full min-h-[calc(100vh-3.5rem)] px-2 xl:px-4">
						<slot></slot>
					</main>
				</ScrollArea>
			</div>
		</div>
	{:else}
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
		<!-- {:else if isLoggedIn === null}
	<Skeleton class="fixed flex h-screen w-screen flex-col items-center justify-center">
		<LoaderIcon class="size-8 animate-spin" />
		<div>Logging you in...</div>
	</Skeleton> -->
	{/if}
</QueryClientProvider>
