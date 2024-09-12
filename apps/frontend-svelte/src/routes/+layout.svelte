<script lang="ts">
	import '@fontsource-variable/work-sans';
	import '../app.css';
	import CookieConsent from '$lib/components/CookieConsent.svelte';
	import { initAuth } from '$lib/auth';
	import { Toaster } from '$lib/components/ui/sonner';

	initAuth();
</script>

<Toaster />
<div class="relative">
	<CookieConsent />
	<slot></slot>
</div>
