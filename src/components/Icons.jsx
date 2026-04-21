// src/components/Icons.jsx
import {
  // Navigation & Layout
  FaBars,
  FaChevronDown,
  FaChevronUp,
  FaChevronLeft,
  FaChevronRight,
  FaArrowRight,
  FaArrowLeft,

  // User & Authentication
  FaUser,
  FaUserPlus,
  FaUserCheck,

  // Trading & Finance
  FaChartLine,
  FaChartBar,
  FaChartPie,
  FaDollarSign,
  FaMoneyBillWave,
  FaWallet,
  FaCreditCard,
  FaBitcoin,
  FaEthereum,

  // Actions
  FaPlus,
  FaTrash,
  FaFilter,
  FaSort,
  FaCheck,
  FaCopy,
  FaDownload,
  FaUpload,

  // Status & Ratings
  FaStar,
  FaTrophy,
  FaMedal,
  FaCrown,
  FaLock,
  FaKey,
  FaCircleCheck,
  FaTriangleExclamation,
  FaCircleInfo,

  // Communication
  FaEnvelope,
  FaComments,
  FaComment,
  FaPaperPlane,
  FaBell,
  FaBellSlash,
  FaCircleUser,

  // Social
  FaTwitter,
  FaTelegram,
  FaDiscord,
  FaGithub,
} from "react-icons/fa6";

import {
  MdDashboard,
  MdAccountBalanceWallet,
  MdHistory,
  MdAnalytics,
  MdReviews,
  MdNotifications,
  MdSettings,
  MdLogout,
  MdVerified,
  MdSecurity,
  MdPayment,
  MdAttachMoney,
  MdPeople,
  MdReportProblem,
  MdWarning,
  MdEdit,
  MdCandlestickChart,
} from "react-icons/md";

import {
  GiCrown,
  GiTakeMyMoney,
  GiMoneyStack,
  GiGoldNuggets,
  GiProfit,
  GiTrade,
  GiChart,
  GiTargeted,
  GiTrophy,
} from "react-icons/gi";

import {
  IoIosTrendingUp,
  IoIosTrendingDown,
  IoIosFlash,
  IoMdCheckmarkCircle,
  IoMdAlert,
  IoMdSunny,
  IoMdMoon,
  IoIosHome,
  IoMdLock,
  IoMdKey,
} from "react-icons/io";

import {
  SiBitcoin,
  SiEthereum,
  SiBinance,
  SiSolana,
  SiDogecoin,
  SiTradingview,
  SiMeta,
  SiCoinbase,
} from "react-icons/si";

import { TbSettingsCog } from "react-icons/tb";

import { CgArrowsExchangeAlt } from "react-icons/cg";

import {
  FaPercentage,
  FaQuestionCircle,
  FaSearch,
  FaShieldAlt,
  FaSignOutAlt,
  FaSlidersH,
  FaStarHalfAlt,
  FaTimes,
  FaTools,
} from "react-icons/fa";

// Export each icon individually with clear names
export const Icons = {
  // Navigation
  Home: IoIosHome,
  Dashboard: MdDashboard,
  Menu: FaBars,
  Close: FaTimes,
  Settings: TbSettingsCog,
  Notifications: MdNotifications,
  Logout: MdLogout,
  SignOut: FaSignOutAlt,
  Sun: IoMdSunny,
  Moon: IoMdMoon,

  // User
  User: FaUser,
  UserPlus: FaUserPlus,
  UserCheck: FaUserCheck,
  Users: MdPeople,
  Verified: MdVerified,

  // Trading
  Chart: FaChartLine,
  ChartBar: FaChartBar,
  ChartPie: FaChartPie,
  Candlestick: MdCandlestickChart,
  Trade: GiTrade,
  Profit: GiProfit,
  TrendingUp: IoIosTrendingUp,
  TrendingDown: IoIosTrendingDown,
  Exchange: CgArrowsExchangeAlt,
  Target: GiTargeted,

  // Crypto
  Bitcoin: FaBitcoin,
  Ethereum: FaEthereum,
  Solana: SiSolana,
  Dogecoin: SiDogecoin,
  Binance: SiBinance,

  // Money
  Dollar: FaDollarSign,
  Money: FaMoneyBillWave,
  Wallet: FaWallet,
  CreditCard: FaCreditCard,
  Payment: MdPayment,
  AttachMoney: MdAttachMoney,
  Withdraw: GiTakeMyMoney,
  MoneyStack: GiMoneyStack,
  Balance: MdAccountBalanceWallet,

  // Actions
  Add: FaPlus,
  Edit: MdEdit,
  Delete: FaTrash,
  Search: FaSearch,
  Filter: FaFilter,
  Sort: FaSort,
  Copy: FaCopy,
  Download: FaDownload,
  Upload: FaUpload,

  // Status
  Success: IoMdCheckmarkCircle,
  Error: FaTimes,
  Warning: MdWarning,
  Info: FaCircleInfo,
  Question: FaQuestionCircle,
  Alert: IoMdAlert,
  Check: FaCheck,
  Close: FaTimes,

  // Ratings
  Star: FaStar,
  StarHalf: FaStarHalfAlt,
  Trophy: FaTrophy,
  Medal: FaMedal,
  Crown: GiCrown,
  GiTrophy: GiTrophy,

  // Security
  Security: FaShieldAlt,
  Lock: FaLock,
  Key: FaKey,
  MdSecurity: MdSecurity,

  // Communication
  Email: FaEnvelope,
  Comments: FaComments,
  Comment: FaComment,
  Send: FaPaperPlane,
  Bell: FaBell,
  BellSlash: FaBellSlash,

  // Social
  Twitter: FaTwitter,
  Telegram: FaTelegram,
  Discord: FaDiscord,
  Github: FaGithub,

  // Analytics
  Analytics: MdAnalytics,
  Reviews: MdReviews,
  History: MdHistory,
  Reports: MdReportProblem,

  // UI
  ChevronDown: FaChevronDown,
  ChevronUp: FaChevronUp,
  ChevronLeft: FaChevronLeft,
  ChevronRight: FaChevronRight,
  ArrowRight: FaArrowRight,
  ArrowLeft: FaArrowLeft,

  // Misc
  Flash: IoIosFlash,
  Percentage: FaPercentage,
  Sliders: FaSlidersH,
  Tools: FaTools,
  GoldNugget: GiGoldNuggets,

  //user settings
  User: FaCircleUser,
  Account: MdAccountBalanceWallet,
  Notifications: MdNotifications,
  Lock: IoMdLock,
  Key: IoMdKey,
};

export default Icons;
