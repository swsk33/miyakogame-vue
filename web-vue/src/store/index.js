import {
	createStore
} from 'vuex';

import audio from './audio.js';
import image from './image.js';
import loading from './loading.js';
import pudding from './pudding.js';
import miyako from './miyako.js';
import weapon from './weapon.js';
import prop from './prop.js';
import userdata from './userdata.js';
import pagecontrol from './pagecontrol.js';
import gamingcontrol from './gamingcontrol.js';

export default createStore({
	state: {},
	mutations: {},
	actions: {},
	modules: {
		audio,
		image,
		loading,
		pudding,
		weapon,
		prop,
		miyako,
		userdata,
		pagecontrol,
		gamingcontrol
	},
});