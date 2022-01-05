import Vue from 'vue'
import VueRouter from 'vue-router';
import App from './App.vue'
import router from './router/index'
import store from './store'
import '@/permission'
import VueContext from 'vue-context';
// 載入 vue2-leaflet，依照自己需要載入組件
import {LMap, LTileLayer, LMarker, LPopup, LIcon, LLayerGroup} from "vue2-leaflet";
// 載入 css
import "leaflet/dist/leaflet.css";
import {BootstrapVue, IconsPlugin} from 'bootstrap-vue'
// Import Bootstrap an BootstrapVue CSS files (order is important)
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

import VueAxios from 'vue-axios'
import axios from 'axios'
import Element from 'element-ui'
//import element-ui的css
import 'element-ui/lib/theme-chalk/index.css'
import Icon from 'vue-awesome/components/Icon'
import 'vue-awesome/icons'
// 設定預設 icon, 使用別名
import {Icon as LeafIcon} from "leaflet";
import vuetify from "@/plugins/vuetify";
import AlertCmp from '@/components/shared/Alert.vue'
import VueApexCharts from 'vue-apexcharts'
// 啟用載入的各組件
Vue.component("l-map", LMap);
Vue.component("l-tile-layer", LTileLayer);
Vue.component("l-marker", LMarker);
Vue.component("l-popup", LPopup);
Vue.component("l-icon", LIcon);
Vue.component("l-layer-group", LLayerGroup);
Vue.component('VIconAwesome', Icon)
Vue.component('app-alert', AlertCmp)

// Make BootstrapVue available throughout your project
Vue.use(BootstrapVue)
// Optionally install the BootstrapVue icon components plugin
Vue.use(IconsPlugin)
Vue.use(Element)

Vue.use(VueAxios, axios)
Vue.use(VueApexCharts)
Vue.component('apexchart', VueApexCharts)
delete LeafIcon.Default.prototype._getIconUrl;
LeafIcon.Default.mergeOptions({
    iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
    iconUrl: require("leaflet/dist/images/marker-icon.png"),
    shadowUrl: require("leaflet/dist/images/marker-shadow.png")
});

Vue.config.productionTip = false
Vue.use(VueRouter);

// new Vue({
//   render: h => h(App),
// }).$mount('#app')
new Vue({
    el: '#app',
    vuetify,
    components: {
        VueContext,
    },
    router,
    store,
    render: h => h(App)
});