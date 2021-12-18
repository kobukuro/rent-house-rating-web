import Vue from 'vue';
import Vuetify from 'vuetify/lib/framework';
import "vuetify/dist/vuetify.min.css"; // Add this line
import 'material-design-icons-iconfont/dist/material-design-icons.css'

Vue.use(Vuetify);
const opts = {
    theme: {
        dark: false
    },
    options: {
        customProperties: true
    },
    icons: {
        iconfont: "mdi"
    }
};
export default new Vuetify(opts);
