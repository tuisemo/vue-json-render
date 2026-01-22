---
name: verify-frontend
description: 启动开发服务器并使用 Chrome DevTools 检查页面错误，用于验证代码更改。
---

# Frontend Verification Skill

当你在修改了前端代码（如 React, Vue 组件）后，**必须**使用此技能来验证页面是否正常运行。

## 步骤流程

1.  **启动开发服务器**
    *   在后台运行 `pnpm run dev`。
    *   等待并检查终端输出，确保服务器已成功启动（例如出现 "Local: http://localhost:5173"）。

2.  **捕获浏览器错误**
    *   使用 `chrome-devtools` 工具导航到开发服务器地址 (如 `http://localhost:5173`)。
    *   检查 `Console` 面板中的错误日志 (Errors)。
    *   检查 `Network` 面板中是否有失败的请求 (404, 500 等)。

3.  **反馈与修复**
    *   如果发现错误，提取错误堆栈信息。
    *   停止开发服务器（防止端口占用）。
    *   **自动开始修复**代码中的问题，或向用户报告详细的错误原因。

## 关键指令
- 即使看起来代码很简单，也要执行此验证。
- 重点关注 JavaScript 运行时错误和资源加载错误。
