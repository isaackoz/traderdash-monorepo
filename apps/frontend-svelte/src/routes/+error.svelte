<script>
	import { Button } from '$lib/components/ui/button';
	import {
		Card,
		CardContent,
		CardDescription,
		CardFooter,
		CardHeader,
		CardTitle
	} from '$lib/components/ui/card';
</script>

<div class="flex h-screen w-full items-center justify-center">
	<Card>
		<CardHeader>
			<CardTitle>404</CardTitle>
			<CardDescription>This page could not be found</CardDescription>
		</CardHeader>
		<CardFooter class="flex w-full flex-col space-y-2">
			<Button class="w-full" variant="outline" href="/">Index</Button>
			<Button class="w-full" autofocus href="/home/">Dashboard Home</Button>
		</CardFooter>
	</Card>
</div>
