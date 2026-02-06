import type { Component } from "vue";
import Link from "~/assets/icons/Link.vue";
import Instagram from "@/assets/icons/Instagram.vue"
import Twitter from "@/assets/icons/Twitter.vue"
import Facebook from "@/assets/icons/Facebook.vue"
import Youtube from "@/assets/icons/Youtube.vue"
import Linkedin from "@/assets/icons/Linkedin.vue"
import Twitch from "~/assets/icons/Twitch.vue"
import Github from "~/assets/icons/Github.vue";
import Pinterest from "~/assets/icons/Pinterest.vue";
import Tiktok from "~/assets/icons/Tiktok.vue";
import Discord from "~/assets/icons/Discord.vue";
import Spotify from "~/assets/icons/Spotify.vue";
import Snapchat from "~/assets/icons/Snapchat.vue";
import Reddit from "~/assets/icons/Reddit.vue";
import Medium from "~/assets/icons/Medium.vue";
import Telegram from "~/assets/icons/Telegram.vue";
import Whatsapp from "~/assets/icons/Whatsapp.vue";
import Dribbble from "~/assets/icons/Dribbble.vue";
import Behance from "~/assets/icons/Behance.vue";
import Website from "~/assets/icons/Website.vue";
import Email from "~/assets/icons/Email.vue";
import Phone from "~/assets/icons/Phone.vue";

export interface SocialPlatform {
	key: string;
	name: string;
	icon: Component; // Emoji or you can use icon component names
	color: string; // Brand color for styling
	placeholder: string; // Placeholder for URL input
	urlPattern?: RegExp; // Optional: validate URL format
}

export const SOCIAL_PLATFORMS: SocialPlatform[] = [
	{
		key: 'instagram',
		name: 'Instagram',
		icon: Instagram,
		color: '#E4405F',
		placeholder: 'https://instagram.com/username',
		urlPattern: /^https?:\/\/(www\.)?instagram\.com\/.+/
	},
	{
		key: 'twitter',
		name: 'Twitter / X',
		icon: Twitter,
		color: '#000000',
		placeholder: 'https://twitter.com/username',
		urlPattern: /^https?:\/\/(www\.)?(twitter|x)\.com\/.+/
	},
	{
		key: 'facebook',
		name: 'Facebook',
		icon: Facebook,
		color: '#1877F2',
		placeholder: 'https://facebook.com/username',
		urlPattern: /^https?:\/\/(www\.)?facebook\.com\/.+/
	},
	{
		key: 'linkedin',
		name: 'LinkedIn',
		icon: Linkedin,
		color: '#0A66C2',
		placeholder: 'https://linkedin.com/in/username',
		urlPattern: /^https?:\/\/(www\.)?linkedin\.com\/.+/
	},
	{
		key: 'youtube',
		name: 'YouTube',
		icon: Youtube,
		color: '#FF0000',
		placeholder: 'https://youtube.com/@channel',
		urlPattern: /^https?:\/\/(www\.)?youtube\.com\/.+/
	},
	{
		key: 'tiktok',
		name: 'TikTok',
		icon: Tiktok,
		color: '#000000',
		placeholder: 'https://tiktok.com/@username',
		urlPattern: /^https?:\/\/(www\.)?tiktok\.com\/.+/
	},
	{
		key: 'github',
		name: 'GitHub',
		icon: Github,
		color: '#181717',
		placeholder: 'https://github.com/username',
		urlPattern: /^https?:\/\/(www\.)?github\.com\/.+/
	},
	{
		key: 'twitch',
		name: 'Twitch',
		icon: Twitch,
		color: '#9146FF',
		placeholder: 'https://twitch.tv/username',
		urlPattern: /^https?:\/\/(www\.)?twitch\.tv\/.+/
	},
	{
		key: 'discord',
		name: 'Discord',
		icon: Discord,
		color: '#5865F2',
		placeholder: 'https://discord.gg/invite',
		urlPattern: /^https?:\/\/(www\.)?(discord\.gg|discord\.com\/invite)\/.+/
	},
	{
		key: 'spotify',
		name: 'Spotify',
		icon: Spotify,
		color: '#1DB954',
		placeholder: 'https://open.spotify.com/user/username',
		urlPattern: /^https?:\/\/(www\.)?open\.spotify\.com\/.+/
	},
	{
		key: 'pinterest',
		name: 'Pinterest',
		icon: Pinterest,
		color: '#E60023',
		placeholder: 'https://pinterest.com/username',
		urlPattern: /^https?:\/\/(www\.)?pinterest\.com\/.+/
	},
	{
		key: 'snapchat',
		name: 'Snapchat',
		icon: Snapchat,
		color: '#FFFC00',
		placeholder: 'https://snapchat.com/add/username',
		urlPattern: /^https?:\/\/(www\.)?snapchat\.com\/.+/
	},
	{
		key: 'reddit',
		name: 'Reddit',
		icon: Reddit,
		color: '#FF4500',
		placeholder: 'https://reddit.com/u/username',
		urlPattern: /^https?:\/\/(www\.)?reddit\.com\/.+/
	},
	{
		key: 'medium',
		name: 'Medium',
		icon: Medium,
		color: '#000000',
		placeholder: 'https://medium.com/@username',
		urlPattern: /^https?:\/\/(www\.)?medium\.com\/.+/
	},
	{
		key: 'telegram',
		name: 'Telegram',
		icon: Telegram,
		color: '#26A5E4',
		placeholder: 'https://t.me/username',
		urlPattern: /^https?:\/\/(www\.)?t\.me\/.+/
	},
	{
		key: 'whatsapp',
		name: 'WhatsApp',
		icon: Whatsapp,
		color: '#25D366',
		placeholder: 'https://wa.me/1234567890',
		urlPattern: /^https?:\/\/(www\.)?wa\.me\/.+/
	},
	{
		key: 'dribbble',
		name: 'Dribbble',
		icon: Dribbble,
		color: '#EA4C89',
		placeholder: 'https://dribbble.com/username',
		urlPattern: /^https?:\/\/(www\.)?dribbble\.com\/.+/
	},
	{
		key: 'behance',
		name: 'Behance',
		icon: Behance,
		color: '#1769FF',
		placeholder: 'https://behance.net/username',
		urlPattern: /^https?:\/\/(www\.)?behance\.net\/.+/
	},
	{
		key: 'website',
		name: 'Website',
		icon: Website,
		color: '#6366F1',
		placeholder: 'https://yourwebsite.com',
		urlPattern: /^https?:\/\/.+/
	},
	{
		key: 'email',
		name: 'Email',
		icon: Email,
		color: '#6366F1',
		placeholder: 'mailto:your@email.com',
		urlPattern: /^mailto:.+@.+\..+/
	},
	{
		key: 'phone',
		name: 'Phone',
		icon: Phone,
		color: '#6366F1',
		placeholder: 'tel:+1234567890',
		urlPattern: /^tel:\+?\d+/
	}
];

// Helper functions
export const getSocialPlatform = (key: string): SocialPlatform | undefined => {
	return SOCIAL_PLATFORMS.find(platform => platform.key === key);
};

export const getSocialPlatformIcon = (key: string): Component => {
	return getSocialPlatform(key)?.icon ?? Link;
};

export const getSocialPlatformName = (key: string): string => {
	return getSocialPlatform(key)?.name || key;
};

export const getSocialPlatformColor = (key: string): string => {
	return getSocialPlatform(key)?.color || '#6366F1';
};

export const validateSocialUrl = (platform: string, url: string): boolean => {
	const socialPlatform = getSocialPlatform(platform);
	if (!socialPlatform?.urlPattern) return true; // No pattern means no validation
	return socialPlatform.urlPattern.test(url);
};