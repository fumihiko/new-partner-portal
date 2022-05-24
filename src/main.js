import { createApp, reactive } from "vue";
import App from "./App.vue"
import router from "./router"
import store from "./store"
import PrimeVue from 'primevue/config'
import DataTable from 'primevue/datatable'
import Chart from 'primevue/chart'
import Column from 'primevue/column'
import ColumnGroup from 'primevue/columngroup'
import Row from 'primevue/row'
import Dropdown from 'primevue/dropdown'
import Accordion from 'primevue/accordion'
import AccordionTab from 'primevue/accordiontab'
import InputText from 'primevue/inputtext'
import Textarea from 'primevue/textarea'
import ConfirmationService from 'primevue/confirmationservice'
import ToastService from 'primevue/toastservice'
import ConfirmDialog from 'primevue/confirmdialog'
import Dialog from 'primevue/dialog'
import Calendar from 'primevue/calendar'
import Button from 'primevue/button'
import Panel from 'primevue/panel'
import Timeline from 'primevue/timeline'
import Tooltip from 'primevue/tooltip'
import Checkbox from 'primevue/checkbox'
import SelectButton from 'primevue/selectbutton'
import Toast from 'primevue/toast'
import Message from 'primevue/message'
import Menu from 'primevue/menu'
import ScrollPanel from 'primevue/scrollpanel'


//import vuetify from './plugins/vuetify'

import 'primevue/resources/primevue.min.css';
import 'primeicons/primeicons.css'
import { loadFonts } from './plugins/webfontloader'
/* import the fontawesome core */
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome"
import { fas } from '@fortawesome/pro-solid-svg-icons'
library.add(fas);
import { far } from '@fortawesome/pro-regular-svg-icons'
library.add(far);

import { dom } from "@fortawesome/fontawesome-svg-core";
dom.watch();
loadFonts()

const app = createApp(App)

app.config.globalProperties.window = window
const GStore = reactive({ flashMessage: ''});
/* eslint-disable no-new */
app.use(store)
    .use(router)
    .use(PrimeVue)
    .use(ConfirmationService)
    .use(ToastService)
    .provide('GStore', GStore)
    .component("font-awesome-icon", FontAwesomeIcon, )
    .component('Dropdown', Dropdown)
    .component('Dialog', Dialog)
    .component('ConfirmDialog', ConfirmDialog)
    .component('Calendar', Calendar)
    .component('Button', Button)
    .component('Panel', Panel)
    .component('Timeline', Timeline)
    .component('DataTable', DataTable)
    .component('Column', Column)
    .component('ColumnGroup', ColumnGroup)
    .component('Row', Row)
    .component('Chart', Chart)
    .component('Menu', Menu)
    .component('Checkbox', Checkbox)
    .component('Textarea', Textarea)
    .component('SelectButton', SelectButton)
    .component('InputText', InputText)
    .component('Toast', Toast)
    .component('Message', Message)
    .component('ScrollPanel', ScrollPanel)
    .component('Accordion', Accordion)
    .component('AccordionTab', AccordionTab)
    .directive('tooltip', Tooltip)
    .mount("#app");

