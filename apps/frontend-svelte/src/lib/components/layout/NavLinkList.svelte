<script lang="ts">
	import type { TNavLinkList, TNavLinkParent } from '../../../types/ui/NavLink';
	import {
		BitcoinIcon,
		ChevronDown,
		HomeIcon,
		LandmarkIcon,
		Link,
		NotebookTextIcon,
		Skull
	} from 'lucide-svelte';
	import NavLink from './NavLink.svelte';
	const navLinks: TNavLinkList = [
		{
			parent: {
				href: '/home/',
				label: 'Home',
				icon: HomeIcon
			}
		},
		{
			parent: {
				href: '/trades/',
				label: 'My Trades',
				icon: NotebookTextIcon
			}
		},
		{
			parent: {
				href: '/portfolio/',
				label: 'Portfolio',
				icon: LandmarkIcon
			}
		},
		{
			parent: {
				label: 'Crypto',
				icon: BitcoinIcon
			},
			children: [
				{
					href: '/crypto/list',
					label: 'Crypto List'
				},
				{
					href: '/crypto/list',
					label: 'Top Performers'
				}
			]
		}
	];
</script>

<ul class="mt-4 space-y-2">
	{#each navLinks as link}
		<li>
			<NavLink {...link} />
		</li>
	{/each}
</ul>
