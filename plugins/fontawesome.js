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
    faStar,
    faSortDown,
    faSortUp,
    faTasks,
    faTimes,
    faTrashAlt,
    faUniversity,
    faUserPlus,
    faUserMinus,
    faUserTimes
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

library.add(
    faCog,
    faExternalLinkAlt,
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
    faSortDown,
    faSortUp,
    faTasks,
    faStar,
    faTimes,
    faTrashAlt,
    faUniversity,
    faUserPlus,
    faUserMinus,
    faUserTimes
)

Vue.component('fa', FontAwesomeIcon)
