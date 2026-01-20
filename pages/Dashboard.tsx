import React, { useMemo } from 'react';
import { Question } from '../types';
import questionsData from '../src/data/questions.json';
import { 
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend 
} from 'recharts';
import { 
  BookOpen, 
  HelpCircle, 
  CheckCircle2, 
  Layout,
  TrendingUp
} from 'lucide-react';

const questions = questionsData as unknown as Question[];

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
  const stats = useMemo(() => {
    const total = questions.length;
    const type0 = questions.filter(q => q.type === 0).length;
    const type1 = questions.filter(q => q.type === 1).length; 
    const type2 = questions.filter(q => q.type === 2).length;
    // Count questions with images
    const withImage = questions.filter(q => q.url && q.url.trim() !== '').length;

    return { total, type0, type1, type2, withImage };
  }, []);

  const typeData = useMemo(() => {
    // Group by type dynamically
    const counts: Record<string, number> = {};
    questions.forEach(q => {
      const t = q.type !== undefined ? q.type : '未知';
      counts[t] = (counts[t] || 0) + 1;
    });
    
    return Object.keys(counts).map(key => {
      let name = `类型 ${key}`;
      if (key === '0') name = '判断题';
      else if (key === '1') name = '单选题';
      else if (key === '2') name = '多选题';
      
      return {
        name,
        value: counts[key]
      };
    });
  }, []);

  const COLORS = ['#6366f1', '#a855f7', '#ec4899', '#f43f5e', '#f59e0b'];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">驾考宝典题库概览</h2>
          <p className="text-slate-500">科目四顺序题统计数据。</p>
        </div>
      </div>

      {/* 核心数据概览 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <StatCard 
          title="总题目数" 
          value={stats.total} 
          icon={BookOpen} 
          color="bg-slate-500"
        />
        <StatCard 
          title="判断题" 
          value={stats.type0} 
          icon={HelpCircle} 
          color="bg-amber-500"
        />
        <StatCard 
          title="单选题" 
          value={stats.type1} 
          icon={CheckCircle2} 
          color="bg-indigo-500"
        />
        <StatCard 
          title="多选题" 
          value={stats.type2} 
          icon={Layout} 
          color="bg-rose-500"
        />
        <StatCard 
          title="带图片题目" 
          value={stats.withImage} 
          icon={CheckCircle2} 
          color="bg-emerald-500"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* 题目类型分布 */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <h3 className="text-lg font-bold mb-6 text-slate-800">题目类型分布</h3>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={typeData}
                  cx="50%"
                  cy="50%"
                  innerRadius={80}
                  outerRadius={110}
                  paddingAngle={5}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {typeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                   contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Legend verticalAlign="bottom" height={36}/>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 简单统计柱状图 - 比如是否有解析 */}
         <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <h3 className="text-lg font-bold mb-6 text-slate-800">题目属性统计</h3>
          <div className="h-80 w-full">
             <ResponsiveContainer width="100%" height="100%">
              <BarChart data={[
                { name: '含解析', value: questions.filter(q => q.explains).length },
                { name: '含图片', value: questions.filter(q => q.url).length },
                { name: '长题目(>20字)', value: questions.filter(q => q.question.length > 20).length }
              ]}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                <Tooltip 
                  cursor={{fill: 'transparent'}}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="value" radius={[10, 10, 0, 0]} barSize={40} fill="#6366f1" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
