import { Linking } from 'react-native';

import PayUTC from '../../services/PayUTC';
import Shortcut from './Shortcut';
import PayUTCIcon from '../../img/payutc.png';
import { PAYUTC_LINK } from '../../../config';
import { _ } from '../../utils/i18n';

export default class PayUTCShortcut extends Shortcut {
	constructor(props) {
		super(props);

		this.state = {
			credit: null,
		};
	}

	componentWillMount() {
		PayUTC.getWalletDetails().then(([{ credit }]) => {
			this.setState({
				credit,
			});
		});
	}

	/* eslint-disable-next-line class-methods-use-this */
	onPress() {
		Linking.openURL(PAYUTC_LINK);
	}

	/* eslint-disable-next-line class-methods-use-this */
	getIconSource() {
		return PayUTCIcon;
	}

	getTitleText() {
		const { credit } = this.state;

		if (credit) {
			return `${credit / 100} €`;
		}

		return _('loading');
	}
}
