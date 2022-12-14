import Vue from 'vue';
import mewComponents from '@myetherwallet/mew-components';
import whiteSheet from '@/components/white-sheet/WhiteSheet.vue';
import QrCode from '@/core/components/AppQrCode.vue';
import MewExpandPanel from '@/components/MewExpandPanel/MewExpandPanel.vue';
import MewSelect from '@/components/MewSelect/MewSelect.vue';
import MewIconButton from '@/components/MewIconButton/MewIconButton.vue';
import MewInput from '@/components/MewInput/MewInput.vue';
import MewSearch from '@/components/MewSearch/MewSearch.vue';
import MewAlert from '@/components/MewAlert/MewAlert.vue';
import MewPopup from '@/components/MewPopup/MewPopup.vue';
import MewButton from '@/components/MewButton/MewButton.vue';

Object.keys(mewComponents).forEach(name => {
  Vue.component(name, mewComponents[name]);
});
Vue.component('Mew6WhiteSheet', whiteSheet);
Vue.component('QrCode', QrCode);
Vue.component('MewExpandPanel', MewExpandPanel);
Vue.component('MewSelect', MewSelect);
Vue.component('MewIconButton', MewIconButton);
Vue.component('MewInput', MewInput);
Vue.component('MewSearch', MewSearch);
Vue.component('MewAlert', MewAlert);
Vue.component('MewPopup', MewPopup);
Vue.component('MewButton', MewButton);
