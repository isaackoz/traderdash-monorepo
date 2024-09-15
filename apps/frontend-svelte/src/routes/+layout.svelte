<script lang="ts">
	import '@fontsource-variable/work-sans';
	import '../app.css';
	import CookieConsent from '$lib/components/CookieConsent.svelte';
	import { Toaster } from '$lib/components/ui/sonner';
	import NProgress from 'nprogress';
	import { navigating } from '$app/stores';
	import 'nprogress/nprogress.css';

	NProgress.configure({
		minimum: 0.16,
		showSpinner: false
	});

	$effect(() => {
		if ($navigating) {
			console.log('Navigating...');
			NProgress.start();
		} else NProgress.done();
	});
</script>

<Toaster />
<div class="relative">
	<CookieConsent />
	<slot></slot>
</div>
