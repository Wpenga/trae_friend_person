import React, { useState } from 'react';
import { HashRouter as Router, Routes, Route, Link, useLocation, Navigate } from 'react-router-dom';
import { ScheduleProvider } from './store/ScheduleContext';
import Dashboard from './pages/Dashboard';
import ScheduleList from './pages/ScheduleList';
import ScheduleForm from './pages/ScheduleForm';
import Login from './pages/Login';
import { 
  LayoutDashboard, 
  ListTodo, 
  PlusCircle, 
  Settings, 
  Search, 
  Bell, 
  Menu, 
  X,
  LogOut
} from 'lucide-react';

const Sidebar = ({ isOpen, toggle, onLogout }: { isOpen: boolean, toggle: () => void, onLogout: () => void }) => {
  const location = useLocation();
  const navItems = [
    { path: '/', label: '仪表盘', icon: LayoutDashboard },
    { path: '/list', label: '题目列表', icon: ListTodo },
    { path: '/add', label: '新增题目', icon: PlusCircle },
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
        fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-slate-200 transform transition-transform duration-300 ease-in-out
        lg:relative lg:translate-x-0
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex flex-col h-full">
          <div className="p-6 flex items-center gap-3">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold">S</div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
              摩托车题库管理
            </h1>
          </div>
          
          <nav className="flex-1 px-4 space-y-2 mt-4">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => window.innerWidth < 1024 && toggle()}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                  location.pathname === item.path 
                    ? 'bg-indigo-50 text-indigo-700 font-medium shadow-sm ring-1 ring-indigo-200' 
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <item.icon size={20} />
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="p-4 border-t border-slate-100 space-y-2">
            <button className="flex items-center gap-3 px-4 py-3 text-slate-600 hover:bg-slate-50 w-full rounded-xl transition-all">
              <Settings size={20} />
              设置中心
            </button>
             <button 
               onClick={onLogout}
               className="flex items-center gap-3 px-4 py-3 text-rose-600 hover:bg-rose-50 w-full rounded-xl transition-all"
             >
              <LogOut size={20} />
              退出登录
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

const Header = ({ toggleSidebar }: { toggleSidebar: () => void }) => {
  return (
    <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-slate-200 h-16 flex items-center justify-between px-4 lg:px-8">
      <button onClick={toggleSidebar} className="p-2 hover:bg-slate-100 rounded-lg lg:hidden">
        <Menu size={24} />
      </button>

      <div className="hidden md:flex items-center bg-slate-100 rounded-full px-4 py-2 w-96 max-w-full">
        <Search size={18} className="text-slate-400" />
        <input 
          type="text" 
          placeholder="搜索题目..." 
          className="bg-transparent border-none focus:ring-0 ml-2 w-full text-sm"
        />
      </div>

      <div className="flex items-center gap-3">
        <button className="p-2 text-slate-600 hover:bg-slate-100 rounded-full relative">
          <Bell size={20} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full border-2 border-white"></span>
        </button>
        <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 cursor-pointer shadow-sm"></div>
      </div>
    </header>
  );
};

const ProtectedLayout = ({ children, onLogout }: { children: React.ReactNode, onLogout: () => void }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  return (
    <div className="flex h-screen overflow-hidden bg-slate-50">
      <Sidebar isOpen={isSidebarOpen} toggle={() => setIsSidebarOpen(!isSidebarOpen)} onLogout={onLogout} />
      <div className="flex-1 flex flex-col min-w-0">
        <Header toggleSidebar={() => setIsSidebarOpen(true)} />
        <main className="flex-1 overflow-y-auto p-4 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  // Simple auth state persistence using localStorage
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('auth') === 'true';
  });

  const handleLogin = (status: boolean) => {
    setIsAuthenticated(status);
    if (status) localStorage.setItem('auth', 'true');
    else localStorage.removeItem('auth');
  };

  const handleLogout = () => {
    handleLogin(false);
  };

  return (
    <ScheduleProvider>
      <Router>
        <Routes>
          <Route path="/login" element={
            !isAuthenticated ? <Login onLogin={handleLogin} /> : <Navigate to="/" replace />
          } />
          
          <Route path="/*" element={
            isAuthenticated ? (
              <ProtectedLayout onLogout={handleLogout}>
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/list" element={<ScheduleList />} />
                  <Route path="/add" element={<ScheduleForm />} />
                  <Route path="/edit/:id" element={<ScheduleForm />} />
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </ProtectedLayout>
            ) : (
              <Navigate to="/login" replace />
            )
          } />
        </Routes>
      </Router>
    </ScheduleProvider>
  );
};

export default App;
