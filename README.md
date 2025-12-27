# 个人日程记录表单提交系统

一个功能完整的个人日程管理应用，支持语音识别录入、AI智能分析和深色主题切换。

## 🎯 核心功能

### 1. 日程管理
- **新增日程**：通过表单创建详细的日程记录
- **日程列表**：查看所有日程的完整列表
- **仪表盘**：通过数据可视化展示日程统计信息

### 2. 语音识别与AI分析
- **语音录入**：使用浏览器原生Web Speech API实现语音转文字
- **AI智能解析**：集成魔搭(ModelScope)API，自动分析语音内容并填充表单字段
- **智能分类**：自动识别日程的优先级和所属类别

### 3. 个性化设置
- **主题切换**：支持浅色/深色主题切换
- **响应式设计**：适配不同屏幕尺寸的设备

## 🛠️ 技术栈

### 核心框架与工具
- **React 19.x**：现代化前端框架
- **TypeScript**：类型安全的JavaScript超集
- **Vite 6.x**：快速的构建工具
- **React Router 7.x**：客户端路由管理

### UI与组件
- **Tailwind CSS**：实用优先的CSS框架
- **Lucide React**：精美的图标库
- **Recharts**：数据可视化图表库

### 状态管理
- **React Context API**：全局状态管理
- **useReducer**：复杂状态逻辑处理

### 语音与AI
- **Web Speech API**：浏览器原生语音识别
- **魔搭(ModelScope) API**：AI文本分析与处理

## 🚀 快速开始

### 环境要求
- Node.js 18.x 或更高版本
- npm 或 yarn 包管理器

### 安装与运行

1. **克隆或下载项目**
   ```bash
   cd 项目目录
   ```

2. **安装依赖**
   ```bash
   npm install
   ```

3. **启动开发服务器**
   ```bash
   npm run dev
   ```

4. **访问应用**
   打开浏览器访问 `http://localhost:3000`

## ⚙️ 配置说明

### API配置

应用使用魔搭(ModelScope)API进行AI分析，配置信息位于 `vite.config.ts` 文件中：

```typescript
define: {
  'process.env.MODELSCOPE_CONFIG': JSON.stringify({
    Providers: [
      {
        name: "modelscope",
        api_base_url: "https://api.modelscope.cn/v1/chat/completions",
        api_key: "your-api-key",
        models: ["qwen/Qwen2.5-72B-Instruct"]
      }
    ],
    Router: {
      default: "modelscope,qwen/Qwen2.5-72B-Instruct"
    }
  })
}
```

### 主题配置

应用支持浅色和深色主题切换，主题设置会自动保存到本地存储中。

## 📁 项目结构

```
├── pages/              # 页面组件
│   ├── Dashboard.tsx   # 仪表盘页面
│   ├── ScheduleForm.tsx # 日程表单页面
│   └── ScheduleList.tsx # 日程列表页面
├── services/           # 服务层
│   └── geminiService.ts # AI分析服务
├── store/              # 状态管理
│   └── ScheduleContext.tsx # 日程上下文
├── App.tsx             # 应用主组件
├── index.tsx           # 应用入口
├── vite.config.ts      # Vite配置
└── package.json        # 项目依赖
```

## 🤝 贡献

欢迎提交Issue和Pull Request来帮助改进这个项目！

## 📄 许可证

MIT License

## 📞 联系方式

如有问题或建议，请通过以下方式联系：
- 项目维护者：XXX
- 邮箱：XXX@example.com
