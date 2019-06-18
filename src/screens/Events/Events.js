import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableHighlight } from 'react-native';
import { Agenda } from 'react-native-calendars';
import moment from 'moment';

import Filter from '../../components/Filter';
import PortailApi from '../../services/Portail';
import ColorUtils from '../../utils/Color';
import Generate from '../../utils/Generate';
import { _ } from '../../utils/i18n';

const styles = StyleSheet.create({
	event: {
		backgroundColor: 'white',
		flex: 1,
		borderRadius: 5,
		padding: 15,
		marginRight: 10,
		marginTop: 17,
	},
	emptyDate: {
		flex: 1,
		paddingTop: 30,
	},
});

export default class EventsScreen extends React.Component {
	static navigationOptions = () => {
		return {
			title: _('calendar'),
			headerStyle: {
				display: 'none',
			},
		};
	};

	static calendarName(calendar) {
		return (
			calendar.name +
			(calendar.owned_by.me ? '' : ` - ${calendar.owned_by.shortname || calendar.owned_by.name}`)
		);
	}

	static findIdInArray(array, id) {
		for (let i = 0; i < array.length; i++) {
			if (array[i].id === id) return i;
		}

		return null;
	}

	static rowHasChanged(event1, event2) {
		return (
			event1.id !== event2.id ||
			JSON.stringify(event1.calendars) !== JSON.stringify(event2.calendars)
		);
	}

	constructor(props) {
		super(props);

		this.state = {
			months: [],
			events: {},
			calendars: [],
			selectedCalendars: [],
			date: moment().format('YYYY-MM-DD'),
		};

		PortailApi.getUserCalendars()
			.then(([calendars]) => {
				this.setState(prevState => {
					prevState.calendars = calendars;
					prevState.selectedCalendars = calendars
						.filter(calendar => {
							return calendar.owned_by.me;
						})
						.map(calendar => {
							return calendar.id;
						});

					return prevState;
				});

				this.reload();
			})
			.catch(() => {
				this.reload();
			});
	}

	onlySelectFilter(name) {
		this.setState(prevState => {
			prevState.selectedCalendars = [name];

			return prevState;
		});
	}

	onSearchTextChange(text) {
		text = Generate.searchText(text);
		this.setState(prevState => {
			prevState.search = text;

			return prevState;
		});

		return text;
	}

	setDay(day) {
		const selectedDate = moment(new Date(day)).format('YYYY-MM-DD');
		const { date, events } = this.state;

		if (selectedDate === date) return;

		this.setState(prevState => {
			// On supprime l'ancienne date vide
			if (prevState.events[prevState.date] && prevState.events[prevState.date].length === 0)
				delete prevState.events[prevState.date];

			prevState.date = day;

			return prevState;
		});

		// On doit au moins généré la vue pour le jour sélectionné
		if (!events[selectedDate]) {
			this.setState(prevState => {
				prevState.events[selectedDate] = [];

				return prevState;
			});
		}
	}

	seeEvent(id, name) {
		const { navigation } = this.props;

		navigation.push('Event', { id, name });
	}

	reload() {
		const today = moment().format('YYYY-MM-DD');
		const { date } = this.state;

		this.setState(prevState => {
			prevState.months = [];
			prevState.events = {};
			prevState.events[today] = [];

			return prevState;
		});

		this.setDay(today);
		this.loadEvents(date);
	}

	unselectFilter(name) {
		this.setState(prevState => {
			if (prevState.selectedCalendars.length === 1 && prevState.selectedCalendars.includes(name))
				return prevState;

			const index = prevState.selectedCalendars.indexOf(name);

			if (index > -1) prevState.selectedCalendars.splice(index, 1);

			return prevState;
		});
	}

	selectFilter(name) {
		this.setState(prevState => {
			prevState.selectedCalendars.push(name);

			return prevState;
		});
	}

	loadEvents(day) {
		const month = moment(new Date(day)).format('YYYY-MM-01');
		const { months, calendars } = this.state;

		if (!months.includes(month)) {
			this.setState(prevState => {
				prevState.months.push(month);

				return prevState;
			});

			calendars.forEach(calendar => {
				PortailApi.getEventsFromCalendar(calendar.id, month)
					.then(([events]) => {
						events.forEach(event => {
							const date = moment(event.begin_at).format('YYYY-MM-DD');

							// On ajoute l'évènement pour la date x
							if (!events[date])
								this.setState(prevState => {
									prevState.events[date] = [];
									return prevState;
								});

							const index = EventsScreen.findIdInArray(events[date], event.id);

							// Si l'évènement y est déjà, on ajoute juste sur quel calendrier il est
							if (index === null) {
								event.calendars = [calendar];

								this.setState(prevState => {
									prevState.events[date].push(event);
									return prevState;
								});
							} else {
								this.setState(prevState => {
									prevState.events[date][index].calendars.push(calendar);

									return prevState;
								});
							}
						});
					})
					.catch(() => {
						// On a aucun évènement à ajouter
					});
			});
		}
	}

	static renderEventCalendars(calendars) {
		const style = {
			flexDirection: 'row',
			bottom: 0,
			marginTop: 10,
		};

		const calendarStyle = {
			padding: 5,
			marginRight: 5,
			borderRadius: 5,
		};

		return (
			<ScrollView style={style} horizontal>
				{calendars.map((calendar, _) => (
					<View style={[calendarStyle, { backgroundColor: calendar.color }]} key={calendar.id}>
						<Text style={{ fontSize: 12, color: ColorUtils.invertColor(calendar.color, true) }}>
							{EventsScreen.calendarName(calendar)}
						</Text>
					</View>
				))}
			</ScrollView>
		);
	}

	static renderEvent(event) {
		const style = [styles.event];
		let time;

		if (event.full_day) {
			time = 'La journée';
		} else {
			time = `${moment(event.begin_at).format('HH:mm')} - ${moment(event.end_at).format('HH:mm')}`;
		}

		return (
			<TouchableHighlight
				style={style}
				onPress={() => this.seeEvent(event.id, event.name)}
				underlayColor="#fff0"
			>
				<View>
					<Text style={{ fontSize: 17 }}>{time}</Text>
					<Text style={{ marginTop: 3, fontWeight: 'bold', fontSize: 18 }}>{event.name}</Text>
					<Text style={{ fontSize: 12 }}>{event.location.name}</Text>
					<Text style={{ fontStyle: 'italic', fontSize: 10 }}>{event.location.place.name}</Text>
					{EventsScreen.renderEventCalendars(event.calendars)}
				</View>
			</TouchableHighlight>
		);
	}

	static renderEmptyDate() {
		return (
			<View style={styles.emptyDate}>
				<Text />
			</View>
		);
	}

	render() {
		const { calendars, events, selectedCalendars, date } = this.state;

		const filters = calendars.map(calendar => {
			return {
				id: calendar.id,
				name: EventsScreen.calendarName(calendar),
				selectedColor: calendar.color,
			};
		});

		const eventsToPrint = {};

		Object.entries(events).forEach(([date, dateEvents]) => {
			const visibleEvents = dateEvents.filter(event => {
				for (let i = 0; i < selectedCalendars.length; i++) {
					if (EventsScreen.findIdInArray(event.calendars, selectedCalendars[i]) !== null)
						return true;
				}

				return false;
			});

			// if (visibleEvents.length > 0)
			eventsToPrint[date] = visibleEvents;
		});

		return (
			<View style={{ flex: 1 }}>
				<Filter
					filters={filters}
					selectedFilters={selectedCalendars}
					onFilterUnselected={this.unselectFilter.bind(this)}
					onFilterSelected={this.selectFilter.bind(this)}
					onFilterLongPressed={this.onlySelectFilter.bind(this)}
					onSearchTextChange={this.onSearchTextChange.bind(this)}
				/>
				<Agenda
					items={eventsToPrint}
					loadItemsForMonth={date => {
						this.loadEvents(date.dateString);
					}}
					selected={date}
					onDayPress={day => {
						this.setDay(day.dateString);
					}}
					onDayChange={day => {
						this.setDay(day.dateString);
					}}
					renderItem={EventsScreen.renderEvent}
					renderEmptyDate={EventsScreen.renderEmptyDate}
					rowHasChanged={EventsScreen.rowHasChanged}
				/>
			</View>
		);
	}
}
