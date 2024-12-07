import type { PortfolioTreemapNode } from '$lib/types/portfolio';
import { init as eChartsInit, type EChartsOption } from 'echarts';

export function tickerTreeMap(node: HTMLElement, data: PortfolioTreemapNode[]) {
	$effect(() => {
		const options: EChartsOption = {
			title: {
				text: 'Ticker Distribution',
				left: 'center',
				textStyle: {
					color: '#fff'
				}
			},
			series: [
				{
					type: 'treemap',
					data: data
				}
			]
		};
		const chart = eChartsInit(node);
		chart.setOption(options);
	});
}
