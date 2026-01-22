import { createApp } from 'vue';
import App from './App.vue';
import {
  JsonUIProvider,
} from '@vue-json-render/vue';

// Note: Vue SFC components need to be imported directly from their files
import Renderer from '@vue-json-render/vue/components/Renderer.vue';
import ConfirmDialog from '@vue-json-render/vue/components/ConfirmDialog.vue';

const app = createApp(App);

// Register components globally if needed
app.component('Renderer', Renderer);
app.component('ConfirmDialog', ConfirmDialog);

app.mount('#app');
