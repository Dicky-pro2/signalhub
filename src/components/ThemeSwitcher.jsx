// src/components/ThemeSwitcher.jsx
import { Fragment } from 'react';
import { Menu, Transition } from '@headlessui/react';
import { useColor } from '../context/ColorContext';
import { useTheme } from '../context/ThemeContext';
import Icon from './Icon';
import { Icons } from './Icons';

export default function ThemeSwitcher() {
  const { theme, setTheme, themes, currentTheme } = useColor();
  const { darkMode } = useTheme();

  const themeIcons = {
    orange: '🍊',
    lemon: '🍋',
    cyberpunk: '🌈',
    terminal: '💻',
    electric: '⚡',
    purple: '🟣',
  };

  const themeDescriptions = {
    orange: 'Warm and friendly',
    lemon: 'Bright and energetic',
    cyberpunk: 'Neon futuristic',
    terminal: 'Hacker style',
    electric: 'Cool and modern',
    purple: 'Royal and elegant',
  };

  return (
    <Menu as="div" className="relative">
      <Menu.Button
        className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition ${
          darkMode 
            ? 'bg-gray-800 hover:bg-gray-700 text-gray-300' 
            : 'bg-white hover:bg-gray-50 text-gray-700 shadow-sm'
        }`}
      >
        <span className="text-lg">{themeIcons[theme]}</span>
        <span className="hidden sm:inline">Theme</span>
        <Icon icon={Icons.ChevronDown} size={12} />
      </Menu.Button>

      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items
          className={`absolute right-0 mt-2 w-64 rounded-xl shadow-lg z-50 ${
            darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-100'
          }`}
        >
          <div className="p-2">
            <div className={`px-3 py-2 text-xs font-semibold ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              Choose your vibe
            </div>
            {Object.entries(themes).map(([key, value]) => (
              <Menu.Item key={key}>
                {({ active }) => (
                  <button
                    onClick={() => setTheme(key)}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition ${
                      theme === key
                        ? 'bg-orange-500/20 text-orange-500'
                        : active
                        ? darkMode
                          ? 'bg-gray-700 text-white'
                          : 'bg-gray-100 text-gray-900'
                        : darkMode
                        ? 'text-gray-300'
                        : 'text-gray-700'
                    }`}
                  >
                    <span className="text-xl">{themeIcons[key]}</span>
                    <div className="flex-1 text-left">
                      <div className="text-sm font-medium">{value.name}</div>
                      <div className="text-xs opacity-70">{themeDescriptions[key]}</div>
                    </div>
                    {theme === key && (
                      <Icon icon={Icons.Check} size={16} className="text-orange-500" />
                    )}
                    <div 
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: value.primary }}
                    />
                  </button>
                )}
              </Menu.Item>
            ))}
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  );
}