<script lang="ts">
	import { cookieStore } from '$stores/global';
	import { fromStore } from 'svelte/store';
	import { Button } from './ui/button';
	import { Card, CardHeader, CardTitle } from './ui/card';

	const val2 = fromStore(cookieStore('consent', null));

	$effect(() => {
		console.log(val2.current);
	});
</script>

{#if val2.current === ''}
	<Card class="fixed bottom-2 left-1/2 z-50 w-[300px] -translate-x-1/2">
		<div class="p-2">
			<p class="text-xs">
				We use cookies to ensure the basic functionality of our site and to enhance your experience.
				No personal data is collected.
			</p>
			<div class="mt-6 flex justify-start space-x-2">
				<Button size="sm" class="w-full" onclick={() => (val2.current = 'accepted')}>Ok</Button>
			</div>
		</div>
	</Card>
{/if}
