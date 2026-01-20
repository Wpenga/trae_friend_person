import React, { useState, useMemo } from 'react';
import { Question } from '../types';
import questionsData from '../src/data/questions.json';
import { Search, Eye, X, CheckCircle2 } from 'lucide-react';

const questions = questionsData as unknown as Question[];

const ScheduleList: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  const filteredQuestions = useMemo(() => {
    return questions.filter(q => {
      const matchesSearch = q.question.includes(searchTerm) || q.id.toString().includes(searchTerm);
      const matchesType = filterType === 'all' || q.type === Number(filterType);
      return matchesSearch && matchesType;
    });
  }, [searchTerm, filterType]);

  const totalPages = Math.ceil(filteredQuestions.length / itemsPerPage);
  const currentQuestions = filteredQuestions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
       {/* Search Header */}
       <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
         <h2 className="text-2xl font-bold text-slate-800">题目列表</h2>
         <div className="relative flex items-center gap-4">
           <select
             value={filterType}
             onChange={(e) => { setFilterType(e.target.value); setCurrentPage(1); }}
             className="px-4 py-2 border border-slate-200 rounded-xl bg-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-slate-600"
           >
             <option value="all">全部题型</option>
             <option value="0">判断题</option>
             <option value="1">单选题</option>
             <option value="2">多选题</option>
           </select>
           <div className="relative">
             <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
             <input 
               type="text" 
               placeholder="搜索题目内容或ID..." 
               value={searchTerm}
               onChange={e => { setSearchTerm(e.target.value); setCurrentPage(1); }}
               className="pl-10 pr-4 py-2 border border-slate-200 rounded-xl w-full md:w-80 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
             />
           </div>
         </div>
       </div>

       {/* Table */}
       <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
         <div className="overflow-x-auto">
           <table className="w-full text-left">
             <thead className="bg-slate-50 border-b border-slate-200">
               <tr>
                 <th className="p-4 w-20 font-bold text-slate-500">ID</th>
                 <th className="p-4 font-bold text-slate-500">题目内容</th>
                 <th className="p-4 w-32 font-bold text-slate-500">类型</th>
                 <th className="p-4 w-24 font-bold text-slate-500">操作</th>
               </tr>
             </thead>
             <tbody className="divide-y divide-slate-100">
               {currentQuestions.map(q => (
                 <tr key={q.id} className="hover:bg-slate-50 transition-colors cursor-pointer group" onClick={() => setSelectedQuestion(q)}>
                   <td className="p-4 text-slate-500">#{q.id}</td>
                   <td className="p-4 font-medium text-slate-800 truncate max-w-md">
                     {q.question}
                   </td>
                   <td className="p-4 text-sm">
                     <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                       q.type === 0 ? 'bg-amber-100 text-amber-700' :
                       q.type === 1 ? 'bg-indigo-100 text-indigo-700' : 
                       q.type === 2 ? 'bg-rose-100 text-rose-700' : 'bg-slate-100 text-slate-700'
                     }`}>
                       {q.type === 0 ? '判断题' : q.type === 1 ? '单选题' : q.type === 2 ? '多选题' : `类型${q.type}`}
                     </span>
                   </td>
                   <td className="p-4">
                     <button className="text-indigo-600 hover:text-indigo-700 p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                       <Eye size={20} />
                     </button>
                   </td>
                 </tr>
               ))}
               {currentQuestions.length === 0 && (
                 <tr>
                   <td colSpan={4} className="p-12 text-center text-slate-400">
                     没有找到匹配的题目
                   </td>
                 </tr>
               )}
             </tbody>
           </table>
         </div>
         
         {/* Pagination */}
         {totalPages > 1 && (
           <div className="p-4 flex justify-center gap-2 border-t border-slate-200 bg-slate-50">
             <button 
               disabled={currentPage === 1}
               onClick={() => setCurrentPage(p => p - 1)}
               className="px-4 py-2 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium transition-colors"
             >
               上一页
             </button>
             <span className="px-4 py-2 text-sm font-medium text-slate-600 flex items-center">
               {currentPage} / {totalPages}
             </span>
             <button 
               disabled={currentPage === totalPages}
               onClick={() => setCurrentPage(p => p + 1)}
               className="px-4 py-2 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium transition-colors"
             >
               下一页
             </button>
           </div>
         )}
       </div>

       {/* Modal */}
       {selectedQuestion && (
         <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200" onClick={() => setSelectedQuestion(null)}>
           <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 space-y-6 shadow-2xl animate-in zoom-in-95 duration-200" onClick={e => e.stopPropagation()}>
             <div className="flex justify-between items-start gap-4">
               <div className="flex-1">
                 <div className="flex items-center gap-2 mb-2">
                    <span className={`px-2 py-0.5 rounded text-xs font-bold ${
                      selectedQuestion.type === 0 ? 'bg-amber-100 text-amber-700' :
                      selectedQuestion.type === 1 ? 'bg-indigo-100 text-indigo-700' : 
                      selectedQuestion.type === 2 ? 'bg-rose-100 text-rose-700' : 'bg-slate-100 text-slate-700'
                    }`}>
                       {selectedQuestion.type === 0 ? '判断题' : selectedQuestion.type === 1 ? '单选题' : selectedQuestion.type === 2 ? '多选题' : `类型${selectedQuestion.type}`}
                    </span>
                    <span className="text-slate-400 text-xs">ID: {selectedQuestion.id}</span>
                 </div>
                 <h3 className="text-xl font-bold text-slate-900 leading-snug">{selectedQuestion.question}</h3>
               </div>
               <button onClick={() => setSelectedQuestion(null)} className="text-slate-400 hover:text-slate-600 p-1 hover:bg-slate-100 rounded-full transition-colors">
                 <X size={24} />
               </button>
             </div>

             {selectedQuestion.url && selectedQuestion.url.trim() !== '' && (
               <div className="rounded-xl border border-slate-100 overflow-hidden bg-slate-50 p-2">
                 <img src={selectedQuestion.url} alt="题目图片" className="rounded-lg max-h-60 object-contain mx-auto" />
               </div>
             )}

             <div className="space-y-3">
               {['A', 'B', 'C', 'D'].map((opt, idx) => {
                 const itemKey = `item${idx + 1}` as keyof Question;
                 const content = selectedQuestion[itemKey];
                 if (!content || content.trim() === '') return null;
                 
                 const isAnswer = selectedQuestion.answer.includes(opt);
                 
                 return (
                   <div key={opt} className={`p-4 rounded-xl border flex items-center gap-4 transition-all ${isAnswer ? 'bg-emerald-50 border-emerald-200 ring-1 ring-emerald-200' : 'bg-white border-slate-200 hover:border-indigo-200'}`}>
                     <span className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm shadow-sm ${isAnswer ? 'bg-emerald-500 text-white' : 'bg-slate-100 text-slate-500'}`}>
                       {opt}
                     </span>
                     <span className={`flex-1 ${isAnswer ? 'text-emerald-900 font-medium' : 'text-slate-700'}`}>
                       {content}
                     </span>
                     {isAnswer && <CheckCircle2 size={20} className="text-emerald-500 ml-auto" />}
                   </div>
                 );
               })}
             </div>

             <div className="bg-slate-50 p-5 rounded-2xl space-y-3 border border-slate-100">
               <div className="flex items-center gap-2">
                 <span className="font-bold text-slate-800">正确答案:</span>
                 <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-lg font-bold text-lg">{selectedQuestion.answer}</span>
               </div>
               <div>
                 <span className="font-bold text-slate-800 block mb-2">题目解析:</span>
                 <div className="text-slate-600 text-sm leading-relaxed p-3 bg-white rounded-xl border border-slate-100">
                   {selectedQuestion.explains ? (
                      <div dangerouslySetInnerHTML={{ __html: selectedQuestion.explains }} />
                   ) : (
                      "暂无解析"
                   )}
                 </div>
               </div>
             </div>
           </div>
         </div>
       )}
    </div>
  );
};

export default ScheduleList;
