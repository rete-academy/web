import Vue from 'vue'
import { library } from '@fortawesome/fontawesome-svg-core'

// please note: the Font Awesome icon class is kebab-case
// but we import and declare it here in camelCase
// so if they have <i class="fa-coffee"> in documentation
// we import it as faCoffee,
// and use in Vue Component like <fa icon="coffee"/>
import {
    faChevronDown,
    faCog,
    faCopy,
    faCommentAlt,
    faDownload,
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
    faFolder,
    faEnvelope,
    faJournalWhills,
    faGlobe,
    faHeart,
    faMinus,
    faPlayCircle,
    faSave,
    faStar,
    faSortDown,
    faSortUp,
    faTasks,
    faTimes,
    faTrashAlt,
    faUniversity,
    faUpload,
    faUser,
    faUserPlus,
    faUserMinus,
    faUserTimes,
    faWindowMinimize
} from '@fortawesome/free-solid-svg-icons'
// } from '@fortawesome/free-regular-svg-icons'
import { FontAwesomeIcon, FontAwesomeLayers } from '@fortawesome/vue-fontawesome'

library.add(
    faChevronDown,
    faCog,
    faCopy,
    faCommentAlt,
    faDownload,
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
    faFolder,
    faEnvelope,
    faJournalWhills,
    faGlobe,
    faHeart,
    faMinus,
    faPlayCircle,
    faSave,
    faSortDown,
    faSortUp,
    faTasks,
    faStar,
    faTimes,
    faTrashAlt,
    faUniversity,
    faUpload,
    faUser,
    faUserPlus,
    faUserMinus,
    faUserTimes,
    faWindowMinimize
)

Vue.component('fa', FontAwesomeIcon)
Vue.component('fa-layer', FontAwesomeLayers)
