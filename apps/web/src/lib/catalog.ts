import { createCatalog } from '@vue-json-render/core';
import { z } from 'zod';

/**
 * Component Catalog for the web application
 * Defines the guardrails for AI-generated UI
 */
export const webCatalog = createCatalog({
  name: 'web-application',
  components: {
    // Layout Components
    GlassCard: {
      props: z.object({
        title: z.string().nullable(),
        description: z.string().nullable(),
        size: z.enum(['sm', 'md', 'lg', 'xl', 'full']).nullable(),
      }),
      hasChildren: true,
      description: 'Glassmorphic card container with aurora glow effects',
    },

    Stack: {
      props: z.object({
        direction: z.enum(['horizontal', 'vertical']).nullable(),
        gap: z.enum(['sm', 'md', 'lg', 'xl']).nullable(),
        align: z.enum(['start', 'center', 'end', 'stretch']).nullable(),
      }),
      hasChildren: true,
      description: 'Flex container for stacking elements',
    },

    Grid: {
      props: z.object({
        columns: z.number().min(1).max(6).nullable(),
        gap: z.enum(['sm', 'md', 'lg']).nullable(),
      }),
      hasChildren: true,
      description: 'Grid layout for responsive designs',
    },

    // Typography
    AuroraText: {
      props: z.object({
        content: z.string(),
        size: z.enum(['sm', 'md', 'lg', 'xl', '2xl', '3xl']).nullable(),
        weight: z.enum(['normal', 'medium', 'semibold', 'bold']).nullable(),
        animated: z.boolean().nullable(),
      }),
      description: 'Gradient text with aurora effects',
    },

    // Interactive Components
    GlassButton: {
      props: z.object({
        label: z.string(),
        variant: z.enum(['primary', 'secondary', 'danger', 'ghost']).nullable(),
        size: z.enum(['sm', 'md', 'lg']).nullable(),
        action: z.string(),
        loading: z.boolean().nullable(),
      }),
      description: 'Glassmorphic button with hover effects',
    },

    GlassInput: {
      props: z.object({
        label: z.string().nullable(),
        name: z.string(),
        placeholder: z.string().nullable(),
        type: z.enum(['text', 'email', 'password', 'number']).nullable(),
      }),
      description: 'Glassmorphic input field',
    },

    GlassTextarea: {
      props: z.object({
        label: z.string().nullable(),
        name: z.string(),
        placeholder: z.string().nullable(),
        rows: z.number().min(1).max(10).nullable(),
      }),
      description: 'Glassmorphic textarea field',
    },

    // Display Components
    Metric: {
      props: z.object({
        label: z.string(),
        valuePath: z.string(),
        format: z.enum(['number', 'currency', 'percent', 'usd']).nullable(),
        trend: z.enum(['up', 'down', 'neutral']).nullable(),
        trendValue: z.string().nullable(),
      }),
      description: 'Metric display with optional trend indicator',
    },

    ProgressBar: {
      props: z.object({
        value: z.number().min(0).max(100),
        max: z.number().min(0).default(100),
        label: z.string().nullable(),
        color: z.enum(['purple', 'blue', 'pink', 'cyan', 'green']).nullable(),
      }),
      description: 'Progress bar with aurora colors',
    },

    Badge: {
      props: z.object({
        text: z.string(),
        variant: z.enum(['default', 'success', 'warning', 'danger', 'info']).nullable(),
        glow: z.boolean().nullable(),
      }),
      description: 'Small status badge with optional glow',
    },

    // Feedback Components
    Alert: {
      props: z.object({
        type: z.enum(['info', 'success', 'warning', 'error']),
        title: z.string(),
        message: z.string().nullable(),
        dismissible: z.boolean().nullable(),
      }),
      description: 'Alert/notification banner with glass effect',
    },

    // Separator
    Divider: {
      props: z.object({
        label: z.string().nullable(),
      }),
      description: 'Visual divider with optional label',
    },
  },

  actions: {
    submit_form: { description: 'Submit the current form' },
    cancel_action: { description: 'Cancel the current action' },
    confirm_dialog: { description: 'Show a confirmation dialog' },
    refresh_data: { description: 'Refresh the displayed data' },
    navigate_to: { description: 'Navigate to a different page' },
  },
});

/**
 * Generate the prompt for AI
 */
export const catalogPrompt = `
# Web Application Component Catalog

## Available Components

### Layout Components
- **GlassCard**: { title?: string, description?: string, size?: "sm"|"md"|"lg"|"xl"|"full" } - Glassmorphic card container with aurora glow effects, hasChildren
- **Stack**: { direction?: "horizontal"|"vertical", gap?: "sm"|"md"|"lg"|"xl", align?: "start"|"center"|"end"|"stretch" } - Flex container for stacking elements, hasChildren
- **Grid**: { columns?: number (1-6), gap?: "sm"|"md"|"lg" } - Grid layout for responsive designs, hasChildren

### Typography
- **AuroraText**: { content: string, size?: "sm"|"md"|"lg"|"xl"|"2xl"|"3xl", weight?: "normal"|"medium"|"semibold"|"bold", animated?: boolean } - Gradient text with aurora effects

### Interactive Components
- **GlassButton**: { label: string, variant?: "primary"|"secondary"|"danger"|"ghost", size?: "sm"|"md"|"lg", action: string, loading?: boolean } - Glassmorphic button with hover effects
- **GlassInput**: { label?: string, name: string, placeholder?: string, type?: "text"|"email"|"password"|"number" } - Glassmorphic input field
- **GlassTextarea**: { label?: string, name: string, placeholder?: string, rows?: number (1-10) } - Glassmorphic textarea field

### Display Components
- **Metric**: { label: string, valuePath: string, format?: "number"|"currency"|"percent"|"usd", trend?: "up"|"down"|"neutral", trendValue?: string } - Metric display with optional trend indicator
- **ProgressBar**: { value: number (0-100), max?: number, label?: string, color?: "purple"|"blue"|"pink"|"cyan"|"green" } - Progress bar with aurora colors
- **Badge**: { text: string, variant?: "default"|"success"|"warning"|"danger"|"info", glow?: boolean } - Small status badge with optional glow
- **Alert**: { type: "info"|"success"|"warning"|"error", title: string, message?: string, dismissible?: boolean } - Alert/notification banner with glass effect
- **Divider**: { label?: string } - Visual divider with optional label

## Available Actions
- **submit_form**: Submit the current form
- **cancel_action**: Cancel the current action
- **confirm_dialog**: Show a confirmation dialog
- **refresh_data**: Refresh the displayed data
- **navigate_to**: Navigate to a different page

## Output Format
Output as JSONL (JSON Lines) patches:
\`\`\`
{"op":"set","path":"/root","value":"element-key"}
{"op":"add","path":"/elements/key","value":{"key":"...","type":"...","props":{...},"children":[...]}}
\`\`\`

## Design Principles
- Use GlassCard for content sections and forms
- Use Stack for vertical/horizontal layouts with consistent gaps
- Use AuroraText for headings and important text
- Use GlassButton with 'primary' variant for main actions
- Use 'secondary' or 'ghost' variants for secondary actions
- Use 'danger' variant only for destructive actions
- Use Metric for displaying key data points with optional trends
- Use ProgressBar for showing progress or completion
- Use Badge for status indicators
- Use Alert for important notifications
- All components have glassmorphic effects and aurora styling
- Include animated effects for better visual experience
`;
