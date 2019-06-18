import React from 'react';
import { View } from 'react-native';

import HeaderView from '../../components/HeaderView';
import BigCheckBox from '../../components/BigCheckBox';
import BigButton from '../../components/BigButton';
import styles from '../../styles';
import { _, Welcome as t } from '../../utils/i18n';

export default class SetPreferencesScreen extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			checked: {
				utcNews: true,
				assoLife: true,
				utcMember: false,
			},
		};

		this.toggleCheck = this.toggleCheck.bind(this);
	}

	toggleCheck(key, force = null) {
		return this.setState(prevState => ({
			...prevState,
			checked: {
				...prevState.checked,
				[key]: force == null ? !prevState.checked[key] : force,
			},
		}));
	}

	validate() {
		const { checked } = this.state;
		const { navigation } = this.props;

		if (checked.utcMember) {
			navigation.navigate('Connection');
		} else {
			navigation.navigate('Connected');
		}
	}

	render() {
		const { checked } = this.state;
		const { container, text, mt } = styles;

		const viewStyle = [
			styles.get('container.center', 'mt.xl', 'mb.xxl'),
			{ flex: 7, justifyContent: 'center', marginTop: 0 },
		];

		return (
			<View style={container.default}>
				<HeaderView title={t('learn_more')} subtitle={t('allow_param')} />
				<View style={viewStyle}>
					<BigCheckBox
						checked={checked.utcNews}
						labelStyle={text.h5}
						label={t('show_utc')}
						onPress={() => this.toggleCheck('utcNews')}
					/>
					<BigCheckBox
						checked={checked.assoLife}
						labelStyle={text.h5}
						label={t('show_assos')}
						onPress={() => this.toggleCheck('assoLife')}
					/>
					<BigCheckBox
						checked={checked.utcMember}
						labelStyle={text.h5}
						label={t('utc_member')}
						onPress={() => this.toggleCheck('utcMember')}
					/>
					<BigButton label={_('confirm')} style={mt.lg} onPress={this.validate.bind(this)} />
				</View>
			</View>
		);
	}
}
