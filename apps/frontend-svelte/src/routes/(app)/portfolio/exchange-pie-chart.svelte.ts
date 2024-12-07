import type { AggregatedExchange } from '$lib/types/portfolio';
import { init as eChartsInit, type EChartsOption } from 'echarts';

export function pieChart(node: HTMLElement, data: AggregatedExchange[]) {
	$effect(() => {
		console.log('Running');
		const options: EChartsOption = {
			tooltip: {
				trigger: 'item'
			},
			legend: {
				top: 0,
				left: 'center',
				textStyle: {
					color: '#fff'
				}
			},
			series: [
				{
					name: 'Exchange',
					type: 'pie',
					radius: ['40%', '70%'],
					avoidLabelOverlap: false,
					itemStyle: {
						borderRadius: 10,
						borderColor: '#fff',
						borderWidth: 2
					},
					label: {
						show: false,
						position: 'center'
					},
					emphasis: {
						label: {
							show: true,
							fontSize: 40,
							fontWeight: 'bold'
						}
					},
					labelLine: {
						show: false
					},
					data: data
				}
			]
		};
		const chart = eChartsInit(node);
		chart.setOption(options);
	});
}
