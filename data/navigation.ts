import type { LucideIcon } from "lucide-react";
import {
    LayoutDashboard,
    Users,
    GraduationCap,
    BookOpen,
    Settings,
    BarChart3,
    FileText,
    CreditCard,
    UserCog,
    MessageSquare,
    Calendar,
    Award,
    TrendingUp,
    ShoppingCart,
    Mail,
    Bot,
} from "lucide-react";

export interface NavigationItem {
    title: string;
    href?: string;
    icon?: LucideIcon;
    label?: string;
    items?: NavigationItem[];
}

export interface NavigationSection {
    title: string;
    items: NavigationItem[];
}

// Admin Navigation
export const adminNavigation: NavigationSection[] = [
    {
        title: "Overview",
        items: [
            {
                title: "Dashboard",
                href: "/admin",
                icon: LayoutDashboard,
            },
            {
                title: "Analytics",
                href: "/admin/analytics",
                icon: BarChart3,
            },
        ],
    },
    {
        title: "Management",
        items: [
            {
                title: "Users",
                href: "/admin/users",
                icon: Users,
            },
            {
                title: "AI-TEACHERs",
                href: "/admin/AI-TEACHERs",
                icon: GraduationCap,
            },
            {
                title: "Students",
                href: "/admin/students",
                icon: UserCog,
            },
            {
                title: "Courses",
                href: "/admin/courses",
                icon: BookOpen,
            },
            {
                title: "Enrollments",
                href: "/admin/enrollments",
                icon: Award,
            },
        ],
    },
    {
        title: "Finance",
        items: [
            {
                title: "Payments",
                href: "/admin/payments",
                icon: CreditCard,
            },
            {
                title: "Revenue",
                href: "/admin/revenue",
                icon: TrendingUp,
            },
        ],
    },
    {
        title: "System",
        items: [
            {
                title: "Settings",
                href: "/admin/settings",
                icon: Settings,
            },
            {
                title: "Reports",
                href: "/admin/reports",
                icon: FileText,
            },
        ],
    },
];

// AI-TEACHER Navigation
export const teacherNavigation: NavigationSection[] = [
    {
        title: "Overview",
        items: [
            {
                title: "Dashboard",
                href: "/AI-TEACHER",
                icon: LayoutDashboard,
            },
        ],
    },
    {
        title: "Teaching",
        items: [
            {
                title: "My Courses",
                href: "/AI-TEACHER/courses",
                icon: BookOpen,
            },
            {
                title: "Students",
                href: "/AI-TEACHER/students",
                icon: Users,
            },
            {
                title: "Assignments",
                href: "/AI-TEACHER/assignments",
                icon: FileText,
            },
            {
                title: "Schedule",
                href: "/AI-TEACHER/schedule",
                icon: Calendar,
            },
        ],
    },
    {
        title: "Communication",
        items: [
            {
                title: "Messages",
                href: "/AI-TEACHER/messages",
                icon: MessageSquare,
            },
        ],
    },
    {
        title: "Account",
        items: [
            {
                title: "Settings",
                href: "/AI-TEACHER/settings",
                icon: Settings,
            },
        ],
    },
    {
        title: "Tools",
        items: [
            {
                title: "MMS Solver",
                href: "/solver",
                icon: Bot,
            },
        ],
    },
];

// Student Navigation
export const studentNavigation: NavigationSection[] = [
    {
        title: "Overview",
        items: [
            {
                title: "Dashboard",
                href: "/student",
                icon: LayoutDashboard,
            },
        ],
    },
    {
        title: "Learning",
        items: [
            {
                title: "My Courses",
                href: "/student/courses",
                icon: BookOpen,
            },
            {
                title: "Assignments",
                href: "/student/assignments",
                icon: FileText,
            },
            {
                title: "Grades",
                href: "/student/grades",
                icon: Award,
            },
            {
                title: "Schedule",
                href: "/student/schedule",
                icon: Calendar,
            },
        ],
    },
    {
        title: "Resources",
        items: [
            {
                title: "Messages",
                href: "/student/messages",
                icon: MessageSquare,
            },
            {
                title: "MMS Solver",
                href: "/solver",
                icon: Bot,
            },
        ],
    },
    {
        title: "Account",
        items: [
            {
                title: "Settings",
                href: "/student/settings",
                icon: Settings,
            },
        ],
    },
];
