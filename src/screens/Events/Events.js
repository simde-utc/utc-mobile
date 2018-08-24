import React from 'react';
import { View, Image, Text, ScrollView, Button, StyleSheet, TouchableHighlight } from 'react-native';
import { Calendar, CalendarList, Agenda } from 'react-native-calendars';
import moment from 'moment'

import Generate from '../../utils/Generate'

import Filter from '../../components/Filter'

import PortailApi from '../../services/Portail'
import Storage from '../../services/Storage'
import ColorUtils from '../../utils/Color'

export default class EventsScreen extends React.Component {
	static navigationOptions = ({ navigation, navigationOptions }) => {
		return {
			title: 'Calendrier',
		}
    }

	constructor(props) {
		super(props)

		this.state = {
			months: [],
			events: {},
			calendars: [],
			selectedCalendars: [],
			date: moment().format('YYYY-MM-DD')
		}

		PortailApi.getUserCalendars().then(([calendars]) => {
			this.setState(prevState => {
				prevState.calendars = calendars

				return prevState
			})

			this.reload()
		}).catch(() => {
			this.reload()
		})
	}

	reload() {
		var today = moment().format('YYYY-MM-DD')

		this.setState(prevState => {
			prevState.months = []
			prevState.events = {}
			prevState.events[today] = []

			return prevState
		})

		this.setDay(today)
		this.loadEvents(this.state.date)
	}

	seeEvent(id, name) {
		this.props.navigation.push('Event', {id: id, name: name})
	}

	setDay(day) {
		var selectedDate = moment(new Date(day)).format('YYYY-MM-DD')

		if (selectedDate === this.state.date)
			return

		this.setState(prevState => {
			// On supprime l'ancienne date vide
			if (prevState.events[prevState.date] && prevState.events[prevState.date].length === 0)
				delete prevState.events[prevState.date]

			prevState.date = day

			return prevState
		})

		// On doit au moins généré la vue pour le jour sélectionné
		if (!this.state.events[selectedDate]) {
			this.setState(prevState => {
				prevState.events[selectedDate] = []

				return prevState
			})
		}
	}

	unselectFilter(name) {
		this.setState(prevState => {
			if (prevState.selectedCalendars.length === 1 && prevState.selectedCalendars.includes(name))
				return prevState

			var index = prevState.selectedCalendars.indexOf(name)

			if (index > -1)
				prevState.selectedCalendars.splice(index, 1)

			return prevState
		})
	}

	selectFilter(name) {
		this.setState(prevState => {
			prevState.selectedCalendars.push(name)

			return prevState
		})
	}

	onSearchTextChange(text) {
		text = Generate.searchText(text)
		this.setState((prevState) => {
			prevState.search = text

			return prevState
		})

		return text
	}

	render() {
		return (
			<View style={{ flex: 1 }}>
				<Filter
					filters={ this.state.calendars.map((calendar) => { return calendar.name }) }
					selectedFilters={ this.state.selectedFilters }
					onFilterUnselected={ this.unselectFilter.bind(this) }
					onFilterSelected={ this.selectFilter.bind(this) }
					onSearchTextChange={ this.onSearchTextChange.bind(this) }
				/>
				<Agenda
					items={ this.state.events }
					loadItemsForMonth={ (date) => { this.loadEvents(date.dateString) } }
					selected={ this.state.date }
					onDayPress={(day) => { this.setDay(day.dateString) }}
					onDayChange={(day) => { this.setDay(day.dateString) }}
					renderItem={ this.renderEvent.bind(this) }
					renderEmptyDate={ this.renderEmptyDate.bind(this) }
					rowHasChanged={ this.rowHasChanged.bind(this) }
				/>
			</View>
		);
	}

	_findEventId(array, id) {
		for (let i = 0; i < array.length; i++) {
			if (array[i].id === id)
				return i
		}

		return null
	}

	loadEvents(day) {
		var month = moment(new Date(day)).format('YYYY-MM-01')

		if (!this.state.months.includes(month)) {
			this.setState(prevState => {
				prevState.months.push(month)

				return prevState
			});

			this.state.calendars.forEach((calendar) => {
				PortailApi.getEventsFromCalendar(calendar.id, month).then(([events]) => {
					events.forEach((event) => {
						var date = moment(event.begin_at).format('YYYY-MM-DD')

						// On ajoute l'évènement pour la date x
						if (!this.state.events[date])
							this.setState(prevState => {
								prevState.events[date] = []
								return prevState
							})

						var index = this._findEventId(this.state.events[date], event.id);

						// Si l'évènement y est déjà, on ajoute juste sur quel calendrier il est
						if (index === null) {
							event.calendars = [calendar]

							this.setState(prevState => {
								prevState.events[date].push(event)
								return prevState
							})
						}
						else {
							this.setState(prevState => {
								prevState.events[date][index].calendars.push(calendar)

								return prevState
							})
						}
					})
				}).catch((response) => {
					// On a aucun évènement à ajouter
				})
			})
		}
	}

	renderEventCalendars(calendars) {
		const style = {
			flexDirection: 'row',
			bottom: 0,
			marginTop: 10
		}

		const calendarStyle = {
			padding: 5,
			marginRight: 5,
			borderRadius: 5,
		}

		return (
			<View style={ style }>
				{ calendars.map((calendar, index) => (
					<View style={[ calendarStyle, { backgroundColor: calendar.color } ]}
						key={ index }
					>
						<Text style={{ fontSize: 12, color: ColorUtils.invertColor(calendar.color, true) }}>
							{ calendar.name }
						</Text>
					</View>
				)) }
			</View>
		)
	}

	renderEvent(event) {
		const style = [
			styles.event,
		]

		if (event.full_day)
			var time = 'La journée'
		else
			var time = moment(event.begin_at).format('HH:mm') + ' - ' + moment(event.end_at).format('HH:mm')

		return (
			<TouchableHighlight style={ style }
				onPress={ () => this.seeEvent(event.id, event.name) }
				underlayColor={"#fff0"}
			>
				<View>
					<Text style={{ fontSize: 17 }}>{ time }</Text>
					<Text style={{ marginTop: 3, fontWeight: 'bold', fontSize: 18 }}>{ event.name }</Text>
					<Text style={{ fontSize: 12 }}>{ event.location.name }</Text>
					<Text style={{ fontStyle: 'italic', fontSize: 10 }}>{ event.location.place.name }</Text>
					{ this.renderEventCalendars(event.calendars) }
				</View>
			</TouchableHighlight>
		);
	}

	renderEmptyDate() {
		return (
			<View style={styles.emptyDate}><Text></Text></View>
		);
	}

	rowHasChanged(event1, event2) {
		return event1.id !== event2.id
			|| JSON.stringify(event1.calendars) !== JSON.stringify(event2.calendars);
	}
}

const styles = StyleSheet.create({
	event: {
		backgroundColor: 'white',
		flex: 1,
		borderRadius: 5,
		padding: 15,
		marginRight: 10,
		marginTop: 17
	},
	emptyDate: {
		flex:1,
		paddingTop: 30
	}
});
