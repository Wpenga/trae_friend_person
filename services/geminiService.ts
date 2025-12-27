
// 获取魔搭 API 配置
// 注意：process.env.MODELSCOPE_CONFIG 已经是对象，因为 Vite 的 define 会直接注入
// 使用类型断言解决 TypeScript 类型问题
interface Provider {
  name: string;
  api_base_url: string;
  api_key: string;
  models: string[];
}

interface ModelscopeConfig {
  Providers: Provider[];
}

const modelscopeConfig = (process.env.MODELSCOPE_CONFIG as unknown as ModelscopeConfig) || {
  Providers: [
    {
      name: "modelscope",
      api_base_url: "https://api.modelscope.cn/v1/chat/completions", // 修正 API 端点
      api_key: "ms-f8467869-c76e-4912-be0b-4786480a01be",
      models: ["qwen/Qwen2.5-72B-Instruct"] // 使用更稳定的模型
    }
  ]
};

const provider = modelscopeConfig.Providers[0];

export const parseVoiceInput = async (text: string) => {
  const now = new Date();
  const todayStr = now.toISOString();
  
  try {
    const response = await fetch(provider.api_base_url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${provider.api_key}`
      },
      body: JSON.stringify({
        model: provider.models[0],
        messages: [
          {
            role: "system",
            content: "你是一个智能日程解析助手，负责将用户的语音输入解析为结构化的日程数据。请严格按照 JSON 格式返回结果，不要包含任何其他解释或说明。"
          },
          {
            role: "user",
            content: `解析以下日程语音输入: "${text}"。\n当前时间是 ${todayStr}。\n请返回包含以下字段的 JSON 对象：\n- title: 日程标题 (字符串)\n- detail: 日程详情 (字符串)\n- priority: 优先级 (只能是：高/中/低)\n- category: 类别 (只能是：工作/个人日常)\n- startTime: 开始时间 (ISO 格式字符串)\n- endTime: 结束时间 (ISO 格式字符串)\n- isCompleted: 是否已完成 (布尔值)\n\n规则：\n1. 如果未指定时间，默认设为今天 09:00 至 10:00。\n2. 根据“紧急”、“重要”、“尽快”等词推断为“高”优先级。\n3. 根据“会议”、“工作”、“汇报”推断为“工作”类别；根据“吃饭”、“购物”、“休息”推断为“个人日常”类别。\n4. 如果包含“已完成”或“搞定”，设置 isCompleted 为 true，否则为 false。`
          }
        ],
        max_tokens: 2048,
        temperature: 0.7
      })
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      console.error("API 响应错误:", data);
      throw new Error(`API 请求失败: ${response.status} ${response.statusText} - ${data.error?.message || '未知错误'}`);
    }
    
    // 解析模型返回的内容
    let result = null;
    if (data.choices && data.choices.length > 0) {
      const content = data.choices[0].message.content;
      console.log("模型原始响应:", content);
      
      try {
        // 移除可能的 markdown 代码块标记
        const cleanContent = content.replace(/^```json|```$/g, '').trim();
        result = JSON.parse(cleanContent);
      } catch (jsonError) {
        console.error("解析 JSON 响应失败:", jsonError, "原始内容:", content);
        // 尝试直接提取 JSON 部分（处理模型可能返回的额外文本）
        const jsonMatch = content.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          try {
            result = JSON.parse(jsonMatch[0]);
          } catch (fallbackError) {
            console.error("备用解析也失败:", fallbackError);
            return null;
          }
        } else {
          return null;
        }
      }
    }
    
    return result;
  } catch (e) {
    console.error("AI 解析响应失败", e);
    // 为了演示，返回一个模拟数据
    return {
      title: text,
      detail: "",
      priority: "中",
      category: "个人日常",
      startTime: new Date().toISOString(),
      endTime: new Date(Date.now() + 3600000).toISOString(),
      isCompleted: false
    };
  }
};
