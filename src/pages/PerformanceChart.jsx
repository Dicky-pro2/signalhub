import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import Icon from '../components/Icon';
import { Icons } from '../components/Icons';

export default function PerformanceChart() {
  const { darkMode } = useTheme();
  const [period, setPeriod] = useState('weekly');
  const [activePoint, setActivePoint] = useState(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 220 });
  const chartRef = useRef(null);

  // Data for different time periods
  const chartData = {
    daily: {
      labels: ['12AM', '2AM', '4AM', '6AM', '8AM', '10AM', '12PM', '2PM', '4PM', '6PM', '8PM', '10PM'],
      earnings: [12, 8, 5, 15, 45, 78, 89, 112, 98, 76, 54, 32],
      totalEarnings: 624,
      avgDaily: 52,
      bestDay: 112,
      growth: 8.5,
    },
    weekly: {
      labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      earnings: [42.5, 67.8, 89.3, 54.2, 78.5, 12.2, 0],
      totalEarnings: 344.5,
      avgDaily: 49.2,
      bestDay: 89.3,
      growth: 12.3,
    },
    monthly: {
      labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
      earnings: [245.6, 389.2, 412.8, 298.4],
      totalEarnings: 1346,
      avgDaily: 44.9,
      bestDay: 412.8,
      growth: 21.7,
    }
  };

  const currentData = chartData[period];
  const maxEarning = Math.max(...currentData.earnings);
  
  // Calculate Y-axis labels
  const yAxisLabels = [0, Math.floor(maxEarning * 0.33), Math.floor(maxEarning * 0.66), Math.floor(maxEarning)];

  // Function to get Y coordinate for a value
  const getYCoordinate = (value, height) => {
    const percentage = value / maxEarning;
    return height - (percentage * (height - 25));
  };

  // Generate SVG path for the line
  const generatePath = (width, height) => {
    const points = currentData.earnings.map((value, index) => {
      const x = (index / (currentData.earnings.length - 1)) * width;
      const y = getYCoordinate(value, height);
      return `${x},${y}`;
    });
    
    if (points.length < 2) return '';
    
    let path = `M ${points[0]}`;
    for (let i = 1; i < points.length - 2; i++) {
      const xc = (parseFloat(points[i].split(',')[0]) + parseFloat(points[i + 1].split(',')[0])) / 2;
      const yc = (parseFloat(points[i].split(',')[1]) + parseFloat(points[i + 1].split(',')[1])) / 2;
      path += ` Q ${points[i].split(',')[0]},${points[i].split(',')[1]} ${xc},${yc}`;
    }
    if (points.length >= 2) {
      path += ` Q ${points[points.length - 2].split(',')[0]},${points[points.length - 2].split(',')[1]} ${points[points.length - 1]}`;
    }
    
    return path;
  };

  // Generate gradient area path
  const generateAreaPath = (width, height) => {
    const linePath = generatePath(width, height);
    if (!linePath) return '';
    return `${linePath} L ${width},${height} L 0,${height} Z`;
  };

  // Handle window resize
  useEffect(() => {
    const updateDimensions = () => {
      if (chartRef.current) {
        setDimensions({
          width: chartRef.current.clientWidth - 60,
          height: 220
        });
      }
    };
    
    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  return (
    <div className={`rounded-xl ${darkMode ? "bg-gray-800" : "bg-white shadow-lg"} p-4 sm:p-6`}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h2 className={`text-lg sm:text-xl font-bold flex items-center gap-2 ${darkMode ? "text-white" : "text-gray-800"}`}>
          <Icon icon={Icons.Chart} size={18} />
          Performance Overview
        </h2>
        <div className="flex gap-2 w-full sm:w-auto">
          {["daily", "weekly", "monthly"].map((p) => (
            <motion.button
              key={p}
              onClick={() => setPeriod(p)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`flex-1 sm:flex-none px-3 sm:px-4 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all duration-200 ${
                period === p
                  ? "bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg shadow-orange-500/25"
                  : darkMode
                    ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {p.charAt(0).toUpperCase() + p.slice(1)}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Stats Row - Responsive Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          key={`total-${period}`}
          className={`p-2 sm:p-3 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}
        >
          <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Total Earnings</p>
          <p className={`text-base sm:text-xl font-bold text-orange-500`}>
            ${currentData.totalEarnings.toFixed(2)}
          </p>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          key={`avg-${period}`}
          className={`p-2 sm:p-3 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}
        >
          <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Avg Daily</p>
          <p className={`text-base sm:text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
            ${currentData.avgDaily.toFixed(2)}
          </p>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          key={`best-${period}`}
          className={`p-2 sm:p-3 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}
        >
          <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Best Day</p>
          <p className={`text-base sm:text-xl font-bold text-green-500`}>
            ${currentData.bestDay.toFixed(2)}
          </p>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          key={`growth-${period}`}
          className={`p-2 sm:p-3 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}
        >
          <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Growth</p>
          <p className={`text-base sm:text-xl font-bold ${currentData.growth >= 0 ? 'text-green-500' : 'text-red-500'} flex items-center gap-1`}>
            {currentData.growth >= 0 ? '↑' : '↓'} {Math.abs(currentData.growth)}%
          </p>
        </motion.div>
      </div>

      {/* Line Chart - Responsive */}
      <div ref={chartRef} className="relative w-full overflow-x-auto">
        <div className="min-w-[280px]">
          {/* Y-axis labels */}
          <div className="absolute -left-8 sm:-left-10 top-0 bottom-6 w-8 sm:w-10 flex flex-col justify-between text-[10px] sm:text-xs text-gray-500">
            {yAxisLabels.slice().reverse().map((label, idx) => (
              <span key={idx} className="whitespace-nowrap">${label}</span>
            ))}
          </div>
          
          {/* Grid lines */}
          <div className="absolute left-8 sm:left-10 right-0 top-0 bottom-6 pointer-events-none">
            {yAxisLabels.map((_, idx) => (
              <div
                key={idx}
                className="absolute w-full border-t border-gray-700/30"
                style={{ bottom: `${(idx / (yAxisLabels.length - 1)) * 100}%` }}
              />
            ))}
          </div>

          {/* Chart SVG */}
          <div className="ml-8 sm:ml-10 relative" style={{ height: '220px', width: '100%' }}>
            {dimensions.width > 0 && (
              <svg
                className="w-full h-full"
                viewBox={`0 0 ${dimensions.width} 220`}
                preserveAspectRatio="none"
              >
                {/* Gradient definition */}
                <defs>
                  <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#f97316" stopOpacity="0.3" />
                    <stop offset="100%" stopColor="#f97316" stopOpacity="0.0" />
                  </linearGradient>
                  <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#f97316" />
                    <stop offset="100%" stopColor="#ea580c" />
                  </linearGradient>
                </defs>

                {/* Area under the line */}
                <AnimatePresence mode="wait">
                  <motion.path
                    key={`area-${period}`}
                    d={generateAreaPath(dimensions.width, 220)}
                    fill="url(#areaGradient)"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                  />
                </AnimatePresence>

                {/* The line */}
                <AnimatePresence mode="wait">
                  <motion.path
                    key={`line-${period}`}
                    d={generatePath(dimensions.width, 220)}
                    fill="none"
                    stroke="url(#lineGradient)"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 1 }}
                    exit={{ pathLength: 0, opacity: 0 }}
                    transition={{ duration: 0.8, ease: "easeInOut" }}
                  />
                </AnimatePresence>

                {/* Data points */}
                <AnimatePresence mode="wait">
                  {currentData.earnings.map((value, idx) => {
                    const x = (idx / (currentData.earnings.length - 1)) * dimensions.width;
                    const y = getYCoordinate(value, 220);
                    const isActive = activePoint === idx;
                    
                    // Only render if coordinates are valid
                    if (isNaN(x) || isNaN(y)) return null;
                    
                    return (
                      <motion.g
                        key={`point-${period}-${idx}`}
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        transition={{ delay: 0.5 + idx * 0.03, duration: 0.2 }}
                        style={{ cursor: 'pointer' }}
                        onMouseEnter={() => setActivePoint(idx)}
                        onMouseLeave={() => setActivePoint(null)}
                      >
                        {/* Outer ring for hover */}
                        <motion.circle
                          cx={x}
                          cy={y}
                          r={isActive ? 8 : 4}
                          fill={isActive ? "#f97316" : "none"}
                          stroke="#f97316"
                          strokeWidth="2"
                          animate={{ r: isActive ? 8 : 4 }}
                          transition={{ duration: 0.2 }}
                        />
                        {/* Inner dot */}
                        <circle
                          cx={x}
                          cy={y}
                          r={3}
                          fill="#ffffff"
                          stroke="#f97316"
                          strokeWidth="1.5"
                        />
                        
                        {/* Tooltip - Responsive positioning */}
                        {isActive && (
                          <motion.g
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: -15 }}
                            exit={{ opacity: 0, y: -10 }}
                          >
                            <rect
                              x={x - 25}
                              y={y - 32}
                              width="50"
                              height="18"
                              rx="4"
                              fill={darkMode ? "#1f2937" : "#ffffff"}
                              stroke="#f97316"
                              strokeWidth="1"
                            />
                            <text
                              x={x}
                              y={y - 19}
                              textAnchor="middle"
                              fontSize="8"
                              fill="#f97316"
                              fontWeight="bold"
                            >
                              ${value.toFixed(2)}
                            </text>
                          </motion.g>
                        )}
                      </motion.g>
                    );
                  })}
                </AnimatePresence>
              </svg>
            )}
          </div>

          {/* X-axis labels - Responsive */}
          <div className="ml-8 sm:ml-10 mt-2 grid" style={{ gridTemplateColumns: `repeat(${currentData.labels.length}, 1fr)` }}>
            {currentData.labels.map((label, idx) => (
              <motion.span
                key={`label-${period}-${idx}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 + idx * 0.02 }}
                className={`text-[10px] sm:text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'} text-center truncate px-1`}
              >
                {label}
              </motion.span>
            ))}
          </div>
        </div>
      </div>

      {/* Trend Indicator - Responsive */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className={`mt-6 pt-4 border-t ${darkMode ? 'border-gray-700' : 'border-gray-100'} flex flex-col sm:flex-row items-center justify-between gap-3`}
      >
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-orange-500"></div>
            <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              Earnings
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              Trend Line
            </span>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Icon icon={Icons.TrendingUp} size={14} color="#22c55e" />
          <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'} text-center sm:text-left`}>
            {period === 'daily' && 'Hourly performance analysis'}
            {period === 'weekly' && 'Weekly trend analysis'}
            {period === 'monthly' && 'Monthly growth trajectory'}
          </span>
        </div>
      </motion.div>
    </div>
  );
}