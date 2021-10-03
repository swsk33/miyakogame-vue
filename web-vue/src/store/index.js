import {
	createStore
} from 'vuex';

import audio from './audio.js';
import image from './image.js';
import loading from './loading.js';
import gamingcontrol from './gamingcontrol.js';

export default createStore({
	state: {},
	mutations: {},
	actions: {},
	modules: {
		audio,
		image,
		loading,
		gamingcontrol
	},
});