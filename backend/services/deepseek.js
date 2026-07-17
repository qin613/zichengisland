/**
 * DeepSeek API 服务封装
 * 负责构造 Prompt、调用 API、解析响应
 */

// 加载环境变量
require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });

const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY;
const DEEPSEEK_BASE_URL = process.env.DEEPSEEK_BASE_URL || 'https://api.deepseek.com';
const DEEPSEEK_MODEL = process.env.DEEPSEEK_MODEL || 'deepseek-chat';

/**
 * System Prompt — 任务拆解规则
 */
const SYSTEM_PROMPT = `你是一个专业的任务拆解助手。你的职责是将用户输入的任务描述，拆解为多个可执行的子任务。

## 拆解规则：
1. **粒度适中**：每个子任务的预估耗时应在 0.5-8 小时之间
2. **逻辑完整**：覆盖从开始到完成的完整流程，不遗漏关键步骤
3. **依赖明确**：标注子任务之间的依赖关系（前置任务必须先完成）
4. **优先级合理**：根据任务的重要性和紧急程度设置优先级
5. **描述清晰**：每个子任务应有明确的标题和具体的描述，让人一看就知道该做什么
6. **数量合理**：一般拆解为 3-10 个子任务，简单任务可以更少

## 输出格式要求：
你必须严格输出以下 JSON 格式，不要包含任何其他文字：

\`\`\`json
[
  {
    "id": "task_1",
    "title": "子任务标题",
    "description": "详细描述该子任务需要做什么",
    "priority": "high|medium|low",
    "estimatedHours": 2,
    "dependencies": []
  }
]
\`\`\`

注意：
- id 使用 task_1, task_2, task_3 ... 格式
- dependencies 填入依赖任务的 id 列表，无依赖则为空数组
- 只输出 JSON 数组，不要包含 markdown 代码块标记`;

/**
 * 调用 DeepSeek API 进行任务拆解
 * @param {string} taskDescription - 用户输入的任务描述
 * @returns {Promise<Array>} 拆解后的子任务数组
 */
async function decomposeTask(taskDescription) {
  if (!DEEPSEEK_API_KEY || DEEPSEEK_API_KEY === 'sk-your-api-key-here') {
    throw new Error('API_KEY_NOT_CONFIGURED: 请先在 backend/.env 文件中配置你的 DeepSeek API Key');
  }

  const url = `${DEEPSEEK_BASE_URL}/chat/completions`;

  const requestBody = {
    model: DEEPSEEK_MODEL,
    messages: [
      { role: 'system', content: SYSTEM_PROMPT },
      { role: 'user', content: `请帮我拆解以下任务：\n\n${taskDescription}` }
    ],
    temperature: 0.7,
    max_tokens: 4096,
    stream: false
  };

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 60000); // 60秒超时

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${DEEPSEEK_API_KEY}`
      },
      body: JSON.stringify(requestBody),
      signal: controller.signal
    });

    if (!response.ok) {
      const errorText = await response.text();
      if (response.status === 401) {
        throw new Error('AUTH_ERROR: API Key 无效，请检查 .env 中的 DEEPSEEK_API_KEY');
      }
      if (response.status === 429) {
        throw new Error('RATE_LIMIT: 请求过于频繁，请稍后再试');
      }
      throw new Error(`API_ERROR(${response.status}): ${errorText}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    if (!content) {
      throw new Error('API 返回内容为空，请重试');
    }

    // 解析 DeepSeek 返回的 JSON
    const subtasks = parseResponse(content);
    return subtasks;

  } catch (error) {
    if (error.name === 'AbortError') {
      throw new Error('TIMEOUT: API 请求超时（60秒），请检查网络或稍后重试');
    }
    // 已经是格式化的错误，直接抛出
    if (error.message.includes('API_KEY_NOT_CONFIGURED') ||
        error.message.includes('AUTH_ERROR') ||
        error.message.includes('RATE_LIMIT') ||
        error.message.includes('API_ERROR') ||
        error.message.includes('TIMEOUT') ||
        error.message.includes('PARSE_ERROR') ||
        error.message.includes('EMPTY_RESULT')) {
      throw error;
    }
    throw new Error(`NETWORK_ERROR: ${error.message}`);
  } finally {
    clearTimeout(timeout);
  }
}

/**
 * 解析 API 返回内容，提取 JSON 子任务数组
 * @param {string} content - API 返回的文本内容
 * @returns {Array} 子任务数组
 */
function parseResponse(content) {
  // 尝试多种方式提取 JSON
  let jsonStr = content.trim();

  // 方式1: 提取 ```json ... ``` 代码块
  const codeBlockMatch = jsonStr.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (codeBlockMatch) {
    jsonStr = codeBlockMatch[1].trim();
  }

  // 方式2: 尝试找到第一个 [ 和最后一个 ]
  const firstBracket = jsonStr.indexOf('[');
  const lastBracket = jsonStr.lastIndexOf(']');
  if (firstBracket !== -1 && lastBracket !== -1 && lastBracket > firstBracket) {
    jsonStr = jsonStr.substring(firstBracket, lastBracket + 1);
  }

  let subtasks;
  try {
    subtasks = JSON.parse(jsonStr);
  } catch (e) {
    throw new Error(`PARSE_ERROR: 无法解析 API 返回的任务数据。请重试。原始响应: ${content.substring(0, 200)}`);
  }

  if (!Array.isArray(subtasks) || subtasks.length === 0) {
    throw new Error('EMPTY_RESULT: API 未能生成有效的子任务列表，请尝试更详细地描述你的任务');
  }

  // 校验并补全每个子任务的字段
  return subtasks.map((task, index) => ({
    id: task.id || `task_${index + 1}`,
    title: task.title || `子任务 ${index + 1}`,
    description: task.description || task.title || '',
    priority: ['high', 'medium', 'low'].includes(task.priority) ? task.priority : 'medium',
    estimatedHours: typeof task.estimatedHours === 'number' ? task.estimatedHours : 2,
    dependencies: Array.isArray(task.dependencies) ? task.dependencies : []
  }));
}

/**
 * 检查 API 配置状态
 * @returns {{ configured: boolean, model: string, baseUrl: string }}
 */
function checkConfig() {
  const configured = !!DEEPSEEK_API_KEY && DEEPSEEK_API_KEY !== 'sk-your-api-key-here';
  return {
    configured,
    model: DEEPSEEK_MODEL,
    baseUrl: DEEPSEEK_BASE_URL,
    // 不返回完整 key，只返回前后几位用于确认
    keyPreview: configured
      ? `${DEEPSEEK_API_KEY.substring(0, 5)}...${DEEPSEEK_API_KEY.substring(DEEPSEEK_API_KEY.length - 4)}`
      : null
  };
}

module.exports = { decomposeTask, checkConfig };
