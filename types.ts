
export enum Priority {
  HIGH = '高',
  MEDIUM = '中',
  LOW = '低'
}

export enum Category {
  WORK = '工作',
  PERSONAL = '个人日常'
}

export interface Schedule {
  id: string;
  title: string;
  detail: string;
  priority: Priority;
  category: Category;
  startTime: string;
  endTime: string;
  reminders: string[]; // 例如: ['5min', '15min']
  isCompleted: boolean;
  notes: string;
  createdAt: string;
}

export interface ScheduleState {
  schedules: Schedule[];
  draft: Partial<Schedule> | null;
  filter: {
    priority: Priority | '全部';
    category: Category | '全部';
    status: '全部' | '已完成' | '未完成';
    search: string;
    timeRange: '近7天' | '近30天' | '全部';
  };
}

export type ScheduleAction =
  | { type: 'ADD_SCHEDULE'; payload: Schedule }
  | { type: 'UPDATE_SCHEDULE'; payload: Schedule }
  | { type: 'DELETE_SCHEDULE'; payload: string }
  | { type: 'BATCH_DELETE'; payload: string[] }
  | { type: 'BATCH_STATUS'; payload: { ids: string[]; status: boolean } }
  | { type: 'SET_FILTER'; payload: Partial<ScheduleState['filter']> }
  | { type: 'SAVE_DRAFT'; payload: Partial<Schedule> }
  | { type: 'CLEAR_DRAFT' }
  | { type: 'INITIALIZE'; payload: Schedule[] };
