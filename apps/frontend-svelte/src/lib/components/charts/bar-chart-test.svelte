<script lang="ts">
	import { onMount } from 'svelte';
	import * as echarts from 'echarts';
	import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
	import { DollarSignIcon } from 'lucide-svelte';
	import { traderdashTheme } from './theme';
	onMount(async () => {
		echarts.registerTheme('traderdash', traderdashTheme);
		const mychart = echarts.init(document.getElementById('b-chart'), 'traderdash');
		mychart.setOption({
			xAxis: {
				type: 'category',
				data: [
					'1/24',
					'2/24',
					'3/24',
					'4/24',
					'5/24',
					'6/24',
					'7/24',
					'8/24',
					'9/24',
					'10/24',
					'11/24',
					'12/24'
				]
			},
			yAxis: {
				type: 'value'
			},
			series: [
				{
					data: [820, 932, 901, 934, 1290, 1330, 1320, 932, 901, 934, 1290, 1330, 1320],
					type: 'line',
					smooth: true
				}
			],
			grid: {
				left: '10%',
				top: '5%',
				bottom: '15%',
				right: '5%'
			}
		});
	});
</script>

<Card class="w-[500px] bg-gradient-to-t from-muted/40 to-background">
	<CardHeader class="flex w-full flex-row justify-between py-2">
		<div></div>
		<div class="flex flex-col">
			<div class="text-right text-base text-orange-500">Account balance</div>
			<div class="text-4xl">$1245.00</div>
		</div>
	</CardHeader>
	<CardContent class="rounded-xl p-1 px-0">
		<div id="b-chart" style="width: 500px; height:250px"></div>
	</CardContent>
</Card>
