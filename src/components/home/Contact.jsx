import React from 'react';
import { motion } from 'framer-motion';
import { useForm } from '../../hooks/useForm';
import emailjs from 'emailjs-com';

const Contact = () => {
  const form = useForm({
    name: '',
    email: '',
    message: ''
  });

  const sendEmail = async (values) => {
    await emailjs.send(
      'YOUR_SERVICE_ID',
      'YOUR_TEMPLATE_ID',
      values,
      'YOUR_USER_ID'
    );
  };

  return (
    <section className="py-20 bg-gray-50 dark:bg-gray-900" id="contact">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-3xl font-bold text-gray-900 dark:text-white"
          >
            Get In Touch
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mt-4 text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto"
          >
            Have a project in mind? We'd love to hear from you.
          </motion.p>
        </div>
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8"
          >
            <form onSubmit={form.handleSubmit(sendEmail)}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label htmlFor="name" className="block text-gray-700 dark:text-gray-300 mb-2">
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={form.values.name}
                    onChange={form.handleChange}
                    className={`w-full px-4 py-2 rounded-lg border ${
                      form.errors.name ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                    } focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700 dark:text-white`}
                    aria-invalid={!!form.errors.name}
                    aria-describedby={form.errors.name ? "name-error" : undefined}
                  />
                  {form.errors.name && (
                    <p className="mt-1 text-red-500" id="name-error">
                      {form.errors.name}
                    </p>
                  )}
                </div>
                <div>
                  <label htmlFor="email" className="block text-gray-700 dark:text-gray-300 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={form.values.email}
                    onChange={form.handleChange}
                    className={`w-full px-4 py-2 rounded-lg border ${
                      form.errors.email ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                    } focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700 dark:text-white`}
                    aria-invalid={!!form.errors.email}
                    aria-describedby={form.errors.email ? "email-error" : undefined}
                  />
                  {form.errors.email && (
                    <p className="mt-1 text-red-500" id="email-error">
                      {form.errors.email}
                    </p>
                  )}
                </div>
              </div>
              <div className="mb-6">
                <label htmlFor="message" className="block text-gray-700 dark:text-gray-300 mb-2">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows="4"
                  value={form.values.message}
                  onChange={form.handleChange}
                  className={`w-full px-4 py-2 rounded-lg border ${
                      form.errors.message ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                    } focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700 dark:text-white`}
                  aria-invalid={!!form.errors.message}
                  aria-describedby={form.errors.message ? "message-error" : undefined}
                ></textarea>
                {form.errors.message && (
                  <p className="mt-1 text-red-500" id="message-error">
                    {form.errors.message}
                  </p>
                )}
              </div>
              <div className="text-right">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="submit"
                  disabled={form.isSubmitting}
                  className="px-6 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50"
                >
                  {form.isSubmitting ? 'Sending...' : 'Send Message'}
                </motion.button>
              </div>
              {form.submitStatus === 'success' && (
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-4 text-green-600 text-center"
                >
                  Message sent successfully!
                </motion.p>
              )}
              {form.submitStatus === 'error' && (
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-4 text-red-500 text-center"
                >
                  Failed to send message. Please try again.
                </motion.p>
              )}
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Contact;