import { Metadata } from "next";

export interface SEOConfig {
	title: string;
	description: string;
	keywords?: string[];
	image?: string;
	url?: string;
	type?: "website" | "article" | "product";
	author?: string;
	publishedTime?: string;
	modifiedTime?: string;
	noIndex?: boolean;
	noFollow?: boolean;
}

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://mr5school.com";
const siteName = "MR5 School";
const defaultImage = `${siteUrl}/images/mr5-logo.png`;

export function generateMetadata(config: SEOConfig): Metadata {
	const {
		title,
		description,
		keywords = [],
		image = defaultImage,
		url,
		type = "website",
		author,
		publishedTime,
		modifiedTime,
		noIndex = false,
		noFollow = false,
	} = config;

	const fullTitle = `${title} | ${siteName}`;
	const canonicalUrl = url ? `${siteUrl}${url}` : siteUrl;
	const ogImage = image.startsWith("http") ? image : `${siteUrl}${image}`;

	const robots = [
		noIndex ? "noindex" : "index",
		noFollow ? "nofollow" : "follow",
		"max-image-preview:large",
		"max-snippet:-1",
		"max-video-preview:-1",
	].join(", ");

	return {
		title: {
			default: fullTitle,
			template: `%s | ${siteName}`,
		},
		description,
		keywords: keywords.length > 0 ? keywords.join(", ") : undefined,
		authors: author ? [{ name: author }] : undefined,
		creator: siteName,
		publisher: siteName,
		metadataBase: new URL(siteUrl),
		alternates: {
			canonical: canonicalUrl,
		},
		robots: {
			index: !noIndex,
			follow: !noFollow,
			googleBot: {
				index: !noIndex,
				follow: !noFollow,
				"max-video-preview": -1,
				"max-image-preview": "large",
				"max-snippet": -1,
			},
		},
		openGraph: {
			type,
			locale: "en_US",
			url: canonicalUrl,
			siteName,
			title: fullTitle,
			description,
			images: [
				{
					url: ogImage,
					width: 1200,
					height: 630,
					alt: title,
				},
			],
			publishedTime,
			modifiedTime,
			authors: author ? [author] : undefined,
		},
		twitter: {
			card: "summary_large_image",
			title: fullTitle,
			description,
			images: [ogImage],
			creator: "@mr5school",
			site: "@mr5school",
		},
		verification: {
			google: process.env.NEXT_PUBLIC_GOOGLE_VERIFICATION,
			yandex: process.env.NEXT_PUBLIC_YANDEX_VERIFICATION,
			yahoo: process.env.NEXT_PUBLIC_YAHOO_VERIFICATION,
		},
	};
}

export function generateStructuredData(type: "Organization" | "WebSite" | "Course" | "BreadcrumbList", data?: any) {
	const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://mr5school.com";

	switch (type) {
		case "Organization":
			return {
				"@context": "https://schema.org",
				"@type": "Organization",
				name: "MR5 School",
				url: baseUrl,
				logo: `${baseUrl}/images/mr5-logo.png`,
				description: "Advanced learning platform with AI-powered avatars and interactive courses",
				sameAs: [
					"https://www.facebook.com/mr5school",
					"https://www.twitter.com/mr5school",
					"https://www.linkedin.com/company/mr5school",
				],
				contactPoint: {
					"@type": "ContactPoint",
					contactType: "Customer Service",
					email: "support@mr5school.com",
				},
			};

		case "WebSite":
			return {
				"@context": "https://schema.org",
				"@type": "WebSite",
				name: "MR5 School",
				url: baseUrl,
				potentialAction: {
					"@type": "SearchAction",
					target: {
						"@type": "EntryPoint",
						urlTemplate: `${baseUrl}/courses?search={search_term_string}`,
					},
					"query-input": "required name=search_term_string",
				},
			};

		case "Course":
			return {
				"@context": "https://schema.org",
				"@type": "Course",
				name: data.name,
				description: data.description,
				provider: {
					"@type": "Organization",
					name: "MR5 School",
					url: baseUrl,
				},
				image: data.image || `${baseUrl}/images/mr5-logo.png`,
				offers: {
					"@type": "Offer",
					price: data.price,
					priceCurrency: "USD",
					availability: "https://schema.org/InStock",
				},
				aggregateRating: data.rating
					? {
							"@type": "AggregateRating",
							ratingValue: data.rating,
							reviewCount: data.reviewCount || 0,
						}
					: undefined,
			};

		case "BreadcrumbList":
			return {
				"@context": "https://schema.org",
				"@type": "BreadcrumbList",
				itemListElement: data.items.map((item: any, index: number) => ({
					"@type": "ListItem",
					position: index + 1,
					name: item.name,
					item: item.url,
				})),
			};

		default:
			return null;
	}
}

