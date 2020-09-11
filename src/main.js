import Vue from 'vue'
import App from './App.vue'

Vue.config.productionTip = false

import moment from 'moment'

Vue.filter('formatDate', function(value) {
	    if (value) {
		            return moment(String(value)).format('LL');
		        }
})


new Vue({
  render: h => h(App),
}).$mount('#app')
