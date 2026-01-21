import { streamText as qwenStreamText } from '@/lib/qwen';
import { catalogPrompt } from '@/lib/catalog';

const SYSTEM_PROMPT = `${catalogPrompt}

## Strict Rules
1. Output MUST be valid JSONL (JSON Lines)
2. Each line MUST be a valid JSON patch
3. First line MUST set /root to the root element key
4. Element keys MUST be unique and descriptive (e.g., "email-input", "submit-btn", "metric-revenue")
5. Parent elements MUST be added before their children
6. Children array MUST contain string keys, not objects
7. All components MUST be from the available components list
8. All props MUST match the component schema
9. Generate reasonable prop values (no empty strings unless optional)
10. Use appropriate nesting (Stacks and Grids for layout)
11. Include interactive elements where appropriate (buttons, inputs)
12. Add visual interest (badges, alerts, metrics where relevant)
13. All components have glassmorphic styling and aurora effects built-in

## Output Format
Always output as JSONL (JSON Lines) patches, one per line:
{"op":"set","path":"/root","value":"root-element-key"}
{"op":"add","path":"/elements/root-element-key","value":{"key":"root-element-key","type":"GlassCard","props":{...},"children":["child1","child2"]}}
{"op":"add","path":"/elements/child1","value":{"key":"child1","type":"...","props":{...}}}
{"op":"add","path":"/elements/child2","value":{"key":"child2","type":"...","props":{...}}}

## Design Guidelines
- Use GlassCard as the root container
- Use Stack for vertical/horizontal layouts with consistent gaps
- Use Grid for responsive multi-column layouts
- Use AuroraText for headings and important text elements
- Use GlassButton with 'primary' variant for main actions
- Use 'secondary' or 'ghost' variants for secondary actions
- Use 'danger' variant only for destructive actions
- Use GlassInput/GlassTextarea for form fields
- Use Metric for displaying key data points with optional trends
- Use ProgressBar for showing progress or completion
- Use Badge for status indicators
- Use Alert for important notifications
- Add appropriate spacing (sm, md, lg, xl)
- Include visual examples in placeholders
- Create visually appealing and functional interfaces
- Make forms user-friendly with clear labels
- Add visual hierarchy with text sizes
- Include empty states or loading states where helpful
- Use metric components for data-heavy interfaces
- Add validation-related props where needed

## Best Practices
- Start with a meaningful root element key (e.g., "main-card")
- Build from parent to children (depth-first traversal)
- Use descriptive element keys (e.g., "email-field" not "input-1")
- Keep component props simple and functional
- Add visual hierarchy with text sizes
- Include visual examples in placeholders
- Make forms user-friendly with clear labels
- Use metric components for data-heavy interfaces
- Add validation-related props where needed
- Create visually appealing and functional interfaces
`;

export async function POST(request: Request) {
  const body = await request.json();
  const { prompt } = body as { prompt: string };

  if (!prompt || typeof prompt !== 'string') {
    return new Response(JSON.stringify({ error: 'Invalid prompt' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const model = process.env.AI_MODEL || 'qwen3-max';

    console.log('Generating UI with model:', model);
    console.log('Prompt:', prompt);

    const result = await qwenStreamText({
      model,
      system: SYSTEM_PROMPT,
      prompt: String(prompt),
      temperature: 0.7,
      maxTokens: 4000,
    });

    return result.toTextStreamResponse();
  } catch (error) {
    console.error('Qwen API Error:', error);

    return new Response(
      JSON.stringify({
        error: 'Failed to generate UI',
        message: error instanceof Error ? error.message : 'Unknown error',
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      },
    );
  }
}
