import {
	createApp
} from 'vue';
import MiyakoGame from './MiyakoGame.vue';
import router from './router';
import store from './store';

createApp(MiyakoGame).use(store).use(router).mount('#app');