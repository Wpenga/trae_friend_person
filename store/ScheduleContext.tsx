
import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { Schedule, ScheduleState, ScheduleAction, Priority, Category } from '../types';

const initialState: ScheduleState = {
  schedules: [],
  draft: null,
  filter: {
    priority: '全部',
    category: '全部',
    status: '全部',
    search: '',
    timeRange: '近30天',
  },
};

const scheduleReducer = (state: ScheduleState, action: ScheduleAction): ScheduleState => {
  switch (action.type) {
    case 'INITIALIZE':
      return { ...state, schedules: action.payload };
    case 'ADD_SCHEDULE':
      return { ...state, schedules: [action.payload, ...state.schedules] };
    case 'UPDATE_SCHEDULE':
      return {
        ...state,
        schedules: state.schedules.map(s => s.id === action.payload.id ? action.payload : s)
      };
    case 'DELETE_SCHEDULE':
      return { ...state, schedules: state.schedules.filter(s => s.id !== action.payload) };
    case 'BATCH_DELETE':
      return { ...state, schedules: state.schedules.filter(s => !action.payload.includes(s.id)) };
    case 'BATCH_STATUS':
      return {
        ...state,
        schedules: state.schedules.map(s => 
          action.payload.ids.includes(s.id) ? { ...s, isCompleted: action.payload.status } : s
        )
      };
    case 'SET_FILTER':
      return { ...state, filter: { ...state.filter, ...action.payload } };
    case 'SAVE_DRAFT':
      return { ...state, draft: action.payload };
    case 'CLEAR_DRAFT':
      return { ...state, draft: null };
    default:
      return state;
  }
};

const ScheduleContext = createContext<{
  state: ScheduleState;
  dispatch: React.Dispatch<ScheduleAction>;
} | undefined>(undefined);

export const ScheduleProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(scheduleReducer, initialState);

  useEffect(() => {
    const saved = localStorage.getItem('smart_schedules');
    if (saved) {
      try {
        dispatch({ type: 'INITIALIZE', payload: JSON.parse(saved) });
      } catch (e) {
        console.error('解析日程数据失败', e);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('smart_schedules', JSON.stringify(state.schedules));
  }, [state.schedules]);

  return (
    <ScheduleContext.Provider value={{ state, dispatch }}>
      {children}
    </ScheduleContext.Provider>
  );
};

export const useSchedules = () => {
  const context = useContext(ScheduleContext);
  if (!context) throw new Error('useSchedules 必须在 ScheduleProvider 中使用');
  return context;
};
