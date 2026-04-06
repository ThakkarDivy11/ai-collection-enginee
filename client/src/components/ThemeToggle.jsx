import React, { useState, useEffect } from 'react';
import { Sun, Moon } from 'lucide-react';
import { motion } from 'framer-motion';

const ThemeToggle = () => {
    const [theme, setTheme] = useState('light');

    useEffect(() => {
        // Detect preference or system setting
        const storedTheme = localStorage.getItem('theme');
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        
        if (storedTheme === 'dark' || (!storedTheme && prefersDark)) {
            setTheme('dark');
            document.documentElement.classList.add('dark');
        } else {
            setTheme('light');
            document.documentElement.classList.remove('dark');
        }
    }, []);

    const toggleTheme = () => {
        if (theme === 'light') {
            setTheme('dark');
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            setTheme('light');
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }
    };

    return (
        <button
            onClick={toggleTheme}
            className="p-2 sm:p-2.5 rounded-full flex items-center justify-center bg-gray-100/80 dark:bg-gray-800/80 text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-300 border border-gray-200 dark:border-gray-700 shadow-sm focus:outline-none"
            aria-label="Toggle Dark Mode"
            title="Toggle Theme"
        >
            <motion.div
                initial={false}
                animate={{ rotate: theme === 'dark' ? 180 : 0, scale: theme === 'dark' ? 0.9 : 1 }}
                transition={{ duration: 0.3 }}
                className="relative flex items-center justify-center w-5 h-5 sm:w-6 sm:h-6"
            >
                {theme === 'light' ? (
                    <Sun className="w-full h-full text-amber-500 absolute" />
                ) : (
                    <Moon className="w-full h-full text-blue-400 absolute" />
                )}
            </motion.div>
        </button>
    );
};

export default ThemeToggle;
