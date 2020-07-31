import Vue from 'vue';
import { library } from '@fortawesome/fontawesome-svg-core';

// please note: the Font Awesome icon class is kebab-case
// but we import and declare it here in camelCase
// so if they have <i class="fa-coffee"> in documentation
// we import it as faCoffee,
// and use in Vue Component like <fa icon="coffee"/>
import {
  faAtlas,
  faCalendar,
  faChevronDown,
  faCircle,
  faCog,
  faCommentAlt,
  faCopy,
  faDownload,
  faEnvelope,
  faExternalLinkAlt,
  faEye,
  faEyeSlash,
  faFile,
  faFileAlt,
  faFileArchive,
  faFileAudio,
  faFileCsv,
  faFileExcel,
  faFileImage,
  faFilePdf,
  faFilePowerpoint,
  faFileVideo,
  faFileWord,
  faFolder,
  faGlobe,
  faHeart,
  faJournalWhills,
  faMapMarker,
  faMinus,
  faPlayCircle,
  faSave,
  faSortDown,
  faSortUp,
  faStar,
  faTasks,
  faTimes,
  faTrashAlt,
  faUniversity,
  faUpload,
  faUser,
  faUsers,
  faUserMinus,
  faUserCheck,
  faUserPlus,
  faUserShield,
  faUserTimes,
  faWindowMinimize,
} from '@fortawesome/free-solid-svg-icons';

import {
  faFacebook,
  faTwitter,
} from '@fortawesome/free-brands-svg-icons';
// } from '@fortawesome/free-regular-svg-icons'
import {
  FontAwesomeIcon,
  FontAwesomeLayers,
} from '@fortawesome/vue-fontawesome';

library.add(
  faAtlas,
  faCalendar,
  faChevronDown,
  faCircle,
  faCog,
  faCommentAlt,
  faCopy,
  faDownload,
  faEnvelope,
  faExternalLinkAlt,
  faEye,
  faEyeSlash,
  faFacebook,
  faFile,
  faFileAlt,
  faFileArchive,
  faFileAudio,
  faFileCsv,
  faFileExcel,
  faFileImage,
  faFilePdf,
  faFilePowerpoint,
  faFileVideo,
  faFileWord,
  faFolder,
  faGlobe,
  faHeart,
  faJournalWhills,
  faMapMarker,
  faMinus,
  faPlayCircle,
  faSave,
  faSortDown,
  faSortUp,
  faStar,
  faTasks,
  faTimes,
  faTrashAlt,
  faTwitter,
  faUniversity,
  faUpload,
  faUser,
  faUsers,
  faUserCheck,
  faUserMinus,
  faUserPlus,
  faUserShield,
  faUserTimes,
  faWindowMinimize,
);

Vue.component('fa', FontAwesomeIcon);
Vue.component('fa-layer', FontAwesomeLayers);
