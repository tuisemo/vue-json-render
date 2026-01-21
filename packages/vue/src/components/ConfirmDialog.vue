<template>
  <Teleport to="body">
    <Transition name="modal">
      <div
        v-if="pendingConfirmation"
        class="confirm-dialog-overlay"
        @click="handleCancel"
      >
        <div class="confirm-dialog" @click.stop>
          <h3 class="confirm-dialog__title">
            {{ pendingConfirmation.action.confirm?.title }}
          </h3>
          <p class="confirm-dialog__message">
            {{ interpolateMessage(pendingConfirmation.action.confirm?.message || '') }}
          </p>
          <div class="confirm-dialog__actions">
            <GlassButton
              variant="secondary"
              size="md"
              @click="handleCancel"
            >
              {{ pendingConfirmation.action.confirm?.cancelLabel || 'Cancel' }}
            </GlassButton>
            <GlassButton
              :variant="isDanger ? 'danger' : 'primary'"
              size="md"
              @click="handleConfirm"
            >
              {{ pendingConfirmation.action.confirm?.confirmLabel || 'Confirm' }}
            </GlassButton>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { GlassButton } from '@vue-json-render/design-system';
import { useActions } from '../composables/useActions';
import { interpolateString } from '@vue-json-render/core';

const { pendingConfirmation, confirm, cancel } = useActions();

const isDanger = computed(() => {
  return pendingConfirmation.value?.action.confirm?.variant === 'danger';
});

const interpolateMessage = (message: string): string => {
  if (!pendingConfirmation.value) return message;
  return interpolateString(message, pendingConfirmation.value.action.params || {});
};

const handleConfirm = (): void => {
  confirm();
};

const handleCancel = (): void => {
  cancel();
};
</script>

<style scoped>
.confirm-dialog-overlay {
  position: fixed;
  inset: 0;
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(10, 14, 39, 0.8);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
}

.confirm-dialog {
  position: relative;
  background: linear-gradient(135deg, rgba(26, 34, 69, 0.95) 0%, rgba(18, 24, 53, 0.95) 100%);
  backdrop-filter: blur(20px) saturate(180%);
  -webkit-backdrop-filter: blur(20px) saturate(180%);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  padding: 32px;
  max-width: 480px;
  width: 90%;
  box-shadow:
    0 20px 60px rgba(0, 0, 0, 0.5),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
}

.confirm-dialog::before {
  content: '';
  position: absolute;
  inset: -1px;
  background: linear-gradient(135deg, #a855f7 0%, #3b82f6 50%, #ec4899 100%);
  border-radius: 17px;
  z-index: -1;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.confirm-dialog:hover::before {
  opacity: 0.3;
}

.confirm-dialog__title {
  margin: 0 0 12px 0;
  font-size: 1.25rem;
  font-weight: 600;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(255, 255, 255, 0.8) 100%);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}

.confirm-dialog__message {
  margin: 0 0 24px 0;
  font-size: 1rem;
  line-height: 1.6;
  color: rgba(255, 255, 255, 0.8);
}

.confirm-dialog__actions {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
}

/* Modal transitions */
.modal-enter-active,
.modal-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-from .confirm-dialog,
.modal-leave-to .confirm-dialog {
  transform: scale(0.95) translateY(10px);
}

.modal-enter-to .confirm-dialog,
.modal-leave-from .confirm-dialog {
  transform: scale(1) translateY(0);
}
</style>
