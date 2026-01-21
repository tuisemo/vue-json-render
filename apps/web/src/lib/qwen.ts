/**
 * 阿里云Qwen API适配器
 * 支持流式响应
 */

interface QwenMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface QwenChatCompletionParams {
  messages: QwenMessage[];
  model: string;
  stream?: boolean;
  temperature?: number;
  max_tokens?: number;
  top_p?: number;
}

interface QwenStreamChunk {
  id: string;
  choices: Array<{
    index: number;
    delta: {
      role?: string;
      content?: string;
    };
    finish_reason: string | null;
  }>;
}

interface QwenChatCompletion {
  id: string;
  model: string;
  choices: Array<{
    index: number;
    message: {
      role: string;
      content: string;
    };
    finish_reason: string;
  }>;
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

export class QwenClient {
  private apiKey: string;
  private baseURL: string;

  constructor(apiKey: string, baseURL: string = 'https://dashscope.aliyuncs.com/compatible-mode/v1') {
    this.apiKey = apiKey;
    this.baseURL = baseURL;
  }

  /**
   * 聊天补全（非流式）
   */
  async chatCompletion(params: QwenChatCompletionParams): Promise<QwenChatCompletion> {
    const response = await fetch(`${this.baseURL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify({
        model: params.model,
        messages: params.messages,
        temperature: params.temperature,
        max_tokens: params.max_tokens,
        top_p: params.top_p,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Qwen API Error: ${response.status} - ${error}`);
    }

    return response.json();
  }

  /**
   * 流式聊天补全
   */
  async *chatCompletionStream(
    params: QwenChatCompletionParams,
  ): AsyncGenerator<string, void, unknown> {
    const response = await fetch(`${this.baseURL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify({
        model: params.model,
        messages: params.messages,
        stream: true,
        temperature: params.temperature,
        max_tokens: params.max_tokens,
        top_p: params.top_p,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Qwen API Error: ${response.status} - ${error}`);
    }

    const reader = response.body?.getReader();
    if (!reader) {
      throw new Error('No response body');
    }

    const decoder = new TextDecoder();
    let buffer = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop() || '';

      for (const line of lines) {
        if (line.trim() === '') continue;
        if (line.startsWith(':')) continue; // SSE comment

        if (line.startsWith('data: ')) {
          const data = line.slice(6);

          if (data === '[DONE]') {
            return;
          }

          try {
            const chunk = JSON.parse(data) as QwenStreamChunk;
            const content = chunk.choices[0]?.delta?.content;
            if (content) {
              yield content;
            }
          } catch (e) {
            console.warn('Failed to parse SSE chunk:', e);
          }
        }
      }
    }
  }
}

/**
 * 创建Qwen客户端实例
 */
export function createQwenClient(): QwenClient {
  const apiKey = process.env.QWEN_API_KEY;
  const baseURL = process.env.QWEN_BASE_URL || 'https://dashscope.aliyuncs.com/compatible-mode/v1';

  if (!apiKey) {
    throw new Error('QWEN_API_KEY is not set');
  }

  return new QwenClient(apiKey, baseURL);
}

/**
 * 流式文本生成
 */
export async function streamText(params: {
  model: string;
  system: string;
  prompt: string;
  temperature?: number;
  maxTokens?: number;
}): Promise<{
  toTextStreamResponse: () => Response;
}> {
  const client = createQwenClient();

  const messages: QwenMessage[] = [
    { role: 'system', content: params.system },
    { role: 'user', content: params.prompt },
  ];

  const stream = client.chatCompletionStream({
    model: params.model,
    messages,
    temperature: params.temperature,
    max_tokens: params.maxTokens,
  });

  // 创建可读流
  const encoder = new TextEncoder();

  const readableStream = new ReadableStream({
    async start(controller) {
      try {
        for await (const chunk of stream) {
          controller.enqueue(encoder.encode(chunk));
        }
        controller.close();
      } catch (error) {
        controller.error(error);
      }
    },
  });

  const toTextStreamResponse = (): Response => {
    return new Response(readableStream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'no-cache',
        'X-Accel-Buffering': 'no',
      },
    });
  };

  return { toTextStreamResponse };
}
