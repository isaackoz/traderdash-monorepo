import type { ComponentType } from 'svelte';
import { type Icon } from 'lucide-svelte';

// Define the base type for TNavLink
export type TNavLinkBase = {
	label: string;
	isExternal?: boolean;
};

// Define the TNavLink type that includes href and icon for parent
export type TNavLinkWithHref = TNavLinkBase & {
	href: string;
	icon?: ComponentType<Icon>; // Parent can have an icon
};

// Define the TNavLink type that omits href (for parent with children)
export type TNavLinkWithoutHref = Omit<TNavLinkWithHref, 'href'>;

// Define the TNavLink type for children that omits icon
export type TNavLinkChild = TNavLinkBase & {
	href: string; // Child must have an href
	// icon is omitted
};

// Define the conditional type for parent based on children presence
export type TNavLinkParent =
	| {
			parent: TNavLinkWithoutHref; // Omit href if children exist
			children: TNavLinkChild[]; // children must have href, no icon
	  }
	| {
			parent: TNavLinkWithHref; // Allow href and icon if no children
			children?: undefined; // No children
	  };

// Create the list type
export type TNavLinkList = TNavLinkParent[];
