<script lang="ts">
	let {
		title,
		subtitle
	}: {
		title: string;
		subtitle: string;
	} = $props();
</script>

<div class="">
	<h1 class="text-2xl font-bold">
		{title}
	</h1>
	<p class="text-sm text-primary/50">
		{subtitle}
	</p>
</div>
