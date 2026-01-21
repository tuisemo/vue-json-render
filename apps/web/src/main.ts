import { createApp } from 'vue';
import App from './App.vue';
import {
  JsonUIProvider,
  Renderer,
  ConfirmDialog,
  useData,
  useActions,
} from '@vue-json-render/vue';

const app = createApp(App);

// No additional setup needed as providers are used in App.vue

app.mount('#app');
