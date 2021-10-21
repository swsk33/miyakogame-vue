import {
	createApp
} from 'vue';
import MiyakoGame from './MiyakoGame.vue';
import store from './store';

createApp(MiyakoGame).use(store).mount('#app');