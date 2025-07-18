import React from 'react';
import { motion } from 'framer-motion';

const About = () => {
  return (
    <div className="min-h-screen pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white">About Us</h1>
          <p className="mt-4 text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Learn more about our mission and the team behind our success.
          </p>
        </motion.div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="bg-gray-200 border-2 border-dashed rounded-xl w-full h-96" />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Our Story</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Founded in 2023, our startup was born out of a passion for solving complex problems with innovative software solutions. We believe in the power of technology to transform businesses and improve lives.
            </p>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Our team of experienced developers, designers, and strategists work together to deliver exceptional results for our clients. We pride ourselves on our collaborative approach and commitment to excellence.
            </p>
            <p className="text-gray-600 dark:text-gray-300">
              Today, we serve clients across various industries, helping them navigate the digital landscape and achieve their business goals.
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default About;