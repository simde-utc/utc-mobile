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
			calendars: [],
			date: moment().format('YYYY-MM-DD')
		}

		PortailApi.getUserCalendars().then(([data]) => {
			this.setState(prevState => {
				prevState.calendars = data

				return prevState
			})

			this.reload()
		})
	}

	reload() {
		this.setState(prevState => {
			prevState.months = []
			prevState.items = {}

			return prevState
		})

		this.loadItems(this.state.date)
	}

	render() {
		return (
			<Agenda
				items={ this.state.items }
				loadItemsForMonth={ (date) => { this.loadItems(date.dateString) } }
				selected={ this.state.date }
				onDayPress={ (day) => { this.setState(prevState => { prevState.date = day; return prevState })} }
				onDayChange={ (day) => { this.setState(prevState => { prevState.date = day; return prevState })} }
				renderItem={ this.renderItem.bind(this) }
				renderEmptyDate={ this.renderEmptyDate.bind(this) }
				rowHasChanged={ this.rowHasChanged.bind(this) }
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
		var month = moment(new Date(day)).format('YYYY-MM-01')
		var momentMonth = moment(new Date(month))

		if (!this.state.months.includes(month)) {
			var momentMonthLimit = moment(new Date(moment(new Date(day)).format('YYYY-MM-01'))).add(1, 'months')

			this.setState(prevState => {
				prevState.months.push(month)

				return prevState
			});

			while (momentMonth < momentMonthLimit) {
				this.state.items[momentMonth.format('YYYY-MM-DD')] = []

				momentMonth.add(1, 'days')
			}

			this.state.calendars.forEach((calendar) => {
				PortailApi.getEventsFromCalendar(calendar.id, month).then(([data]) => {
					data.forEach((event) => {
						var date = moment(event.begin_at).format('YYYY-MM-DD')
						event.color = calendar.color

						this.setState(prevState => {
							if (!prevState.items[date])
								prevState.items[date] = [event]
							else
								prevState.items[date].push(event)

							return prevState
						})
					})
				}).catch((response) => {
					// On a aucun évènement à ajouter
				})
			})
		}
	}

	renderItem(item) {
		return (
			<View style={[styles.item, {height: item.height, backgroundColor: item.color }]}><Text>{item.name}</Text></View>
		);
	}

	renderEmptyDate() {
		return (
			<View style={styles.emptyDate}><Text></Text></View>
		);
	}

	rowHasChanged(r1, r2) {
		return r1.id !== r2.id;
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
