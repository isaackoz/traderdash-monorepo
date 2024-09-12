<script lang="ts">
	import { page } from '$app/stores';

	export let title = 'Home';
	export let description = 'A cross-exchange, realtime trading journal platform';
	export let image = 'https://traderdash.app/logo.png';
</script>

<svelte:head>
	<title>{title} | TraderDash.app</title>
	<meta name="description" content={description} />
	<meta property="og_site_name" content="TraderDash.app" />
	<meta property="og:url" content="https://www.traderdash.app{$page.url.pathname.toString()}" />
	<meta property="og:type" content="website" />
	<meta property="og:title" content={title} />
	<meta property="og:description" content={description} />
	<meta property="og:image" content={image} />

	<meta name="twitter:card" content="summary_large_image" />
	<meta property="twitter:domain" content="Traderdash.app" />
	<meta
		property="twitter:url"
		content="https://www.traderdash.app{$page.url.pathname.toString()}"
	/>
	<meta name="twitter:title" content={title} />
	<meta name="twitter:description" content={description} />
	<meta name="twitter:image" content={image} />
	{@html `  <script type="application/ld+json">{
   "@context": "https://schema.org",
   "@type": "Website",
   "name": "${title} | traderdash.app,
   "url": "https//www.traderdash.app${$page.url.pathname}",
   "logo": ${image}  }</script>`}
</svelte:head>
