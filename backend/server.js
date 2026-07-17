/**
 * 智能任务拆解 —— Express 后端服务
 * 接收前端请求，代理调用 DeepSeek API 进行任务拆解
 */

const express = require('express');
const cors = require('cors');
const path = require('path');

// 加载环境变量
require('dotenv').config({ path: path.join(__dirname, '.env') });

const { decomposeTask, checkConfig } = require('./services/deepseek');

const app = express();
const PORT = process.env.PORT || 3000;

// ─── 中间件 ───────────────────────────────────────────
app.use(cors());
app.use(express.json({ limit: '10kb' })); // 限制请求体大小

// 静态文件服务 —— 托管前端页面
app.use(express.static(path.join(__dirname, '..', 'decomposer')));

// ─── API 路由 ─────────────────────────────────────────

/**
 * POST /api/decompose
 * 接收用户任务描述，返回拆解后的子任务列表
 * Body: { task: "任务描述" }
 * Returns: { success: true, data: { subtasks: [...], originalTask: "..." } }
 */
app.post('/api/decompose', async (req, res) => {
  try {
    const { task } = req.body;

    // 输入校验
    if (!task || typeof task !== 'string') {
      return res.status(400).json({
        success: false,
        error: '请输入有效的任务描述'
      });
    }

    const trimmedTask = task.trim();

    if (trimmedTask.length < 2) {
      return res.status(400).json({
        success: false,
        error: '任务描述太短，请至少输入2个字符'
      });
    }

    if (trimmedTask.length > 2000) {
      return res.status(400).json({
        success: false,
        error: '任务描述过长，请限制在2000字符以内'
      });
    }

    console.log(`[请求] 收到任务拆解请求: "${trimmedTask.substring(0, 50)}${trimmedTask.length > 50 ? '...' : ''}"`);

    // 调用 DeepSeek API 拆解任务
    const subtasks = await decomposeTask(trimmedTask);

    console.log(`[成功] 拆解完成，生成 ${subtasks.length} 个子任务`);

    res.json({
      success: true,
      data: {
        originalTask: trimmedTask,
        subtasks,
        totalCount: subtasks.length,
        createdAt: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error(`[错误] ${error.message}`);

    // 根据错误类型返回不同的状态码
    let statusCode = 500;
    if (error.message.includes('API_KEY_NOT_CONFIGURED')) statusCode = 503;
    else if (error.message.includes('AUTH_ERROR')) statusCode = 401;
    else if (error.message.includes('RATE_LIMIT')) statusCode = 429;
    else if (error.message.includes('TIMEOUT')) statusCode = 504;
    else if (error.message.includes('PARSE_ERROR')) statusCode = 502;
    else if (error.message.includes('EMPTY_RESULT')) statusCode = 422;
    else if (error.message.includes('NETWORK_ERROR')) statusCode = 502;

    res.status(statusCode).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * GET /api/health
 * 健康检查 + API 配置状态
 */
app.get('/api/health', (req, res) => {
  const config = checkConfig();
  res.json({
    success: true,
    status: 'running',
    apiConfigured: config.configured,
    model: config.model,
    keyPreview: config.keyPreview
  });
});

// ─── 全局错误处理 ────────────────────────────────────
app.use((err, req, res, _next) => {
  console.error('[系统错误]', err);
  res.status(500).json({
    success: false,
    error: '服务器内部错误，请稍后重试'
  });
});

// ─── 启动服务 ─────────────────────────────────────────
app.listen(PORT, () => {
  console.log('╔══════════════════════════════════════╗');
  console.log('║   🧠 智能任务拆解服务已启动          ║');
  console.log(`║   地址: http://localhost:${PORT}         ║`);
  console.log('║   前端: 直接打开上述地址即可         ║');
  console.log('╚══════════════════════════════════════╝');

  const config = checkConfig();
  if (!config.configured) {
    console.warn('\n⚠️  [警告] DeepSeek API Key 尚未配置！');
    console.warn('   请编辑 backend/.env 文件，设置你的 DEEPSEEK_API_KEY');
    console.warn('   获取 Key: https://platform.deepseek.com/api_keys\n');
  } else {
    console.log(`✅ DeepSeek API 已配置 (模型: ${config.model}, Key: ${config.keyPreview})\n`);
  }
});
