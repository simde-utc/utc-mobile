import React from 'react';
import { ScrollView } from 'react-native';
import { Platform } from 'react-native';
import { AsyncStorage } from 'react-native';
import { Alert } from 'react-native';

import ArticlesCaroussel from '../../components/Home/ArticlesCaroussel';
import ShortcutGrid from '../../components/Home/ShortcutGrid';
import styles from '../../styles';

import firebase from 'react-native-firebase';

export default class Home extends React.Component {

	constructor(props) {
		super(props);
	}

	async componentDidMount() {
		this.checkNotificationsPermission();
		this.addNotificationListeners();
	}

	componentWillUnmount(){
		this.removeNotificationListeners();
	}

	checkNotificationsPermission() {
		console.log("checkNotificationsPermission");
		firebase.messaging().hasPermission().then(
			enabled => {
				if(enabled) {
					this.getToken();

				} else {
					this.requestPermission();
				}
			}
		);
	}

	async getToken() {
		let fcmToken = await AsyncStorage.getItem('fcmToken');

		if (!fcmToken) {
			fcmToken = await firebase.messaging().getToken();
			if (fcmToken) {
				await AsyncStorage.setItem('fcmToken', fcmToken);
				// Here save the association between token and utc login in a data base
			}
		}
	}

	async requestPermission() {
		try {
			await firebase.messaging().requestPermission();
			this.getToken();
		} catch (error) {
			console.warn('permission rejected');
		}
	}

	addNotificationListeners() {
		this.notificationInitialListener = firebase.notifications().getInitialNotification().then((notificationOpen) => {
			const { data } = notificationOpen.notification;
			if (data.body != null) {
				Alert.alert("Résultat enseignement", data.body);
			}
		});

		this.notificationListener = firebase.notifications().onNotification((notification) => {
			Alert.alert("Résultat enseignement",notification.body);
		});
	}

	removeNotificationListeners() {
		this.notificationInitialListener();
		this.notificationListener();
	}

	render() {
		const { navigation } = this.props;
		return(
			<ScrollView style={styles.bg.background}>
				<ArticlesCaroussel navigation={navigation} />
				<ShortcutGrid navigation={navigation} />
			</ScrollView>
		);
	}
}
