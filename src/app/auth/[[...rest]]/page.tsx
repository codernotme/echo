"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@nextui-org/button";
import { Code, Terminal, Share2, Users, ChevronRight } from "lucide-react";
import { gsap } from "gsap";
import Link from "next/link";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import AuthCard from "./card";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from "@nextui-org/modal"; // Adjust imports as per your modal component

export default function LandingPage() {
  const [scrolled, setScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(true); // State to control modal visibility

  // Refs for GSAP animations
  const heroRef = useRef(null);
  const featuresRef = useRef(null);
  const howItWorksRef = useRef(null);
  const headerRef = useRef(null);

  // GSAP Animation
  useEffect(() => {
    gsap.fromTo(
      heroRef.current,
      { opacity: 0, y: 50 },
      { opacity: 1, y: 0, duration: 1, ease: "power3.out" }
    );

    gsap.fromTo(
      featuresRef.current,
      { opacity: 0, scale: 0.8 },
      { opacity: 1, scale: 1, duration: 1.5, ease: "elastic.out(1, 0.5)" }
    );

    gsap.fromTo(
      howItWorksRef.current,
      { opacity: 0, x: -50 },
      { opacity: 1, x: 0, duration: 1.5, ease: "power2.out" }
    );
  }, []);

  // Scroll handler for header transition and GSAP animation
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
      gsap.to(headerRef.current, {
        backgroundColor: window.scrollY > 50 ? "#1a202c" : "transparent",
        duration: 0.5,
        ease: "power2.out"
      });
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close modal function
  const onClose = () => setIsOpen(false);

  return (
    <div className="min-h-screen bg-gradient-to-r from-gray-900 via-gray-800 to-black text-gray-200 font-sans">
      {/* Modal */}
      <Modal isOpen={isOpen} onOpenChange={setIsOpen} className="bg-gray-700 p-4">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-3">
                Security Notice
              </ModalHeader>
              <ModalBody>
                <p className="text-md text-red-700">
                  *We take login credentials for the website, but don&apos;t worry, everything is safe and won&apos;t be used to do any harm or cause privacy leaks.*
                </p>
                <p>
                  Here is a video demo on how this site works
                </p>
                <video
                  width="100%"
                  height="auto"
                  controls
                  className="mt-4 rounded-lg"
                >
                  <source src="/path-to-video.mp4" type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              </ModalBody>
              <ModalFooter>
                <Button color="primary" radius="md" onPress={onClose}>
                  Close
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      

{/* Header */}
<header
        ref={headerRef}
        className={`fixed w-full transition-all duration-300 z-10 ${
          scrolled ? "bg-opacity-80 shadow-lg" : "bg-transparent"
        }`}
      >
        <div className="container mx-auto px-4 flex justify-between items-center py-4">
          <Link href="/" className="flex items-center space-x-2">
            <Code className="h-8 w-8 text-pink-500" />
            <span className="text-2xl font-medium text-gray-200">devhive-α</span>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <main>
        <section ref={heroRef} className="pt-32 pb-20 px-4 text-center">
          <div className="container mx-auto max-w-4xl">
            <h1 className="text-6xl md:text-7xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500">
              Connect. Code.{" "}
              <span className="text-indigo-500">Collaborate.</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-12">
              The ultimate platform for developers to share, learn, and build
              together.
            </p>
            <div className="max-w-md mx-auto">
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="shiny-cta px-2 py-4">
                    <span>Join Now</span>
                  </Button>
                </DialogTrigger>
                <DialogContent className="p-6 w-full max-w-md mx-auto bg-transparent">
                  <AuthCard />
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section ref={featuresRef} className="py-20 bg-gray-800">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
              Why Developers Choose Us
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  icon: <Terminal className="h-8 w-8 text-indigo-500" />,
                  title: "Code Sharing",
                  description: "Share and discuss code snippets with ease."
                },
                {
                  icon: <Users className="h-8 w-8 text-indigo-500" />,
                  title: "Developer Network",
                  description: "Connect with developers worldwide."
                },
                {
                  icon: <Share2 className="h-8 w-8 text-indigo-500" />,
                  title: "Collaborative Projects",
                  description: "Find partners for your next big idea."
                }
              ].map((feature, index) => (
                <div
                  key={index}
                  className="bg-gray-900 p-6 rounded-lg shadow-lg hover:shadow-xl transition-transform transform hover:scale-105"
                >
                  <div className="mb-4">{feature.icon}</div>
                  <h3 className="text-xl font-semibold mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-400">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section ref={howItWorksRef} className="py-20">
          <div className="container mx-auto px-4 max-w-4xl">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
              How It Works
            </h2>
            <div className="space-y-12">
              {[
                {
                  title: "Create Your Profile",
                  description:
                    "Sign up and showcase your skills, projects, and experiences."
                },
                {
                  title: "Connect with Peers",
                  description:
                    "Find and follow developers with similar interests and expertise."
                },
                {
                  title: "Share Your Code",
                  description:
                    "Post snippets, get feedback, and collaborate on projects."
                },
                {
                  title: "Grow Your Network",
                  description:
                    "Engage in discussions, join groups, and expand your professional circle."
                }
              ].map((step, index) => (
                <div key={index} className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-indigo-500 text-white flex items-center justify-center font-bold">
                    {index + 1}
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                    <p className="text-gray-400">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Call to Action Section */}
        <section className="py-20 bg-gradient-to-r from-pink-500 to-indigo-500 text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to elevate your coding journey?
            </h2>
            <p className="text-xl mb-8">
              Join thousands of developers already connecting on devhive.
            </p>
            <Button className="bg-white text-indigo-500 hover:bg-gray-100 px-8 py-3 text-lg font-semibold rounded-full transition-all inline-flex items-center">
              <Dialog>
                <DialogTrigger asChild>
                  <span>Join Now</span>
                </DialogTrigger>
                <DialogContent className="p-6 w-full max-w-md mx-auto bg-transparent">
                  <AuthCard />
                </DialogContent>
              </Dialog>
              <ChevronRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <Code className="h-8 w-8 text-pink-500" />
              <span className="text-2xl font-medium text-gray-200">
                devhive
              </span>
            </div>
            <div className="text-gray-400">
              &copy; 2024 devhive. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
