import { generateMetadata } from "@/lib/seo";
import { Metadata } from "next";

export const metadata: Metadata = generateMetadata({
	title: "Online Courses - Programming, Web Development, Data Science",
	description:
		"Browse our comprehensive catalog of online courses in programming, web development, data science, machine learning, and more. Learn from expert instructors with interactive AI-powered learning.",
	keywords: [
		"online courses",
		"programming courses",
		"web development courses",
		"data science courses",
		"machine learning courses",
		"coding bootcamp",
		"learn programming",
		"online education",
	],
	url: "/courses",
	type: "website",
});

export default function CoursesLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return <>{children}</>;
}

