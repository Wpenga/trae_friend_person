
import React, { useState, useMemo } from 'react';
import { useSchedules } from '../store/ScheduleContext';
import { Priority, Category, Schedule } from '../types';
import { 
  Trash2, 
  Edit3, 
  CheckCircle, 
  Circle, 
  Filter, 
  Search, 
  ChevronRight,
  ChevronLeft,
  ListTodo,
  AlertCircle
} from 'lucide-react';
import { Link } from 'react-router-dom';

const ScheduleList: React.FC = () => {
  const { state, dispatch } = useSchedules();
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const filteredSchedules = useMemo(() => {
    return state.schedules.filter(s => {
      const matchSearch = s.title.toLowerCase().includes(state.filter.search.toLowerCase()) || 
                          s.detail.toLowerCase().includes(state.filter.search.toLowerCase());
      const matchPriority = state.filter.priority === '全部' || s.priority === state.filter.priority;
      const matchCategory = state.filter.category === '全部' || s.category === state.filter.category;
      const matchStatus = state.filter.status === '全部' || 
                          (state.filter.status === '已完成' ? s.isCompleted : !s.isCompleted);
      
      return matchSearch && matchPriority && matchCategory && matchStatus;
    });
  }, [state.schedules, state.filter]);

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === filteredSchedules.length) setSelectedIds([]);
    else setSelectedIds(filteredSchedules.map(s => s.id));
  };

  const batchDelete = () => {
    if (window.confirm(`确认删除选中的 ${selectedIds.length} 项日程吗？`)) {
      dispatch({ type: 'BATCH_DELETE', payload: selectedIds });
      setSelectedIds([]);
    }
  };

  const batchMarkStatus = (status: boolean) => {
    dispatch({ type: 'BATCH_STATUS', payload: { ids: selectedIds, status } });
    setSelectedIds([]);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h2 className="text-2xl font-bold text-slate-800">日程管理列表</h2>
        <div className="flex items-center gap-3">
          <div className="relative group">
             <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
             <input 
              type="text" 
              placeholder="搜索标题、内容或详情..." 
              value={state.filter.search}
              onChange={(e) => dispatch({ type: 'SET_FILTER', payload: { search: e.target.value } })}
              className="pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none w-full md:w-64 transition-all text-sm"
            />
          </div>
          <button 
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className={`p-2 rounded-xl border transition-all ${isFilterOpen ? 'bg-indigo-50 border-indigo-200 text-indigo-600' : 'bg-white border-slate-200 text-slate-600'}`}
          >
            <Filter size={20} />
          </button>
        </div>
      </div>

      {/* 筛选面板 */}
      {isFilterOpen && (
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-wrap gap-4 animate-in slide-in-from-top-4 duration-300">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-500 uppercase">优先级筛选</label>
            <select 
              className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-sm outline-none focus:ring-1 focus:ring-indigo-500"
              value={state.filter.priority}
              onChange={(e) => dispatch({ type: 'SET_FILTER', payload: { priority: e.target.value as any } })}
            >
              <option value="全部">全部优先级</option>
              <option value={Priority.HIGH}>高优先级</option>
              <option value={Priority.MEDIUM}>中优先级</option>
              <option value={Priority.LOW}>低优先级</option>
            </select>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-500 uppercase">类别筛选</label>
            <select 
              className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-sm outline-none focus:ring-1 focus:ring-indigo-500"
              value={state.filter.category}
              onChange={(e) => dispatch({ type: 'SET_FILTER', payload: { category: e.target.value as any } })}
            >
              <option value="全部">全部类别</option>
              <option value={Category.WORK}>工作</option>
              <option value={Category.PERSONAL}>个人日常</option>
            </select>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-500 uppercase">状态筛选</label>
            <select 
              className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-sm outline-none focus:ring-1 focus:ring-indigo-500"
              value={state.filter.status}
              onChange={(e) => dispatch({ type: 'SET_FILTER', payload: { status: e.target.value as any } })}
            >
              <option value="全部">全部状态</option>
              <option value="未完成">未完成</option>
              <option value="已完成">已完成</option>
            </select>
          </div>
        </div>
      )}

      {/* 批量操作工具条 */}
      {selectedIds.length > 0 && (
        <div className="bg-indigo-600 text-white p-4 rounded-2xl shadow-lg flex items-center justify-between animate-in slide-in-from-bottom-4 duration-300">
          <span className="font-medium">已选中 {selectedIds.length} 项日程</span>
          <div className="flex gap-3">
            <button 
              onClick={() => batchMarkStatus(true)}
              className="bg-white/10 hover:bg-white/20 px-4 py-1.5 rounded-lg text-sm transition-colors"
            >
              标记为已完成
            </button>
            <button 
              onClick={batchDelete}
              className="bg-rose-500 hover:bg-rose-600 px-4 py-1.5 rounded-lg text-sm transition-colors"
            >
              批量删除
            </button>
          </div>
        </div>
      )}

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="p-4 w-12 text-center">
                  <input 
                    type="checkbox" 
                    checked={selectedIds.length === filteredSchedules.length && filteredSchedules.length > 0}
                    onChange={toggleSelectAll}
                    className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                  />
                </th>
                <th className="p-4 text-sm font-bold text-slate-500 uppercase">日程内容</th>
                <th className="p-4 text-sm font-bold text-slate-500 uppercase">优先级</th>
                <th className="p-4 text-sm font-bold text-slate-500 uppercase">类别</th>
                <th className="p-4 text-sm font-bold text-slate-500 uppercase">起止时间</th>
                <th className="p-4 text-sm font-bold text-slate-500 uppercase">完成状态</th>
                <th className="p-4 w-20">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredSchedules.map(item => (
                <tr key={item.id} className="group hover:bg-slate-50 transition-colors">
                  <td className="p-4 text-center">
                    <input 
                      type="checkbox" 
                      checked={selectedIds.includes(item.id)}
                      onChange={() => toggleSelect(item.id)}
                      className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                    />
                  </td>
                  <td className="p-4">
                    <div>
                      <h4 className={`font-semibold ${item.isCompleted ? 'text-slate-400 line-through' : 'text-slate-800'}`}>
                        {item.title}
                      </h4>
                      <p className="text-xs text-slate-500 truncate max-w-xs">{item.detail || '无详情描述'}</p>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-bold ${
                      item.priority === Priority.HIGH ? 'bg-rose-100 text-rose-700' :
                      item.priority === Priority.MEDIUM ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'
                    }`}>
                      {item.priority}
                    </span>
                  </td>
                  <td className="p-4 text-sm text-slate-600 font-medium">
                    {item.category}
                  </td>
                  <td className="p-4">
                    <div className="text-sm text-slate-600">
                      <div>{new Date(item.startTime).toLocaleDateString('zh-CN')}</div>
                      <div className="text-xs text-slate-400">
                        {new Date(item.startTime).toLocaleTimeString('zh-CN', {hour:'2-digit', minute:'2-digit'})} 起
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <button 
                      onClick={() => dispatch({ type: 'UPDATE_SCHEDULE', payload: { ...item, isCompleted: !item.isCompleted } })}
                      className={`p-1 rounded-full transition-colors ${item.isCompleted ? 'text-emerald-500 hover:text-emerald-600' : 'text-slate-300 hover:text-slate-400'}`}
                    >
                      {item.isCompleted ? <CheckCircle size={22} /> : <Circle size={22} />}
                    </button>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Link to={`/edit/${item.id}`} className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors" title="编辑">
                        <Edit3 size={18} />
                      </Link>
                      <button 
                        onClick={() => window.confirm('确定要删除这条日程吗？') && dispatch({ type: 'DELETE_SCHEDULE', payload: item.id })}
                        className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                        title="删除"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredSchedules.length === 0 && (
                <tr>
                  <td colSpan={7} className="p-12 text-center text-slate-400">
                    <div className="mb-4 flex justify-center opacity-20"><ListTodo size={64} /></div>
                    <p>暂无符合筛选条件的日程记录</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <p className="text-sm text-slate-500">共计 {filteredSchedules.length} 条日程记录</p>
          <div className="flex gap-2">
            <button className="p-2 border border-slate-200 rounded-lg bg-white disabled:opacity-50" disabled><ChevronLeft size={16} /></button>
            <button className="p-2 border border-slate-200 rounded-lg bg-white disabled:opacity-50" disabled><ChevronRight size={16} /></button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScheduleList;
