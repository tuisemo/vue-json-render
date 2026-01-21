import {
  ref,
  type Ref,
  type ComputedRef,
} from 'vue';
import type { UITree, JsonPatch } from '@vue-json-render/core';

/**
 * Use UI Stream options
 */
export interface UseUIStreamOptions {
  /** API endpoint */
  api: string;
  /** Called when streaming completes */
  onComplete?: (tree: Readonly<UITree>) => void;
  /** Called when an error occurs */
  onError?: (error: Error) => void;
}

/**
 * Use UI Stream return value
 */
export interface UseUIStreamReturn {
  /** The current UI tree */
  tree: Ref<Readonly<UITree> | null>;
  /** Whether currently streaming */
  isStreaming: Ref<boolean>;
  /** Current error */
  error: Ref<Error | null>;
  /** Send a prompt to generate UI */
  send: (prompt: string, context?: Record<string, unknown>) => Promise<void>;
  /** Clear current tree and state */
  clear: () => void;
}

/**
 * Apply a JSON patch to a UI tree
 */
function applyPatch(tree: UITree, patch: JsonPatch): UITree {
  const { op, path, value } = patch;

  switch (op) {
    case 'set':
      // Set root element
      if (path === '/root' && typeof value === 'string') {
        return {
          ...tree,
          root: value,
        };
      }
      return tree;

    case 'add':
      // Add element
      if (path.startsWith('/elements/')) {
        const key = path.slice('/elements/'.length);
        if (typeof value === 'object' && value !== null) {
          return {
            ...tree,
            elements: {
              ...tree.elements,
              [key]: value as any,
            },
          };
        }
      }
      return tree;

    case 'remove':
      // Remove element
      if (path.startsWith('/elements/')) {
        const key = path.slice('/elements/'.length);
        const newElements = { ...tree.elements };
        delete newElements[key];
        return {
          ...tree,
          elements: newElements,
        };
      }
      return tree;

    case 'replace':
      // Replace root or element
      if (path === '/root' && typeof value === 'string') {
        return {
          ...tree,
          root: value,
        };
      }
      if (path.startsWith('/elements/')) {
        const key = path.slice('/elements/'.length);
        if (typeof value === 'object' && value !== null) {
          return {
            ...tree,
            elements: {
              ...tree.elements,
              [key]: value as any,
            },
          };
        }
      }
      return tree;

    default:
      console.warn(`Unknown patch operation: ${op}`);
      return tree;
  }
}

/**
 * Parse a patch line from the stream
 */
function parsePatchLine(line: string): JsonPatch | null {
  try {
    const patch = JSON.parse(line) as JsonPatch;
    if (patch.op && patch.path) {
      return patch;
    }
  } catch (e) {
    console.warn('Failed to parse patch line:', line, e);
  }
  return null;
}

/**
 * Use UI Stream - Composable for streaming AI-generated UI
 */
export function useUIStream(
  options: UseUIStreamOptions,
): UseUIStreamReturn {
  const tree = ref<Readonly<UITree> | null>(null);
  const isStreaming = ref(false);
  const error = ref<Error | null>(null);
  let abortController: AbortController | null = null;

  const clear = (): void => {
    abortController?.abort();
    tree.value = null;
    error.value = null;
    isStreaming.value = false;
  };

  const send = async (
    prompt: string,
    context?: Record<string, unknown>,
  ): Promise<void> => {
    abortController?.abort();
    abortController = new AbortController();

    isStreaming.value = true;
    error.value = null;

    let currentTree: UITree = { root: '', elements: {} };
    tree.value = currentTree;

    try {
      const response = await fetch(options.api, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt,
          context,
          currentTree,
        }),
        signal: abortController.signal,
      });

      if (!response.ok) {
        const text = await response.text();
        throw new Error(`HTTP ${response.status}: ${text}`);
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
          if (!line.trim()) continue;

          const patch = parsePatchLine(line);
          if (patch) {
            currentTree = applyPatch(currentTree, patch);
            tree.value = Object.freeze({ ...currentTree });
          }
        }
      }

      options.onComplete?.(tree.value as Readonly<UITree>);
    } catch (err) {
      if ((err as Error).name === 'AbortError') {
        return;
      }
      error.value = err instanceof Error ? err : new Error(String(err));
      options.onError?.(error.value);
    } finally {
      isStreaming.value = false;
    }
  };

  return { tree, isStreaming, error, send, clear };
}
