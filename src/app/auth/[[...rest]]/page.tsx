"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import {
  Globe,
  Users,
  Zap,
  ChevronRight,
  Github,
  Twitter,
  Linkedin,
  Heart,
  MessageCircle,
  Share2,
  Volume2
} from "lucide-react";
import AuthCard from "./card";
import { Image } from "@nextui-org/image";

export default function LandingPage() {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });

  const { scrollYProgress } = useScroll();
  const headerBackground = useTransform(
    scrollYProgress,
    [0, 0.1],
    ["rgba(0, 0, 0, 0)", "rgba(0, 0, 0, 0.8)"]
  );

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setCursorPosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  const scrollToJoin = () => {
    const joinSection = document.getElementById("join");
    if (joinSection) {
      joinSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage:
            'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.05"%3E%3Cpath d="M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
          backgroundAttachment: "fixed"
        }}
      />
      <div
        className="absolute inset-0 z-0 bg-gradient-radial from-blue-500/20 via-purple-500/20 to-transparent"
        style={{
          backgroundPosition: `${cursorPosition.x}px ${cursorPosition.y}px`,
          backgroundSize: "600px 600px",
          backgroundRepeat: "no-repeat"
        }}
      />
      <div
        className="fixed w-8 h-8 rounded-full bg-blue-500 mix-blend-screen pointer-events-none z-50 hidden md:block"
        style={{
          left: cursorPosition.x - 16,
          top: cursorPosition.y - 16,
          transition: "left 0.1s, top 0.1s"
        }}
      />
      <motion.header
        className="fixed top-0 left-0 right-0 z-40"
        style={{ backgroundColor: headerBackground }}
      >
        <nav className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
            ECHO
          </h1>
          <div className="hidden md:flex space-x-6">
            <a
              href="#features"
              className="hover:text-blue-400 transition-colors"
            >
              Features
            </a>
            <a
              href="#community"
              className="hover:text-blue-400 transition-colors"
            >
              Community
            </a>
            <a href="#join" className="hover:text-blue-400 transition-colors">
              Join
            </a>
          </div>
          <Button
            onClick={scrollToJoin}
            className="bg-blue-600 text-white hover:bg-blue-700 transition-colors"
          >
            Sign Up
          </Button>
        </nav>
      </motion.header>

      <main>
        {/* Hero Section */}
        <motion.section
          className="pt-32 pb-20 px-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="container mx-auto text-center">
            <h2 className="text-6xl md:text-8xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 animate-pulse">
              Amplify Your Voice
            </h2>
            <p className="text-2xl md:text-3xl mb-8 text-gray-300">
              Join ECHO, where your thoughts resonate and connections amplify.
            </p>
            <Button
              size="lg"
              onClick={scrollToJoin}
              className="text-lg px-8 py-6 bg-blue-600 text-white hover:bg-blue-700 transition-colors animate-bounce"
            >
              Get Started <ChevronRight className="ml-2" />
            </Button>
          </div>
        </motion.section>

        {/* Features Section */}
        <section id="features" className="py-20 px-4">
          <div className="container mx-auto">
            <h3 className="text-4xl font-bold mb-12 text-center text-blue-400">
              Why ECHO Resonates
            </h3>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  icon: Globe,
                  title: "Global Reach",
                  description: "Your voice, heard worldwide"
                },
                {
                  icon: Users,
                  title: "Vibrant Communities",
                  description: "Find your frequency, join the conversation"
                },
                {
                  icon: Zap,
                  title: "Instant Connections",
                  description: "Real-time interactions, lasting impressions"
                }
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card className="bg-gray-900 border-none h-full hover:bg-gray-800 transition-all duration-300 transform hover:scale-105 hover:rotate-3">
                    <CardContent className="pt-6">
                      <feature.icon className="w-16 h-16 mb-4 text-blue-400" />
                      <h4 className="text-2xl font-semibold mb-2 text-purple-400">
                        {feature.title}
                      </h4>
                      <p className="text-gray-300 text-lg">
                        {feature.description}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Community Section */}
        <section id="community" className="py-20 px-4 bg-gray-900">
          <div className="container mx-auto text-center">
            <h3 className="text-4xl font-bold mb-12 text-blue-400">
              Join Our Resonant Community
            </h3>
            <div className="flex flex-wrap justify-center gap-6">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  whileHover={{ scale: 1.1, rotate: 12 }}
                >
                  <Avatar className="w-20 h-20 border-2 border-purple-500">
                    <AvatarImage src={`https://i.pravatar.cc/150?img=${i}`} />
                    <AvatarFallback>U{i}</AvatarFallback>
                  </Avatar>
                </motion.div>
              ))}
            </div>
            <p className="mt-12 text-2xl text-gray-300">
              Millions are already echoing. Will you join the chorus?
            </p>
          </div>
        </section>

        {/* Interactive Post Preview */}
        <section className="py-20 px-4">
          <div className="container mx-auto max-w-2xl">
            <h3 className="text-4xl font-bold mb-12 text-center text-blue-400">
              Experience the Resonance
            </h3>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              whileHover={{ scale: 1.05 }}
            >
              <Card className="bg-gray-800 border-none h-full lg:w-[500px] md:w-[400px] sm:w-[300px]">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    <Avatar className="w-12 h-12 border-2 border-purple-500">
                      <AvatarImage src="https://i.pravatar.cc/150?img=30" />
                      <AvatarFallback>JD</AvatarFallback>
                    </Avatar>
                    <div className="ml-4">
                      <p className="font-semibold">Jane Doe</p>
                      <p className="text-sm text-gray-400">@jane_echoes</p>
                    </div>
                  </div>
                  <p className="text-lg mb-4">
                    Just joined ECHO and I&apos;m loving the vibe here! 🎉
                    #NewVoice #ECHOchamber
                  </p>
                  <div className="relative">
                    <Image
                      src="/images/ECHO-logo.png"
                      alt="Abstract digital wave"
                      className="w-full rounded-lg mb-4"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500/50 to-purple-500/50 mix-blend-overlay rounded-lg" />
                  </div>
                  <div className="flex justify-between items-center">
                    <Button
                      variant="ghost"
                      className="text-pink-400 hover:text-pink-300 hover:bg-pink-400/20 transition-colors group"
                    >
                      <Heart className="w-5 h-5 mr-2 group-hover:animate-ping" />
                      <span>1.2k</span>
                    </Button>
                    <Button
                      variant="ghost"
                      className="text-blue-400 hover:text-blue-300 hover:bg-blue-400/20 transition-colors group"
                    >
                      <MessageCircle className="w-5 h-5 mr-2 group-hover:animate-bounce" />
                      <span>234</span>
                    </Button>
                    <Button
                      variant="ghost"
                      className="text-green-400 hover:text-green-300 hover:bg-green-400/20 transition-colors group"
                    >
                      <Share2 className="w-5 h-5 mr-2 group-hover:animate-pulse" />
                      <span>56</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </section>

        {/* Join Section */}
        <section id="join" className="py-20 px-4 bg-gray-900">
          <div className="container mx-auto max-w-md text-center">
            <h3 className="text-4xl font-bold mb-6 text-blue-400">
              Ready to Echo?
            </h3>
            <p className="mb-8 text-gray-300 text-xl">
              Join ECHO now and let your voice resonate!
            </p>
            <div className="flex justify-center">
              <AuthCard />
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-gray-900 py-12 px-4">
        <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 mb-4 md:mb-0">
            © 2024 ECHO. All rights reserved.
          </p>
          <div className="flex space-x-6">
            <a
              href="#"
              className="text-gray-400 hover:text-blue-400 transition-colors transform hover:scale-110"
            >
              <Github className="w-8 h-8" />
            </a>
            <a
              href="#"
              className="text-gray-400 hover:text-blue-400 transition-colors transform hover:scale-110"
            >
              <Twitter className="w-8 h-8" />
            </a>
            <a
              href="#"
              className="text-gray-400 hover:text-blue-400 transition-colors transform hover:scale-110"
            >
              <Linkedin className="w-8 h-8" />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
