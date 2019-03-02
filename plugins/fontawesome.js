import Vue from 'vue'
import { library } from '@fortawesome/fontawesome-svg-core'

// please note: the Font Awesome icon class is kebab-case
// but we import and declare it here in camelCase
// so if they have <i class="fa-coffee"> in documentation
// we import it as faCoffee,
// and use in Vue Component like <fa icon="coffee"/>
import {
    faCog,
    faExternalLinkAlt,
    faEye,
    faEyeSlash,
    faFile,
    faFileAlt,
    faFileCsv,
    faFileAudio,
    faFileArchive,
    faFileImage,
    faFilePdf,
    faFileExcel,
    faFileWord,
    faFilePowerpoint,
    faFileVideo,
    faEnvelope,
    faJournalWhills,
    faGlobe,
    faPlayCircle,
    faStar,
    faSortDown,
    faSortUp,
    faTasks,
    faTimes,
    faTrashAlt,
    faUniversity,
    faUser,
    faUserPlus,
    faUserMinus,
    faUserTimes
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon, FontAwesomeLayers } from '@fortawesome/vue-fontawesome'

library.add(
    faCog,
    faExternalLinkAlt,
    faEye,
    faEyeSlash,
    faFile,
    faFileAlt,
    faFileCsv,
    faFileAudio,
    faFileArchive,
    faFileImage,
    faFilePdf,
    faFileExcel,
    faFileWord,
    faFilePowerpoint,
    faFileVideo,
    faEnvelope,
    faJournalWhills,
    faGlobe,
    faPlayCircle,
    faSortDown,
    faSortUp,
    faTasks,
    faStar,
    faTimes,
    faTrashAlt,
    faUniversity,
    faUser,
    faUserPlus,
    faUserMinus,
    faUserTimes
)

Vue.component('fa', FontAwesomeIcon)
Vue.component('fa-layer', FontAwesomeLayers)
