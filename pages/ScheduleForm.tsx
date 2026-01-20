import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Question } from '../types';
import { 
  Save, 
  RotateCcw, 
  ArrowLeft, 
} from 'lucide-react';

const ScheduleForm: React.FC = () => {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState<Partial<Question>>({
    question: '',
    answer: '',
    item1: '',
    item2: '',
    item3: '',
    item4: '',
    explains: '',
    url: '',
    type: 1
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'type' ? Number(value) : value
    }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.question) return alert("请填写题目内容");
    if (!formData.answer) return alert("请填写正确答案");
    if (!formData.item1 || !formData.item2) return alert("至少需要填写两个选项");

    try {
      const response = await fetch('http://localhost:3001/api/questions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert('题目保存成功！');
        navigate('/list');
      } else {
        alert('保存失败，请检查服务器连接');
      }
    } catch (error) {
      console.error('Error saving question:', error);
      alert('保存出错，请确保后台服务已启动');
    }
  };

  const handleReset = () => {
    if (window.confirm("确定要清空表单内容吗？")) {
      setFormData({
        question: '',
        answer: '',
        item1: '',
        item2: '',
        item3: '',
        item4: '',
        explains: '',
        url: '',
        type: 1
      });
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <button onClick={() => navigate(-1)} className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-500">
          <ArrowLeft size={24} />
        </button>
        <h2 className="text-2xl font-bold text-slate-800">新增题目</h2>
      </div>

      <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
        <form onSubmit={handleSave} className="space-y-6">
          <div className="space-y-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-bold text-slate-600">题目内容 *</label>
              <textarea 
                name="question"
                value={formData.question}
                onChange={handleInputChange}
                placeholder="请输入题目描述..."
                className="px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all h-24 resize-none font-medium"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-bold text-slate-600">题目类型</label>
                <select 
                  name="type"
                  value={formData.type}
                  onChange={handleInputChange}
                  className="px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value={0}>判断题</option>
                  <option value={1}>单选题</option>
                  <option value={2}>多选题</option>
                </select>
              </div>
              
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-bold text-slate-600">正确答案 *</label>
                <input 
                  type="text" 
                  name="answer"
                  value={formData.answer}
                  onChange={handleInputChange}
                  placeholder="例如：A 或 ABC"
                  className="px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all font-medium uppercase"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-bold text-slate-600">选项 A *</label>
                <input 
                  type="text" 
                  name="item1"
                  value={formData.item1}
                  onChange={handleInputChange}
                  className="px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                  required
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-bold text-slate-600">选项 B *</label>
                <input 
                  type="text" 
                  name="item2"
                  value={formData.item2}
                  onChange={handleInputChange}
                  className="px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                  required
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-bold text-slate-600">选项 C</label>
                <input 
                  type="text" 
                  name="item3"
                  value={formData.item3}
                  onChange={handleInputChange}
                  className="px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-bold text-slate-600">选项 D</label>
                <input 
                  type="text" 
                  name="item4"
                  value={formData.item4}
                  onChange={handleInputChange}
                  className="px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-bold text-slate-600">题目解析</label>
              <textarea 
                name="explains"
                value={formData.explains}
                onChange={handleInputChange}
                placeholder="请输入答案解析..."
                className="px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all h-24 resize-none"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-bold text-slate-600">图片 URL</label>
              <input 
                type="text" 
                name="url"
                value={formData.url}
                onChange={handleInputChange}
                placeholder="http://..."
                className="px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
              />
            </div>
          </div>

          <div className="flex items-center gap-4 pt-4 border-t border-slate-100">
            <button 
              type="submit" 
              className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-xl shadow-lg shadow-indigo-100 transition-all flex items-center justify-center gap-2 active:scale-95"
            >
              <Save size={20} />
              保存题目
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
    </div>
  );
};

export default ScheduleForm;
