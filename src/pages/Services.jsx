import React from 'react';
import { motion } from 'framer-motion';

const services = [
  {
    title: 'Web Application Development',
    description: 'We build responsive, high-performance web applications using the latest technologies.',
  },
  {
    title: 'Mobile App Development',
    description: 'Native and cross-platform mobile applications for iOS and Android.',
  },
  {
    title: 'UI/UX Design',
    description: 'User-centered design that enhances user experience and drives engagement.',
  },
  {
    title: 'Cloud Solutions',
    description: 'Scalable cloud infrastructure and deployment strategies.',
  },
  {
    title: 'DevOps & CI/CD',
    description: 'Streamlined development workflows and continuous integration/delivery pipelines.',
  },
  {
    title: 'Consulting',
    description: 'Expert advice to help you make informed technology decisions.',
  },
];

const ServiceCard = ({ title, description, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow"
    >
      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">{title}</h3>
      <p className="text-gray-600 dark:text-gray-300">{description}</p>
    </motion.div>
  );
};

const Services = () => {
  return (
    <div className="min-h-screen pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white">Our Services</h1>
          <p className="mt-4 text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            We offer a wide range of services to help your business thrive in the digital world.
          </p>
        </motion.div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <ServiceCard key={index} index={index} {...service} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Services;