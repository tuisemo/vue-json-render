<template>
  <div class="app-container">
    <!-- Particle Background -->
    <div class="particles-bg" />

    <!-- Main Content -->
    <div class="app-content">
      <!-- Header -->
      <header class="header">
        <AuroraText size="2xl" weight="bold">
          Vue JSON Render
        </AuroraText>
        <p class="header__subtitle">
          Aurora Glass Design System
        </p>
      </header>

      <!-- Input Section -->
      <GlassCard class="input-section" size="lg">
        <form class="input-form" @submit="handleSubmit">
          <div class="input-form__field">
            <label class="input-form__label">
              Describe your UI
            </label>
            <input
              v-model="prompt"
              type="text"
              class="glass-input-field"
              placeholder="e.g., Create a login form with email and password"
              :disabled="isStreaming"
              @keydown.enter.prevent="handleSubmit"
            />
          </div>

          <div class="input-form__actions">
            <div class="input-form__examples">
              <span class="input-form__examples-label">
                Try:
              </span>
              <button
                v-for="example in examples"
                :key="example"
                type="button"
                class="example-button"
                @click="setPrompt(example)"
              >
                {{ example }}
              </button>
            </div>

            <div class="input-form__buttons">
              <GlassButton
                type="submit"
                :loading="isStreaming"
                :disabled="!prompt.trim() || isStreaming"
              >
                {{ isStreaming ? 'Generating...' : 'Generate' }}
              </GlassButton>

              <GlassButton
                v-if="tree"
                variant="secondary"
                @click="handleClear"
              >
                Clear
              </GlassButton>
            </div>
          </div>
        </form>
      </GlassCard>

      <!-- Error Display -->
      <div v-if="error" class="error-banner">
        <div class="error-content">
          <span class="error-title">Error</span>
          <span class="error-message">{{ error.message }}</span>
        </div>
      </div>

      <!-- Streaming Indicator -->
      <Transition name="fade">
        <div v-if="isStreaming" class="streaming-indicator">
          <div class="streaming-bar" />
          <span class="streaming-text">
            AI is generating your interface...
          </span>
        </div>
      </Transition>

      <!-- Rendered UI -->
      <Transition name="slide-up" mode="out-in">
        <GlassCard
          v-if="tree && tree.root"
          key="rendered-ui"
          class="output-section"
          size="full"
        >
          <div class="output-section__header">
            <AuroraText size="lg" weight="semibold">
              Generated Interface
            </AuroraText>
            <button
              v-if="tree"
              class="view-json-button"
              @click="showJson = !showJson"
            >
              {{ showJson ? 'Hide JSON' : 'View JSON' }}
            </button>
          </div>

          <div class="output-section__content">
            <Renderer
              v-if="!showJson"
              :tree="tree"
              :registry="componentRegistry"
              :loading="isStreaming"
            />
            <pre v-else class="json-viewer">
              {{ JSON.stringify(tree, null, 2) }}
            </pre>
          </div>
        </GlassCard>
      </Transition>

      <!-- Empty State -->
      <GlassCard
        v-if="!tree && !isStreaming"
        class="empty-state"
        size="lg"
      >
        <div class="empty-state__content">
          <div class="empty-state__icon">
            ✨
          </div>
          <AuroraText size="xl" weight="semibold">
            Ready to Generate
          </AuroraText>
          <p class="empty-state__text">
            Enter a description above to generate a beautiful,
            glassmorphic interface with aurora effects.
          </p>
        </div>
      </GlassCard>
    </div>

    <!-- Confirm Dialog -->
    <ConfirmDialog />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import {
  JsonUIProvider,
  Renderer,
  ConfirmDialog,
  useUIStream,
  useData,
  useActions,
} from '@vue-json-render/vue';
import {
  AuroraText,
  GlassCard,
  GlassButton,
} from '@vue-json-render/design-system';
import { componentRegistry } from '@/components/registry';

// State
const prompt = ref('');
const showJson = ref(false);
const examples = [
  'Create a login form',
  'Build a signup page',
  'Create a contact form',
  'Generate a metrics dashboard',
];

// UI Stream
const { tree, isStreaming, error, send, clear } = useUIStream({
  api: '/api/generate',
  onComplete: (tree) => {
    console.log('Generation complete:', tree);
  },
  onError: (error) => {
    console.error('Generation error:', error);
  },
});

// Data
const initialData = {
  form: {
    email: '',
    password: '',
    name: '',
    message: '',
  },
  metrics: {
    revenue: 125000,
    growth: 15,
    users: 1234,
  },
};

const { data } = useData();

// Methods
const setPrompt = (text: string): void => {
  prompt.value = text;
};

const handleSubmit = async (e: Event): Promise<void> => {
  e.preventDefault();
  if (!prompt.value.trim() || isStreaming.value) return;

  await send(prompt.value, {
    dataModel: data,
  });
};

const handleClear = (): void => {
  clear();
  prompt.value = '';
  showJson.value = false;
};

// Initialize
onMounted(() => {
  console.log('Vue JSON Render App Mounted');
});
</script>

<style scoped>
.app-container {
  position: relative;
  min-height: 100vh;
  background: #0a0e27;
}

.particles-bg {
  position: fixed;
  inset: 0;
  background:
    radial-gradient(at 40% 30%, #a855f7 0px, transparent 50%),
    radial-gradient(at 80% 0%, #3b82f6 0px, transparent 50%),
    radial-gradient(at 0% 50%, #ec4899 0px, transparent 50%),
    radial-gradient(at 80% 50%, #06b6d4 0px, transparent 50%),
    #0a0e27;
  z-index: -1;
}

.app-content {
  position: relative;
  max-width: 1024px;
  margin: 0 auto;
  padding: 48px 24px;
  display: flex;
  flex-direction: column;
  gap: 32px;
}

/* Header */
.header {
  text-align: center;
  margin-bottom: 16px;
}

.header__subtitle {
  margin-top: 8px;
  color: rgba(255, 255, 255, 0.6);
  font-size: 1rem;
}

/* Input Section */
.input-section {
  animation: enter 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}

.input-form {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.input-form__field {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.input-form__label {
  font-size: 0.875rem;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.8);
}

.glass-input-field {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 14px 16px;
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.glass-input-field:focus {
  outline: none;
  border-color: #a855f7;
  background: rgba(255, 255, 255, 0.08);
  box-shadow: 0 0 0 4px rgba(168, 85, 247, 0.1),
    0 0 20px rgba(168, 85, 247, 0.2);
}

.glass-input-field::placeholder {
  color: rgba(255, 255, 255, 0.4);
}

.glass-input-field:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.input-form__actions {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.input-form__examples {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  align-items: center;
}

.input-form__examples-label {
  font-size: 0.875rem;
  color: rgba(255, 255, 255, 0.5);
}

.example-button {
  padding: 6px 12px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 8px;
  font-size: 0.875rem;
  color: rgba(255, 255, 255, 0.7);
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.example-button:hover {
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(168, 85, 247, 0.3);
  color: rgba(255, 255, 255, 0.9);
}

.input-form__buttons {
  display: flex;
  gap: 12px;
}

/* Error Banner */
.error-banner {
  animation: shake 0.5s cubic-bezier(0.36, 0.07, 0.19, 0.97);
}

.error-content {
  padding: 16px 20px;
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.3);
  border-radius: 12px;
  backdrop-filter: blur(12px);
}

.error-title {
  display: block;
  font-size: 0.875rem;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.95);
  margin-bottom: 4px;
}

.error-message {
  display: block;
  font-size: 0.875rem;
  color: rgba(255, 255, 255, 0.7);
  line-height: 1.5;
}

/* Streaming Indicator */
.streaming-indicator {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(168, 85, 247, 0.2);
  border-radius: 12px;
  backdrop-filter: blur(12px);
}

.streaming-bar {
  height: 3px;
  width: 60px;
  background: linear-gradient(135deg, #a855f7 0%, #3b82f6 50%, #ec4899 100%);
  background-size: 200% 100%;
  border-radius: 2px;
  animation: streaming 1.5s linear infinite;
}

.streaming-text {
  font-size: 0.875rem;
  color: rgba(255, 255, 255, 0.7);
}

/* Output Section */
.output-section {
  animation: enter 0.6s cubic-bezier(0.4, 0, 0.2, 1) 0.1s both;
}

.output-section__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24px;
}

.view-json-button {
  padding: 6px 12px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  font-size: 0.875rem;
  color: rgba(255, 255, 255, 0.7);
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.view-json-button:hover {
  background: rgba(255, 255, 255, 0.1);
  color: rgba(255, 255, 255, 0.9);
}

.output-section__content {
  min-height: 300px;
}

.json-viewer {
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 20px;
  overflow: auto;
  font-size: 0.875rem;
  color: rgba(255, 255, 255, 0.8);
  line-height: 1.6;
}

/* Empty State */
.empty-state {
  animation: enter 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}

.empty-state__content {
  text-align: center;
  padding: 48px 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}

.empty-state__icon {
  font-size: 3rem;
  animation: float 6s ease-in-out infinite;
}

.empty-state__text {
  color: rgba(255, 255, 255, 0.6);
  font-size: 1rem;
  line-height: 1.6;
  max-width: 480px;
}

/* Animations */
@keyframes enter {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes streaming {
  0% {
    background-position: 100% 0;
  }
  100% {
    background-position: -100% 0;
  }
}

@keyframes float {
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-10px);
  }
}

@keyframes shake {
  0%, 100% {
    transform: translateX(0);
  }
  10%, 30%, 50%, 70%, 90% {
    transform: translateX(-4px);
  }
  20%, 40%, 60%, 80% {
    transform: translateX(4px);
  }
}

/* Transitions */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.slide-up-enter-from {
  opacity: 0;
  transform: translateY(20px);
}

.slide-up-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}

/* Responsive */
@media (max-width: 768px) {
  .app-content {
    padding: 32px 16px;
  }

  .input-form__actions {
    flex-direction: column;
  }

  .input-form__buttons {
    flex-direction: column;
  }
}
</style>

<style>
@import '@vue-json-render/design-system/style.css';

/* Global styles */
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
    sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  background: #0a0e27;
  color: rgba(255, 255, 255, 0.95);
}

#app {
  min-height: 100vh;
}
</style>
