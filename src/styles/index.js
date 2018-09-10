// General styles
import layout from './layout';
import text from './text';
import img from './image';

// Component styles
import { bigCheckBox } from './bigCheckBox';
import { bigButton } from './bigButton';
import { tabBar } from './tabBar';
import { assosListTabBar } from './assosListTabBar';
import { assoTabBar } from './assoTabBar';
import { article } from './article';
import { mainLayout } from './mainLayout';
import { comment } from './comment';

const styles = {
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

	// Getter function
	get: function(...paths) {
		return paths.map(path => path.split('.').reduce((acc, step) => {
				if (acc.hasOwnProperty(step))
					return acc[step];
				throw new Error(`'${path}' introuvable dans styles, arrêt à ${step}`);
			}, this)
		)
	}
};

export default styles;
