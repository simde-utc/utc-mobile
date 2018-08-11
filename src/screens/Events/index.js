import React from 'react';
import { View, Image, Text, ScrollView, Button, StyleSheet } from 'react-native';
import { Calendar, CalendarList, Agenda } from 'react-native-calendars';
import moment from 'moment'

import PortailApi from '../../services/Portail'
import Storage from '../../services/Storage'

export default class EventsScreen extends React.Component {
	constructor(props) {
		super(props)

		this.state = {
			months: [],
			items: {},
		};
	}

	render() {
		return (
			<Agenda
				items={this.state.items}
				loadItemsForMonth={this.loadItems.bind(this)}
				selected={'2018-04-05'}
				renderItem={this.renderItem.bind(this)}
				renderEmptyDate={this.renderEmptyDate.bind(this)}
				rowHasChanged={this.rowHasChanged.bind(this)}
				onDayPress={(day)=>{console.log('day pressed')}}
				onDayChange={(day)=>{console.log('day changed')}}
				// markingType={'period'}
				// markedDates={{
				//    '2017-05-08': {textColor: '#666'},
				//    '2017-05-09': {textColor: '#666'},
				//    '2017-05-14': {startingDay: true, endingDay: true, color: 'blue'},
				//    '2017-05-21': {startingDay: true, color: 'blue'},
				//    '2017-05-22': {endingDay: true, color: 'gray'},
				//    '2017-05-24': {startingDay: true, color: 'gray'},
				//    '2017-05-25': {color: 'gray'},
				//    '2017-05-26': {endingDay: true, color: 'gray'}}}
				// monthFormat={'yyyy'}
				// theme={{calendarBackground: 'red', agendaKnobColor: 'green'}}
				//renderDay={(day, item) => (<Text>{day ? day.day: 'item'}</Text>)}
			/>
		);
	}

	loadItems(day) {
		var month = moment(new Date(day.dateString)).format('YYYY-MM-01')
		var momentMonth = moment(new Date(month))

		if (!this.state.months.includes(month)) {
			var momentMonthLimit = moment(moment(new Date(day.dateString)).format('YYYY-MM-01')).add(1, 'months')

			this.setState(prevState => {
				prevState.months.push(month)

				return prevState
			});

			while (momentMonth < momentMonthLimit) {
				this.state.items[momentMonth.format('YYYY-MM-DD')] = []

				momentMonth.add(1, 'days')
			}


			return PortailApi.getEvents(month).then(([data]) => {
				data.forEach((event) => {
					var date = moment(event.begin_at).format('YYYY-MM-DD')

					this.setState(prevState => {
						if (!prevState.items[date])
							prevState.items[date] = []

						prevState.items[date].push(event)

						return prevState
					})
				})

				return new Promise.resolve()
			}).catch(() => {
				return new Promise.resolve()
			})
		}
		else {
			return new Promise.resolve()
		}
	}

	renderItem(item) {
		return (
			<View style={[styles.item, {height: item.height}]}><Text>{item.name}</Text></View>
		);
	}

	renderEmptyDate() {
		return (
			<View style={styles.emptyDate}><Text></Text></View>
		);
	}

	rowHasChanged(r1, r2) {
		return r1.name !== r2.name;
	}
}

const styles = StyleSheet.create({
	item: {
		backgroundColor: 'white',
		flex: 1,
		borderRadius: 5,
		padding: 10,
		marginRight: 10,
		marginTop: 17
	},
	emptyDate: {
		height: 15,
		flex:1,
		paddingTop: 30
	}
});
