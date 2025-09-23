import { Link } from 'react-router-dom';
import { Sparkles, Star, Book } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <div className="max-w-6xl mx-auto px-4 py-16">
        {/* Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="flex justify-center items-center gap-6 mb-6">
            {/* Logo with rotation */}
            <motion.div
              animate={{ rotate: [0, 15, -15, 0] }}
              transition={{ repeat: Infinity, duration: 3 }}
              className="flex items-center justify-center h-48 w-48"
            >
              <img
                src="/YoungChampion.png"
                alt="App Logo"
                className="h-40 w-40 object-contain"
              />
            </motion.div>

            {/* Bible with bounce */}
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="flex items-center justify-center h-48 w-48"
            >
              <img
                src="/Bible-bgless.png"
                alt="Bible Logo"
                className="h-40 w-40 object-contain"
              />
            </motion.div>
          </div>


          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Young Champions Devotionals
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Start your day with God's word. Choose your devotional journey and grow in faith together.
          </p>
        </motion.div>

        {/* Devotional Cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        {/* Children's Card */}
        <Link to="/children" className="group">
          <motion.div
            whileHover={{ scale: 1.05, rotate: -1 }}
            whileTap={{ scale: 0.98 }}
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="bg-gradient-to-br from-yellow-200 via-green-200 to-blue-200 rounded-3xl p-8 shadow-xl hover:shadow-2xl relative overflow-hidden"
          >
            {/* Decorative elements */}
            <div className="absolute top-4 right-4 text-yellow-400">
              <Star className="h-8 w-8" fill="currentColor" />
            </div>
            <div className="absolute bottom-4 left-4 text-pink-400">
              <Sparkles className="h-6 w-6" />
            </div>

            <div className="absolute top-1/2 left-0 w-16 h-16 bg-white/30 rounded-full -translate-x-8"></div>
            <div className="absolute bottom-0 right-0 w-20 h-20 bg-white/20 rounded-full translate-x-10 translate-y-10"></div>

            <div className="relative z-10">
              <div className="mb-6 text-center">
                <img
                  src="/children.jpg"
                  alt="Children Icon"
                  className="mx-auto h-24 w-24 rounded-full object-cover"
                />
              </div>
              <h2 className="text-3xl font-bold text-gray-800 mb-4 text-center">
                Children's Devotional
              </h2>
              <p className="text-gray-700 text-lg text-center mb-8">
                Fun, colorful, and age-appropriate devotionals that help kids discover God's love in simple, exciting ways!
              </p>
              <div className="bg-white/50 rounded-2xl p-4 text-center group-hover:bg-white/70 transition-colors">
                <span className="text-gray-800 font-bold text-lg">
                  Start Your Adventure →
                </span>
              </div>
            </div>
          </motion.div>
        </Link>


          {/* Teenagers' Card */}
          <Link to="/teenagers" className="group">
            <motion.div
              whileHover={{ scale: 1.05, rotate: 1 }}
              whileTap={{ scale: 0.98 }}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 rounded-3xl p-8 shadow-xl hover:shadow-2xl relative overflow-hidden"
            >
              {/* Decorative elements */}
              <div className="absolute top-4 right-4 text-purple-400">
                <Star className="h-8 w-8" fill="currentColor" />
              </div>
              <div className="absolute bottom-4 left-4 text-blue-400">
                <Sparkles className="h-6 w-6" />
              </div>

              <div className="absolute top-0 left-1/4 w-32 h-32 bg-purple-600/20 rounded-full -translate-y-16"></div>
              <div className="absolute bottom-0 right-1/4 w-24 h-24 bg-blue-600/20 rounded-full translate-y-12"></div>

              <div className="relative z-10">
                <div className="mb-6 text-center">
                  <img
                    src="/teens.jpg"
                    alt="Teenager Icon"
                    className="mx-auto h-24 w-24 rounded-full object-cover"
                  />
                </div>
                <h2 className="text-3xl font-bold text-white mb-4 text-center">
                  Teenagers' Devotional
                </h2>
                <p className="text-gray-300 text-lg text-center mb-8">
                  Deep, relevant devotionals that speak to the real challenges and questions teens face in today's world.
                </p>
                <div className="bg-white/10 rounded-2xl p-4 text-center group-hover:bg-white/20 transition-colors border border-white/20">
                  <span className="text-white font-bold text-lg">
                    Dive Deeper →
                  </span>
                </div>
              </div>
            </motion.div>
          </Link>



        </div>

         {/* Footer */}
          <footer className="bg-gradient-to-b from-white via-purple-50 to-purple-100 border-t border-gray-200 mt-16">
            <div className="max-w-7xl mx-auto px-6 py-12">
              {/* Logo/Brand */}
              <div className="flex flex-col items-center mb-10">
                <img
                  src="/beautiful_logo.png"
                  alt="Young Champions"
                  className="h-32 w-32 object-contain mb-3"
                />
                <h2 className="text-2xl font-bold text-purple-800">Young Champions</h2>
              </div>

              {/* Content grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-10 text-center md:text-left">
                {/* About */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                  className="space-y-3"
                >
                  <h3 className="text-lg font-semibold text-gray-800">About Us</h3>
                  <p className="text-gray-600 leading-relaxed">
                    We are committed to raising a generation of children and teenagers
                    grounded in God’s Word through devotionals, prayer, and interactive
                    learning tools.
                  </p>
                </motion.div>

                {/* Scripture */}
                <motion.div
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3, duration: 0.8 }}
                  className="space-y-3"
                >
                  <h3 className="text-lg font-semibold text-gray-800">Scripture</h3>
                  <p className="italic text-purple-700 leading-relaxed">
                    “Train up a child in the way he should go,
                    And when he is old he will not depart from it.” <br /> — Proverbs 22:6
                  </p>
                </motion.div>

                {/* Contact */}
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.5, duration: 0.8 }}
                  className="space-y-3"
                >
                  <h3 className="text-lg font-semibold text-gray-800">Contact Us</h3>
                  <p className="text-gray-600">
                    Have questions or prayer requests? Reach out anytime.
                  </p>
                   <motion.a
                    href="mailto:youngchampionsdevotionals@gmail.com?subject=Prayer%20Request&body=Hello%20Young%20Champions%20Team,"
                    whileHover={{ scale: 1.08 }}
                    className="inline-block bg-blue-600 text-white px-5 py-2 rounded-xl shadow-md hover:bg-blue-700 transition text-center"
                  >
                    📧 Use My Mail App
                  </motion.a>

                  {/* Gmail Web */}
                  <motion.a
                    href="https://mail.google.com/mail/?view=cm&fs=1&to=youngchampionsdevotionals@gmail.com&su=Prayer%20Request&body=Hello%20Young%20Champions%20Team,"
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.08 }}
                    className="inline-block bg-red-600 text-white px-5 py-2 rounded-xl shadow-md hover:bg-red-700 transition text-center"
                  >
                    ✉️ Open in Gmail
                  </motion.a>
                </motion.div>
              </div>
            </div>

            {/* Copyright bar */}
            <div className="bg-purple-700 text-white text-sm text-center py-4">
              © {new Date().getFullYear()} Young Champions. All rights reserved.
            </div>
          </footer>
      </div>
    </div>
  );
}
