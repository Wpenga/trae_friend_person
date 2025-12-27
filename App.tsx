
import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { ScheduleProvider } from './store/ScheduleContext';
import Dashboard from './pages/Dashboard';
import ScheduleList from './pages/ScheduleList';
import ScheduleForm from './pages/ScheduleForm';
import { 
  LayoutDashboard, 
  ListTodo, 
  PlusCircle, 
  Settings, 
  Search, 
  Bell, 
  Menu, 
  X, 
  Moon, 
  Sun 
} from 'lucide-react';

type Theme = 'light' | 'dark';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  theme: Theme;
  onThemeChange: (theme: Theme) => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose, theme, onThemeChange }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl w-full max-w-md overflow-hidden">
        <div className="p-6 border-b border-slate-200 dark:border-slate-700">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">设置中心</h2>
            <button 
              onClick={onClose} 
              className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
            >
              <X size={20} />
            </button>
          </div>
        </div>
        
        <div className="p-6">
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">主题设置</h3>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => onThemeChange('light')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${theme === 'light' ? 'bg-indigo-50 text-indigo-600 border border-indigo-200' : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600'}`}
                >
                  <Sun size={16} />
                  <span>浅色</span>
                </button>
                <button
                  onClick={() => onThemeChange('dark')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${theme === 'dark' ? 'bg-indigo-50 text-indigo-600 border border-indigo-200 dark:bg-indigo-900/20 dark:text-indigo-400 dark:border-indigo-800' : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600'}`}
                >
                  <Moon size={16} />
                  <span>深色</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Sidebar = ({ isOpen, toggle, onSettingsClick }: { isOpen: boolean, toggle: () => void, onSettingsClick: () => void }) => {
  const location = useLocation();
  const navItems = [
    { path: '/', label: '仪表盘', icon: LayoutDashboard },
    { path: '/list', label: '日程列表', icon: ListTodo },
    { path: '/add', label: '新增日程', icon: PlusCircle },
  ];

  return (
    <>
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden"
          onClick={toggle}
        />
      )}
      
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 transform transition-transform duration-300 ease-in-out
        lg:relative lg:translate-x-0
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex flex-col h-full">
          <div className="p-6 flex items-center gap-3">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold">S</div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
              个人日程记录
            </h1>
          </div>
          
          <nav className="flex-1 px-4 space-y-2 mt-4">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => window.innerWidth < 1024 && toggle()}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${location.pathname === item.path ? 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-400 font-medium shadow-sm ring-1 ring-indigo-200 dark:ring-indigo-800' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700'}`}
              >
                <item.icon size={20} />
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="p-4 border-t border-slate-100 dark:border-slate-700">
            <button 
              onClick={onSettingsClick}
              className="flex items-center gap-3 px-4 py-3 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 w-full rounded-xl transition-all"
            >
              <Settings size={20} />
              设置中心
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

const Header = ({ toggleSidebar }: { toggleSidebar: () => void }) => {
  return (
    <header className="sticky top-0 z-30 bg-white/80 dark:bg-slate-800/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-700 h-16 flex items-center justify-between px-4 lg:px-8">
      <button onClick={toggleSidebar} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg lg:hidden">
        <Menu size={24} className="text-slate-600 dark:text-slate-300" />
      </button>

      <div className="hidden md:flex items-center bg-slate-100 dark:bg-slate-700 rounded-full px-4 py-2 w-96 max-w-full">
        <Search size={18} className="text-slate-400 dark:text-slate-400" />
        <input 
          type="text" 
          placeholder="搜索日程标题或内容..." 
          className="bg-transparent border-none focus:ring-0 ml-2 w-full text-sm text-slate-900 dark:text-slate-100 placeholder-slate-500 dark:placeholder-slate-400"
        />
      </div>

      <div className="flex items-center gap-3">
        <button className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full relative">
          <Bell size={20} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full border-2 border-white dark:border-slate-800"></span>
        </button>
        <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 cursor-pointer shadow-sm"></div>
      </div>
    </header>
  );
};

const App: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [theme, setTheme] = useState<Theme>('light');

  // 从localStorage加载主题设置
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as Theme;
    if (savedTheme) {
      setTheme(savedTheme);
    }
  }, []);

  // 应用主题到DOM
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const handleThemeChange = (newTheme: Theme) => {
    setTheme(newTheme);
  };

  return (
    <ScheduleProvider>
      <Router>
        <div className={`flex h-screen overflow-hidden bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 transition-colors duration-300`}>
          <Sidebar 
            isOpen={isSidebarOpen} 
            toggle={() => setIsSidebarOpen(!isSidebarOpen)} 
            onSettingsClick={() => setIsSettingsOpen(true)} 
          />
          <div className="flex-1 flex flex-col min-w-0">
            <Header toggleSidebar={() => setIsSidebarOpen(true)} />
            <main className="flex-1 overflow-y-auto p-4 lg:p-8">
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/list" element={<ScheduleList />} />
                <Route path="/add" element={<ScheduleForm />} />
                <Route path="/edit/:id" element={<ScheduleForm />} />
              </Routes>
            </main>
          </div>
        </div>
        
        {/* 设置模态框 */}
        <SettingsModal 
          isOpen={isSettingsOpen} 
          onClose={() => setIsSettingsOpen(false)} 
          theme={theme} 
          onThemeChange={handleThemeChange} 
        />
      </Router>
    </ScheduleProvider>
  );
};

export default App;
