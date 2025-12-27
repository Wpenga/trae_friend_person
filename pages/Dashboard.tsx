
import React, { useMemo } from 'react';
import { useSchedules } from '../store/ScheduleContext';
import { Priority, Category } from '../types';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, LineChart, Line, Legend 
} from 'recharts';
import { 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  TrendingUp, 
  Plus, 
  Calendar,
  ArrowRight
} from 'lucide-react';
import { Link } from 'react-router-dom';

const StatCard = ({ title, value, icon: Icon, color, trend }: any) => (
  <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-start justify-between">
    <div>
      <p className="text-slate-500 text-sm font-medium mb-1">{title}</p>
      <h3 className="text-2xl font-bold text-slate-800">{value}</h3>
      {trend && (
        <p className="text-xs mt-2 flex items-center gap-1 text-emerald-600 font-medium">
          <TrendingUp size={14} /> {trend}
        </p>
      )}
    </div>
    <div className={`p-3 rounded-xl ${color}`}>
      <Icon size={24} className="text-white" />
    </div>
  </div>
);

const Dashboard: React.FC = () => {
  const { state } = useSchedules();
  const { schedules } = state;

  const stats = useMemo(() => {
    const total = schedules.length;
    const pending = schedules.filter(s => !s.isCompleted).length;
    const high = schedules.filter(s => s.priority === Priority.HIGH).length;
    const workCount = schedules.filter(s => s.category === Category.WORK).length;
    const personalCount = schedules.filter(s => s.category === Category.PERSONAL).length;

    return { total, pending, high, workCount, personalCount };
  }, [schedules]);

  const priorityData = useMemo(() => {
    return [
      { name: '高', value: schedules.filter(s => s.priority === Priority.HIGH).length, color: '#f43f5e' },
      { name: '中', value: schedules.filter(s => s.priority === Priority.MEDIUM).length, color: '#f59e0b' },
      { name: '低', value: schedules.filter(s => s.priority === Priority.LOW).length, color: '#10b981' },
    ];
  }, [schedules]);

  const categoryData = useMemo(() => {
    return [
      { name: '工作', value: stats.workCount },
      { name: '个人日常', value: stats.personalCount },
    ];
  }, [stats]);

  const trendData = useMemo(() => {
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - i);
      
      // 将日期转换为本地时间的年-月-日格式，解决时区问题
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      const dayStr = `${year}-${month}-${day}`;
      
      return {
        date: `${month}/${day}`,
        新增: schedules.filter(s => {
          if (!s.createdAt) return false;
          // 将createdAt转换为本地时间的年-月-日格式进行比较
          const createdAtDate = new Date(s.createdAt);
          const createdAtYear = createdAtDate.getFullYear();
          const createdAtMonth = String(createdAtDate.getMonth() + 1).padStart(2, '0');
          const createdAtDay = String(createdAtDate.getDate()).padStart(2, '0');
          const createdAtDayStr = `${createdAtYear}-${createdAtMonth}-${createdAtDay}`;
          return createdAtDayStr === dayStr;
        }).length,
        完成: schedules.filter(s => {
          if (!s.createdAt) return false;
          const createdAtDate = new Date(s.createdAt);
          const createdAtYear = createdAtDate.getFullYear();
          const createdAtMonth = String(createdAtDate.getMonth() + 1).padStart(2, '0');
          const createdAtDay = String(createdAtDate.getDate()).padStart(2, '0');
          const createdAtDayStr = `${createdAtYear}-${createdAtMonth}-${createdAtDay}`;
          return createdAtDayStr === dayStr && s.isCompleted;
        }).length
      };
    }).reverse();
    return last7Days;
  }, [schedules]);

  const upcoming = useMemo(() => {
    return schedules
      .filter(s => !s.isCompleted)
      .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime())
      .slice(0, 3);
  }, [schedules]);

  const COLORS = ['#6366f1', '#a855f7', '#ec4899', '#f43f5e', '#f59e0b'];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">您好，欢迎回来！</h2>
          <p className="text-slate-500">这是您今天的日程概览与数据统计。</p>
        </div>
        <Link 
          to="/add" 
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-xl font-medium shadow-lg shadow-indigo-200 flex items-center justify-center gap-2 transition-all active:scale-95"
        >
          <Plus size={20} />
          记录新日程
        </Link>
      </div>

      {/* 核心数据概览 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="总日程数" 
          value={stats.total} 
          icon={Calendar} 
          color="bg-indigo-500"
          trend="较上周增长 5%"
        />
        <StatCard 
          title="待完成任务" 
          value={stats.pending} 
          icon={Clock} 
          color="bg-amber-500"
        />
        <StatCard 
          title="高优先级" 
          value={stats.high} 
          icon={AlertCircle} 
          color="bg-rose-500"
        />
        <StatCard 
          title="已完成" 
          value={stats.total - stats.pending} 
          icon={CheckCircle2} 
          color="bg-emerald-500"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* 趋势图表 */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <h3 className="text-lg font-bold mb-6 text-slate-800">日程活跃趋势 (近7天)</h3>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Legend verticalAlign="top" height={36}/>
                <Line type="monotone" dataKey="新增" stroke="#6366f1" strokeWidth={3} dot={{r: 4, strokeWidth: 2}} />
                <Line type="monotone" dataKey="完成" stroke="#10b981" strokeWidth={3} dot={{r: 4, strokeWidth: 2}} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 优先级分布 */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <h3 className="text-lg font-bold mb-6 text-slate-800">优先级分布</h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={priorityData}
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {priorityData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                   contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-4 mt-4">
            {priorityData.map(item => (
              <div key={item.name} className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-full" style={{backgroundColor: item.color}}></div>
                <span className="text-sm text-slate-600 font-medium">{item.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* 即将到期日程 */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-slate-800">即将到期</h3>
            <Link to="/list" className="text-indigo-600 hover:text-indigo-700 text-sm font-medium flex items-center gap-1 group">
              查看全部 <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
          <div className="space-y-4">
            {upcoming.length > 0 ? upcoming.map(item => (
              <div key={item.id} className="flex items-center gap-4 p-4 rounded-xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
                  item.priority === Priority.HIGH ? 'bg-rose-50 text-rose-600' :
                  item.priority === Priority.MEDIUM ? 'bg-amber-50 text-amber-600' : 'bg-emerald-50 text-emerald-600'
                }`}>
                  <Clock size={24} />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-slate-800 truncate">{item.title}</h4>
                  <p className="text-sm text-slate-500">
                    {new Date(item.startTime).toLocaleTimeString('zh-CN', {hour: '2-digit', minute:'2-digit'})} - {new Date(item.endTime).toLocaleTimeString('zh-CN', {hour: '2-digit', minute:'2-digit'})}
                  </p>
                </div>
                <div className="text-right">
                  <span className={`text-[10px] px-2 py-1 rounded-full font-bold uppercase ${
                    item.category === Category.WORK ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'
                  }`}>
                    {item.category}
                  </span>
                </div>
              </div>
            )) : (
              <div className="text-center py-12 text-slate-400">
                <Calendar size={48} className="mx-auto mb-4 opacity-20" />
                <p>暂时没有即将到期的日程</p>
              </div>
            )}
          </div>
        </div>

        {/* 类别占比 */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <h3 className="text-lg font-bold mb-6 text-slate-800">日程类别占比</h3>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                <XAxis type="number" axisLine={false} tickLine={false} hide />
                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 14}} width={80} />
                <Tooltip 
                   cursor={{fill: 'transparent'}}
                   contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="value" radius={[0, 10, 10, 0]} barSize={40} name="数量">
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
