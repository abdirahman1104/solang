'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '@/utils/supabase';
import ImagePlaceholder from '@/components/ui/ImagePlaceholder';

export default function Landing() {
  const [session, setSession] = useState(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });
  }, []);

  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 }
  };

  const stagger = {
    animate: {
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Navigation */}
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
        className="fixed w-full bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm z-50 border-b border-gray-200 dark:border-gray-700"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link href="/" className="flex items-center">
                <span className="text-xl font-bold bg-gradient-to-r from-blue-500 to-blue-600 text-transparent bg-clip-text">
                  Solang
                </span>
              </Link>
            </div>
            <div className="flex items-center gap-4">
              {session ? (
                <motion.div whileHover={{ scale: 1.05 }}>
                  <Link
                    href="/dashboards"
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    Go to Dashboard
                  </Link>
                </motion.div>
              ) : (
                <>
                  <Link
                    href="/auth"
                    className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
                  >
                    Sign In
                  </Link>
                  <motion.div whileHover={{ scale: 1.05 }}>
                    <Link
                      href="/auth"
                      className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                    >
                      Get Started
                    </Link>
                  </motion.div>
                </>
              )}
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            variants={stagger}
            initial="initial"
            animate="animate"
            className="text-center"
          >
            <motion.h1
              variants={fadeIn}
              className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6"
            >
              Manage Your API Keys <br />
              <span className="bg-gradient-to-r from-blue-500 to-blue-600 text-transparent bg-clip-text">
                Securely and Efficiently
              </span>
            </motion.h1>
            <motion.p
              variants={fadeIn}
              className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto"
            >
              Solang provides a secure, intuitive platform for managing your API keys. 
              Monitor usage, set limits, and keep your keys safe.
            </motion.p>
            <motion.div
              variants={fadeIn}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <motion.div whileHover={{ scale: 1.05 }}>
                <Link
                  href="/auth"
                  className="px-8 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-lg font-medium inline-flex items-center gap-2"
                >
                  Start for Free
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }}>
                <a
                  href="#features"
                  className="px-8 py-3 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors text-lg font-medium inline-flex items-center gap-2"
                >
                  Learn More
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </a>
              </motion.div>
            </motion.div>

            {/* Dashboard Preview */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="mt-16 relative"
            >
              <div className="absolute inset-0 bg-gradient-to-t from-gray-50 dark:from-gray-900 to-transparent h-[20%] bottom-0 z-10"></div>
              <div className="relative rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=80"
                  alt="Developer working with API keys"
                  className="w-full object-cover opacity-20 absolute inset-0 h-full"
                />
                <div className="relative z-10 p-8">
                  <ImagePlaceholder className="h-12 w-48 mb-8" />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <ImagePlaceholder className="h-32" />
                    <ImagePlaceholder className="h-32" />
                    <ImagePlaceholder className="h-32" />
                    <ImagePlaceholder className="h-32" />
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Trusted By Section */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="mt-24 mb-16"
            >
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="relative">
                  {/* Background decoration */}
                  <div className="absolute inset-0 flex items-center" aria-hidden="true">
                    <div className="w-full border-t border-gray-200 dark:border-gray-700"></div>
                  </div>
                  
                  {/* Centered heading */}
                  <div className="relative flex justify-center">
                    <span className="bg-gray-50 dark:bg-gray-900 px-6 text-sm text-gray-500 dark:text-gray-400 tracking-[0.2em]">
                      TRUSTED BY DEVELOPERS WORLDWIDE
                    </span>
                  </div>
                </div>

                {/* Logos grid with stats */}
                <div className="mt-16 grid grid-cols-2 gap-8 md:grid-cols-4">
                  <motion.div
                    whileHover={{ y: -5 }}
                    className="col-span-1 flex justify-center"
                  >
                    <div className="text-center">
                      <div className="relative h-12 flex items-center justify-center">
                        <ImagePlaceholder className="w-32 h-8" />
                      </div>
                      <p className="mt-4 text-3xl font-bold text-blue-500">1M+</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">API Keys Managed</p>
                    </div>
                  </motion.div>

                  <motion.div
                    whileHover={{ y: -5 }}
                    className="col-span-1 flex justify-center"
                  >
                    <div className="text-center">
                      <div className="relative h-12 flex items-center justify-center">
                        <ImagePlaceholder className="w-32 h-8" />
                      </div>
                      <p className="mt-4 text-3xl font-bold text-blue-500">50K+</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Active Users</p>
                    </div>
                  </motion.div>

                  <motion.div
                    whileHover={{ y: -5 }}
                    className="col-span-1 flex justify-center"
                  >
                    <div className="text-center">
                      <div className="relative h-12 flex items-center justify-center">
                        <ImagePlaceholder className="w-32 h-8" />
                      </div>
                      <p className="mt-4 text-3xl font-bold text-blue-500">99.9%</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Uptime</p>
                    </div>
                  </motion.div>

                  <motion.div
                    whileHover={{ y: -5 }}
                    className="col-span-1 flex justify-center"
                  >
                    <div className="text-center">
                      <div className="relative h-12 flex items-center justify-center">
                        <ImagePlaceholder className="w-32 h-8" />
                      </div>
                      <p className="mt-4 text-3xl font-bold text-blue-500">24/7</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Support</p>
                    </div>
                  </motion.div>
                </div>

                {/* Animated ticker of technologies */}
                <div className="mt-16 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-gray-50 via-transparent to-gray-50 dark:from-gray-900 dark:to-gray-900 z-10"></div>
                  <motion.div
                    animate={{ x: [0, -1000] }}
                    transition={{
                      duration: 20,
                      repeat: Infinity,
                      ease: "linear"
                    }}
                    className="flex gap-8 whitespace-nowrap"
                  >
                    {[...Array(10)].map((_, i) => (
                      <div key={i} className="flex items-center gap-8">
                        <span className="text-gray-400 dark:text-gray-600">React</span>
                        <span className="text-gray-400 dark:text-gray-600">Node.js</span>
                        <span className="text-gray-400 dark:text-gray-600">Python</span>
                        <span className="text-gray-400 dark:text-gray-600">Java</span>
                        <span className="text-gray-400 dark:text-gray-600">Go</span>
                        <span className="text-gray-400 dark:text-gray-600">Ruby</span>
                      </div>
                    ))}
                  </motion.div>
                </div>

                {/* Trust badges */}
                <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    className="flex items-center justify-center p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm"
                  >
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                      <svg className="w-5 h-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                      SOC2 Certified
                    </div>
                  </motion.div>

                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    className="flex items-center justify-center p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm"
                  >
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                      <svg className="w-5 h-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                      GDPR Compliant
                    </div>
                  </motion.div>

                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    className="flex items-center justify-center p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm"
                  >
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                      <svg className="w-5 h-5 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                      Enterprise Ready
                    </div>
                  </motion.div>

                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    className="flex items-center justify-center p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm"
                  >
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                      <svg className="w-5 h-5 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4" />
                      </svg>
                      99.9% Uptime
                    </div>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
        id="features"
        className="py-20 bg-white dark:bg-gray-800"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="text-3xl font-bold text-gray-900 dark:text-white mb-4"
            >
              Everything You Need for API Key Management
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
              className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto"
            >
              Powerful features to help you manage and secure your API keys effectively
            </motion.p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ 
                  scale: 1.05,
                  boxShadow: "0 4px 15px rgba(0,0,0,0.1)"
                }}
                className="bg-white dark:bg-gray-800 rounded-xl transition-all overflow-hidden"
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={feature.image}
                    alt={feature.title}
                    className="w-full h-full object-cover transform hover:scale-110 transition-transform duration-500"
                  />
                </div>
                <div className="p-6">
                  <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center mb-4">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Testimonials Section */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
        className="py-20 bg-gray-50 dark:bg-gray-800/50"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Loved by Developers
            </h2>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              See what our users have to say about their experience with Solang
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg"
              >
                <div className="flex items-center mb-6">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full object-cover mr-4"
                  />
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {testimonial.name}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {testimonial.role} at {testimonial.company}
                    </p>
                  </div>
                </div>
                <blockquote className="text-gray-600 dark:text-gray-300 italic">
                  "{testimonial.quote}"
                </blockquote>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* CTA Section */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
        className="py-20 bg-gradient-to-r from-blue-500 to-blue-600"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-3xl font-bold text-white mb-4"
          >
            Ready to Get Started?
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
            className="text-blue-100 mb-8 max-w-2xl mx-auto"
          >
            Join thousands of developers who trust Solang for their API key management needs.
          </motion.p>
          <motion.div
            whileHover={{ scale: 1.05 }}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <Link
              href="/auth"
              className="inline-flex items-center gap-2 px-8 py-3 bg-white text-blue-600 rounded-lg hover:bg-blue-50 transition-colors text-lg font-medium"
            >
              Create Free Account
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </motion.div>
        </div>
      </motion.section>

      {/* Footer */}
      <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {footerLinks.map((section, index) => (
              <div key={index}>
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">
                  {section.title}
                </h3>
                <ul className="space-y-3">
                  {section.links.map((link, linkIndex) => (
                    <li key={linkIndex}>
                      <a
                        href={link.href}
                        className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
                      >
                        {link.text}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
            <p className="text-gray-500 dark:text-gray-400 text-center">
              © {new Date().getFullYear()} Solang. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

const features = [
  {
    title: 'Secure Storage',
    description: 'Your API keys are encrypted and stored with enterprise-grade security.',
    image: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=800&q=80',
    icon: (
      <svg className="w-6 h-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
      </svg>
    ),
  },
  {
    title: 'Usage Analytics',
    description: 'Monitor API key usage with detailed analytics and insights.',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80',
    icon: (
      <svg className="w-6 h-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
  },
  {
    title: 'Access Control',
    description: 'Set permissions and manage access levels for your API keys.',
    image: 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?auto=format&fit=crop&w=800&q=80',
    icon: (
      <svg className="w-6 h-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" />
      </svg>
    ),
  },
];

const testimonials = [
  {
    name: 'Sarah Chen',
    role: 'Senior Developer',
    company: 'TechCorp',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
    quote: 'Solang has transformed how we manage our API keys. The security features are outstanding.',
  },
  {
    name: 'Alex Rivera',
    role: 'Tech Lead',
    company: 'DevFlow',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80',
    quote: 'The analytics capabilities have given us insights we never had before. Highly recommended.',
  },
  {
    name: 'Emily Watson',
    role: 'CTO',
    company: 'Stackwise',
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=200&q=80',
    quote: 'Security and ease of use in one package. Solang is exactly what we needed.',
  },
];

const footerLinks = [
  {
    title: 'Product',
    links: [
      { text: 'Features', href: '#features' },
      { text: 'Pricing', href: '#' },
    ],
  },
  {
    title: 'Company',
    links: [
      { text: 'About', href: '#' },
      { text: 'Blog', href: '#' },
    ],
  },
  {
    title: 'Resources',
    links: [
      { text: 'Documentation', href: '#' },
      { text: 'Help Center', href: '#' },
    ],
  },
  {
    title: 'Legal',
    links: [
      { text: 'Privacy', href: '#' },
      { text: 'Terms', href: '#' },
    ],
  },
];
