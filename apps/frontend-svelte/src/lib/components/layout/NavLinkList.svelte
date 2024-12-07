<script lang="ts">
	import type { TNavLinkList, TNavLinkParent } from '../../../types/ui/NavLink';
	import {
		BitcoinIcon,
		ChevronDown,
		HomeIcon,
		LandmarkIcon,
		Link,
		NotebookTextIcon,
		Skull,
		UnplugIcon
	} from 'lucide-svelte';
	import NavLink from './NavLink.svelte';
	import Calendar from 'lucide-svelte/icons/calendar';
	import Bell from 'lucide-svelte/icons/bell';
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
				label: 'Trades',
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
				label: 'Connections',
				icon: UnplugIcon
			},
			children: [
				{
					href: '/connections/',
					label: 'Manage'
				},
				{
					href: '/connections/add',
					label: 'Add new'
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
