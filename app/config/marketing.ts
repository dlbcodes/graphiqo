import type { SiteConfig, FaqItem, NavItem, PlanItem } from "~/types/marketing";


export const siteConfig: SiteConfig = {
	name: "Liqo",
	title: "Liqo | Stop Sharing Buttons. Start Sharing Stories.",
	description: "The story-driven alternative to boring link lists.",
	defaultOgImage: "/og-image.png",
	links: {
		x: "https://x.com/liqo_app",
		instagram: "https://instagram.com/",
	},
	email: "hello@liqo.app",
};

export const pricing = [
	{
		label: "Free",
		price: "0",
		description: "Create and share up to 5 charts using our essential tools and templates.",
		features: [
			"Up to 5 charts",
			"Unlimited shares",
			"Access to basic templates",
			"Basic color schemes",
			"Graphiqo watermark on charts",
		],
	},
	{
		label: "Pro",
		price: "14",
		description: "Unlock full customization, premium templates, and advanced branding features.",
		features: [
			"Custom colors & fonts",
			"Access to all premium templates",
			"Remove Graphiqo watermark",
			"Add your own logo or watermark",
			"Priority support",
		],
	},
];



export const faqs = [
	{
		question: "Is this better than a standard link list?",
		answer:
			"Yes. Standard links are static and boring. Liqo turns your bio into a high-energy story that keeps users in the 'flow' of social media instead of hitting them with a dry list of buttons.",
	},
	{
		question: "Will it slow down my bio link?",
		answer:
			"Not at all. We optimized Liqo for speed. The stories load instantly so your followers don't bounce while waiting for a heavy page to load.",
	},
	{
		question: "Is it hard to set up a story?",
		answer:
			"If you can post on Instagram, you can use Liqo. Just upload your media, add your links, and you're live in minutes. No 'setup maze' required.",
	},
	{
		question: "Does it work on all mobile browsers?",
		answer:
			"Absolutely. It is designed mobile-first to feel native whether your users are coming from Instagram, TikTok, or Twitter.",
	},
	{
		question: "Can I track how many people 'tapped' through?",
		answer:
			"Yes. You get clear analytics on every slide. You’ll know exactly where people are engaging and where they are dropping off.",
	},
	{
		question: "Can I customize the colors and branding?",
		answer:
			"Of course. Your story should look like your brand. You can customize the theme to match your aesthetic perfectly.",
	},
	{
		question: "Can I still have a 'traditional' link list if I want?",
		answer:
			"You can mix and match. Use a story for your main launch and keep your secondary links easily accessible at the end of the journey.",
	},
	{
		question: "How many stories can I create?",
		answer:
			"The Free plan lets you get started immediately. Our Pro plan offers unlimited stories and deeper analytics for power creators.",
	},
	{
		question: "Is there a free plan?",
		answer:
			"Yep. You can start building your dynamic bio for free—perfect for testing the concept with your audience.",
	},
	{
		question: "What if I want to change a link quickly?",
		answer:
			"Updates are instant. Change a destination URL or swap an image in the dashboard and your bio link updates everywhere immediately.",
	},
	{
		question: "Can I cancel my Pro subscription anytime?",
		answer:
			"100%. No contracts, no lock-in. We want you here because you love the product, not because of a bill.",
	},
	{
		question: "Do you offer support if I get stuck?",
		answer:
			"Definitely. Reach out via the dashboard or Twitter and we'll help you get your story looking perfect.",
	},
];
