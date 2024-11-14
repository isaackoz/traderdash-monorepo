<script lang="ts">
	import { PUBLIC_CLOUDFLARE_IMG_URL } from '$env/static/public';

	let {
		imgId,
		className,
		variant = 'public'
	}: { imgId: string; className?: string; variant?: '32' | 'public' } = $props();
</script>

<img
	src={`${PUBLIC_CLOUDFLARE_IMG_URL}/${imgId}/${variant}`}
	alt="Exchange Logo"
	class={className}
/>
