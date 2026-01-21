# Vue JSON Render

基于 Vue 3 的生成式 UI 系统，使用 Aurora Glass 设计语言。

## 特性

- 🎨 独立美学：Aurora Glass 设计系统（极光渐变 + 玻璃态质感）
- 🛡️ Guardrail 机制：组件目录约束，Schema 严格验证
- ⚡ 流式渲染：AI 生成时实时显示 UI
- 🧩 Vue 3 特性：Composition API、TypeScript、Vite
- 🤖 模型支持：对接阿里云 Qwen3-max

## 快速开始

```bash
# 安装依赖
pnpm install

# 构建包
pnpm build

# 启动开发服务器
pnpm dev
```

访问 http://localhost:3000

## 项目结构

```
packages/
├── core/                    # 核心逻辑
├── design-system/           # Aurora Glass 设计系统
└── vue/                    # Vue 3 集成

apps/
└── web/                    # Web 应用示例
```

## 环境配置

复制 `.env.example` 为 `.env.local`：

```env
AI_MODEL=qwen3-max
QWEN_API_KEY=your-api-key-here
QWEN_BASE_URL=https://dashscope.aliyuncs.com/compatible-mode/v1
```

## API

详见各包的 `src/` 目录。

## License

MIT
