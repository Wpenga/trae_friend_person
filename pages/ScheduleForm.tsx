
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useSchedules } from '../store/ScheduleContext';
import { Priority, Category, Schedule } from '../types';
import { parseVoiceInput } from '../services/geminiService';
import { 
  Mic, 
  MicOff, 
  Save, 
  RotateCcw, 
  ArrowLeft, 
  CheckCircle2, 
  Loader2,
  Sparkles
} from 'lucide-react';

const ScheduleForm: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { state, dispatch } = useSchedules();
  
  const [formData, setFormData] = useState<Partial<Schedule>>({
    title: '',
    detail: '',
    priority: Priority.MEDIUM,
    category: Category.PERSONAL,
    startTime: new Date().toISOString().slice(0, 16),
    endTime: new Date(Date.now() + 3600000).toISOString().slice(0, 16),
    isCompleted: false,
    reminders: [],
    notes: '',
  });

  const [isRecording, setIsRecording] = useState(false);
  const [isAIProcessing, setIsAIProcessing] = useState(false);
  const [speechResult, setSpeechResult] = useState('');
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    if (id) {
      const existing = state.schedules.find(s => s.id === id);
      if (existing) {
        setFormData({
          ...existing,
          startTime: existing.startTime.slice(0, 16),
          endTime: existing.endTime.slice(0, 16),
        });
      }
    } else if (state.draft) {
      setFormData(prev => ({ ...prev, ...state.draft }));
    }
  }, [id, state.schedules, state.draft]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as any;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as any).checked : value
    }));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title) return alert("请填写日程标题");

    const schedule: Schedule = {
      ...formData as Schedule,
      id: id || Math.random().toString(36).substr(2, 9),
      createdAt: (formData as Schedule).createdAt || new Date().toISOString(),
    };

    if (id) {
      dispatch({ type: 'UPDATE_SCHEDULE', payload: schedule });
    } else {
      dispatch({ type: 'ADD_SCHEDULE', payload: schedule });
      dispatch({ type: 'CLEAR_DRAFT' });
    }
    navigate('/');
  };

  const handleReset = () => {
    if (window.confirm("确定要清空表单内容吗？")) {
      setFormData({
        title: '',
        detail: '',
        priority: Priority.MEDIUM,
        category: Category.PERSONAL,
        startTime: new Date().toISOString().slice(0, 16),
        endTime: new Date(Date.now() + 3600000).toISOString().slice(0, 16),
        isCompleted: false,
        reminders: [],
        notes: '',
      });
    }
  };

  const startVoiceRecognition = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) return alert("当前浏览器不支持语音识别。建议使用 Chrome 浏览器。");

    const recognition = new SpeechRecognition();
    recognition.lang = 'zh-CN';
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => setIsRecording(true);
    recognition.onend = () => setIsRecording(false);
    recognition.onresult = async (event: any) => {
      const transcript = event.results[0][0].transcript;
      setSpeechResult(transcript);
      setIsAIProcessing(true);
      
      const parsedData = await parseVoiceInput(transcript);
      if (parsedData) {
        setFormData(prev => ({
          ...prev,
          ...parsedData,
          startTime: parsedData.startTime?.slice(0, 16),
          endTime: parsedData.endTime?.slice(0, 16),
        }));
      }
      setIsAIProcessing(false);
    };

    recognitionRef.current = recognition;
    recognition.start();
  };

  const stopVoiceRecognition = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsRecording(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <button onClick={() => navigate(-1)} className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-500">
          <ArrowLeft size={24} />
        </button>
        <h2 className="text-2xl font-bold text-slate-800">{id ? '编辑日程信息' : '创建新日程计划'}</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* 表单填写区域 */}
        <div className="lg:col-span-2 space-y-6">
          <form onSubmit={handleSave} className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
            <div className="space-y-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-bold text-slate-600">日程标题 *</label>
                <input 
                  type="text" 
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="例如：周一项目例会"
                  className="px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all font-medium"
                  required
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-bold text-slate-600">日程详情</label>
                <textarea 
                  name="detail"
                  value={formData.detail}
                  onChange={handleInputChange}
                  placeholder="请输入具体的会议议题、待办事项等..."
                  className="px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all h-24 resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-bold text-slate-600">优先级</label>
                  <select 
                    name="priority"
                    value={formData.priority}
                    onChange={handleInputChange}
                    className="px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value={Priority.HIGH}>高优先级</option>
                    <option value={Priority.MEDIUM}>中优先级</option>
                    <option value={Priority.LOW}>低优先级</option>
                  </select>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-bold text-slate-600">所属类别</label>
                  <select 
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value={Category.WORK}>工作</option>
                    <option value={Category.PERSONAL}>个人日常</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-bold text-slate-600">开始时间</label>
                  <input 
                    type="datetime-local" 
                    name="startTime"
                    value={formData.startTime}
                    onChange={handleInputChange}
                    className="px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-bold text-slate-600">结束时间</label>
                  <input 
                    type="datetime-local" 
                    name="endTime"
                    value={formData.endTime}
                    onChange={handleInputChange}
                    className="px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input 
                  type="checkbox" 
                  id="isCompleted"
                  name="isCompleted"
                  checked={formData.isCompleted}
                  onChange={handleInputChange}
                  className="w-5 h-5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                />
                <label htmlFor="isCompleted" className="text-sm font-medium text-slate-700">标记为已完成</label>
              </div>
            </div>

            <div className="flex items-center gap-4 pt-4 border-t border-slate-100">
              <button 
                type="submit" 
                className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-xl shadow-lg shadow-indigo-100 transition-all flex items-center justify-center gap-2 active:scale-95"
              >
                <Save size={20} />
                {id ? '保存修改' : '立即提交'}
              </button>
              <button 
                type="button" 
                onClick={handleReset}
                className="p-3 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-all"
                title="重置表单"
              >
                <RotateCcw size={24} />
              </button>
            </div>
          </form>
        </div>

        {/* AI 语音交互侧边栏 */}
        <div className="space-y-6">
          <div className="bg-gradient-to-br from-indigo-600 to-purple-700 p-6 rounded-2xl text-white shadow-xl shadow-indigo-200 overflow-hidden relative">
            <div className="relative z-10">
              <h3 className="text-lg font-bold flex items-center gap-2 mb-2">
                <Sparkles size={20} />
                AI 语音录入
              </h3>
              <p className="text-sm text-indigo-100 mb-6 opacity-90">
                按住下方的按钮说话，AI 将自动为您填充日程各字段。
              </p>
              
              <div className="flex flex-col items-center gap-4">
                <button 
                  onMouseDown={startVoiceRecognition}
                  onMouseUp={stopVoiceRecognition}
                  className={`w-20 h-20 rounded-full flex items-center justify-center transition-all shadow-xl group relative ${
                    isRecording 
                      ? 'bg-rose-500 scale-110 shadow-rose-500/50' 
                      : 'bg-white text-indigo-600 hover:bg-indigo-50'
                  }`}
                >
                  {isRecording ? (
                    <>
                      <MicOff size={32} />
                      <span className="absolute -inset-2 border-4 border-rose-400/50 rounded-full animate-ping"></span>
                    </>
                  ) : (
                    <Mic size={32} />
                  )}
                </button>
                <p className="text-xs font-medium uppercase tracking-wider opacity-80">
                  {isRecording ? '正在聆听中...' : '长按说话'}
                </p>
              </div>

              {isAIProcessing && (
                <div className="mt-6 flex items-center justify-center gap-2 text-sm font-medium bg-white/10 py-2 rounded-lg backdrop-blur-sm animate-pulse">
                  <Loader2 size={18} className="animate-spin" />
                  AI 正在处理语义...
                </div>
              )}

              {speechResult && !isAIProcessing && (
                <div className="mt-4 p-3 bg-white/10 rounded-xl backdrop-blur-sm border border-white/10">
                  <p className="text-xs font-bold text-white/50 uppercase mb-1">识别文本内容</p>
                  <p className="text-sm italic line-clamp-3">“{speechResult}”</p>
                </div>
              )}
            </div>
            <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-white/10 rounded-full blur-3xl"></div>
            <div className="absolute top-0 left-0 w-24 h-24 bg-white/5 rounded-full blur-2xl"></div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <h3 className="font-bold text-slate-800 mb-4">语音指令示例</h3>
            <ul className="space-y-3 text-sm text-slate-500">
              <li className="flex gap-2">
                <CheckCircle2 size={16} className="text-emerald-500 flex-shrink-0 mt-0.5" />
                “明天下午3点和团队开会，讨论需求”
              </li>
              <li className="flex gap-2">
                <CheckCircle2 size={16} className="text-emerald-500 flex-shrink-0 mt-0.5" />
                “紧急任务：今晚5点前完成周报汇报”
              </li>
              <li className="flex gap-2">
                <CheckCircle2 size={16} className="text-emerald-500 flex-shrink-0 mt-0.5" />
                “下周日早上8点去超市买生活用品”
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScheduleForm;
