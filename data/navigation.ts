import React from 'react';
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  BookOpen,
  BarChart3,
  Settings,
  CreditCard,
  FileText,
  Calendar,
  UserCheck,
  DollarSign,
  Globe,
  Trophy,
} from "lucide-react";

// Define the navigation item type
export interface NavigationItem {
  title: string;
  href?: string;
  icon?: React.ForwardRefExoticComponent<Omit<React.SVGProps<SVGSVGElement>, "ref"> & React.RefAttributes<SVGSVGElement>>;
  items?: NavigationItem[];
  label?: string;
}

export const adminNavigation: NavigationItem[] = [
  {
    title: "Overview",
    href: "/admin",
    icon: LayoutDashboard,
  },
  {
    title: "Analytics",
    href: "/admin/analytics",
    icon: BarChart3,
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
        href: "/admin/ai-teachers",
        icon: GraduationCap,
      },
      {
        title: "Students",
        href: "/admin/students",
        icon: UserCheck,
      },
      {
        title: "Courses",
        href: "/admin/courses",
        icon: BookOpen,
      },
      {
        title: "Enrollments",
        href: "/admin/enrollments",
        icon: Calendar,
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
        icon: DollarSign,
      },
      {
        title: "Regional Pricing",
        href: "/admin/pricing",
        icon: Globe,
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

export const studentNavigation: NavigationItem[] = [
  {
    title: "Dashboard",
    href: "/student/portal",
    icon: LayoutDashboard,
  },
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
    icon: Trophy,
  },
  {
    title: "Schedule",
    href: "/student/schedule",
    icon: Calendar,
  },
];

export const teacherNavigation: NavigationItem[] = [
  {
    title: "Dashboard",
    href: "/teacher",
    icon: LayoutDashboard,
  },
  {
    title: "My Classes",
    href: "/teacher/classes",
    icon: GraduationCap,
  },
  {
    title: "Course Builder",
    href: "/teacher/builder",
    icon: BookOpen,
  },
  {
    title: "Students",
    href: "/teacher/students",
    icon: Users,
  },
  {
    title: "Analytics",
    href: "/teacher/analytics",
    icon: BarChart3,
  },
];