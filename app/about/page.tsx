"use client";

import { Navbar } from "@/components/layout/navbar";
import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Target, Users, Zap, Award, Heart, Globe } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
      <Navbar />

      {/* Hero Section */}
      <div className="relative h-80 w-full overflow-hidden bg-gradient-to-r from-primary/20 via-purple-600/20 to-blue-600/20">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background"></div>
        <div className="container mx-auto px-4 h-full flex flex-col justify-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl"
          >
            <Badge className="mb-4">About Us</Badge>
            <h1 className="text-4xl md:text-6xl font-bold mb-6">Revolutionizing Education with AI</h1>
            <p className="text-lg text-muted-foreground">
              MR5 School is an AI-powered learning platform that blends human expertise with intelligent avatars to deliver personalized education at scale.
            </p>
          </motion.div>
        </div>
      </div>

      <main className="container max-w-7xl mx-auto px-4 sm:px-6 py-16">
        {/* Mission Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-20"
        >
          <Card className="border-border/50 shadow-lg">
            <CardHeader className="text-center pb-8">
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <Target className="h-8 w-8 text-primary" />
              </div>
              <CardTitle className="text-3xl">Our Mission</CardTitle>
            </CardHeader>
            <CardContent className="max-w-3xl mx-auto">
              <p className="text-lg text-muted-foreground text-center leading-relaxed">
                To democratize access to world-class education by combining cutting-edge AI technology with proven teaching methodologies. We believe every student deserves a personalized learning experience that adapts to their unique needs, pace, and learning style.
              </p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Values Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mb-20"
        >
          <h2 className="text-3xl font-bold text-center mb-12">Our Core Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: Zap,
                title: "Innovation",
                description: "Pushing the boundaries of what's possible in education technology.",
                color: "text-yellow-500",
                bg: "bg-yellow-500/10"
              },
              {
                icon: Users,
                title: "Accessibility",
                description: "Making quality education available to everyone, everywhere.",
                color: "text-blue-500",
                bg: "bg-blue-500/10"
              },
              {
                icon: Award,
                title: "Excellence",
                description: "Maintaining the highest standards in content and delivery.",
                color: "text-purple-500",
                bg: "bg-purple-500/10"
              },
              {
                icon: Heart,
                title: "Empathy",
                description: "Understanding and supporting each learner's unique journey.",
                color: "text-rose-500",
                bg: "bg-rose-500/10"
              },
              {
                icon: Globe,
                title: "Global Impact",
                description: "Creating positive change in communities worldwide.",
                color: "text-green-500",
                bg: "bg-green-500/10"
              },
              {
                icon: Target,
                title: "Results-Driven",
                description: "Focused on measurable outcomes and student success.",
                color: "text-orange-500",
                bg: "bg-orange-500/10"
              }
            ].map((value, index) => (
              <Card key={index} className="border-border/50 shadow-sm hover:shadow-md transition-all hover:-translate-y-1">
                <CardHeader>
                  <div className={`w-12 h-12 rounded-2xl ${value.bg} flex items-center justify-center mb-4`}>
                    <value.icon className={`h-6 w-6 ${value.color}`} />
                  </div>
                  <CardTitle className="text-xl">{value.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </motion.div>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <Card className="border-border/50 shadow-lg bg-gradient-to-br from-primary/5 to-purple-600/5">
            <CardContent className="p-12">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                {[
                  { label: "Students", value: "10,000+" },
                  { label: "Courses", value: "150+" },
                  { label: "Instructors", value: "50+" },
                  { label: "Countries", value: "25+" }
                ].map((stat, index) => (
                  <div key={index} className="text-center">
                    <div className="text-4xl md:text-5xl font-bold text-primary mb-2">{stat.value}</div>
                    <div className="text-sm text-muted-foreground uppercase tracking-wider">{stat.label}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </main>
    </div>
  );
}
