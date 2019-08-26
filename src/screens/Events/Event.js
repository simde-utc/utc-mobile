import React from 'react';
import { View, Text, TouchableHighlight } from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay';
import openMap from 'react-native-open-maps';

import BigButton from '../../components/BigButton';
import Map from '../../components/Map';
import PortailApi from '../../services/Portail';
import styles from '../../styles';
import { _, Events as t } from '../../utils/i18n';

export default class EventScreen extends React.Component {
	static navigationOptions = ({ navigation }) => {
		return {
			title: navigation.getParam('name', _('evenement')),
		};
	};

	constructor(props) {
		super(props);

		this.state = {
			event: {},
			calendars: [],
			loading: true,
			loaded: false,
		};

		PortailApi.getUserCalendars()
			.then(([calendars]) => {
				this.setState(prevState => {
					prevState.calendars = calendars;

					return prevState;
				});
			})
			.catch(() => {});

		PortailApi.getEvent(props.navigation.getParam('id')).then(([event]) => {
			const { loaded } = this.state;

			this.setState(prevState => {
				prevState.event = event;
				prevState.loading = false;

				return prevState;
			});

			if (loaded) {
				this.setTarget();
			}
		});
	}

	setTarget() {
		const { event } = this.state;
		const position = event.location.position || event.location.place.position;

		this.setState(prevState => {
			prevState.target = [position.coordinates[1], position.coordinates[0]];

			return prevState;
		});
	}

	goMap() {
		const { loading, event } = this.state;

		if (!loading) {
			const position = event.location.position || event.location.place.position;

			openMap({
				latitude: position.coordinates[1],
				longitude: position.coordinates[0],
			});
		}
	}

	loaded() {
		const { loading } = this.state;

		this.setState(prevState => {
			prevState.loaded = true;

			return prevState;
		});

		if (!loading) this.setTarget();
	}

	render() {
		const { loading, target, event } = this.state;
		const viewStyle = [styles.get('container.default', 'bg.white', 'pt.xl', 'pb.xxl'), { flex: 7 }];

		return (
			<View style={styles.container.default}>
				<View>
					<Spinner visible={loading} textContent={_('loading')} textStyle={{ color: '#FFF' }} />
				</View>
				<TouchableHighlight
					style={{ backgroundColor: '#F00', width: '100%', aspectRatio: 2 }}
					onPress={() => this.goMap()}
					underlayColor="#fff0"
				>
					<Map target={target} loaded={this.loaded.bind(this)} />
				</TouchableHighlight>
				<Text>{event.name}</Text>
				<Text>{event.owned_by && event.owned_by.name}</Text>
				<View style={viewStyle}>
					<BigButton
						label={t('add_calendar')}
						style={styles.get('mt.lg', 'mb.md')}
						onPress={() => this.connect()}
					/>
					<BigButton
						label={_('share')}
						style={styles.get('mt.lg', 'mb.md')}
						onPress={() => this.connect()}
					/>
				</View>
			</View>
		);
	}
}
