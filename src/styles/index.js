// General styles
import layout from './layout';
import text from './text';
import img from './image';

// Component styles
import bigCheckBox from './bigCheckBox';
import bigButton from './bigButton';
import tabBar from './tabBar';
import assosListTabBar from './assosListTabBar';
import assoTabBar from './assoTabBar';
import article from './article';
import mainLayout from './mainLayout';
import comment from './comment';
import navigation from './navigation';
import userProfile from './userProfile';
import associations from './associations';
import scrollable from './scrollable';
import shortcut from './shortcut';

export default {
	// General styles
	...layout,
	text,
	img,

	// Component styles
	assosListTabBar,
	tabBar,
	bigCheckBox,
	bigButton,
	article,
	assoTabBar,
	mainLayout,
	comment,
	navigation,
	userProfile,
	associations,
	scrollable,
	shortcut,

	// Getter function
	get(...paths) {
		return paths.map(path =>
			path.split('.').reduce((acc, step) => {
				if (acc.hasOwnProperty(step)) return acc[step];
				throw new Error(`'${path}' introuvable dans styles, arrêt à ${step}`);
			}, this)
		);
	},
};
