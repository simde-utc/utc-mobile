import React from 'react';
import { Alert, FlatList, View } from 'react-native';
import withNavigation from 'react-navigation/src/views/withNavigation';
import SegmentedControlTab from 'react-native-segmented-control-tab';

import AssociationBlock from '../../components/Associations/AssociationBlock';
import FakeAssociationBlock from '../../components/Associations/FakeAssociationBlock';
import { _, e } from '../../utils/i18n';
import PortailApi from '../../services/Portail';
import styles from '../../styles';

export class AssociationsList extends React.PureComponent {
	static navigationOptions = {
		headerTitle: _('associations'),
		headerStyle: {
			backgroundColor: '#fff',
		},
		headerTintColor: '#007383',
		headerForceInset: { top: 'never' },
	};

	constructor(props) {
		super(props);

		this.state = {
			entities: [],
			filteredEntities: [],
			filters: [_('all'), 'PAE', 'PTE', 'PVDC', 'PSEC', 'BDE-UTC'],
			selectedFilterIndex: 0,
		};

		this.associationList = React.createRef();
	}

	componentDidMount() {
		const { navigation } = this.props;

		if (!PortailApi.isConnected()) {
			navigation.goBack();

			Alert.alert(e('association_not_available'), e('portail_error'));
		}

		const entities = [];

		PortailApi.getAssos(false, false, 0, 0)
			.then(assos => {
				assos.forEach(entity => entities.push(entity));

				this.setState({
					entities: entities.sort((a, b) => a.shortname.localeCompare(b.shortname)), // We return entities in alphabetical order
					filteredEntities: entities,
				});
			})
			.catch(reason => {
				console.warn(reason);
				Alert.alert(e('associations_not_available'), e('get_association_error'), [
					{ text: _('ok'), onPress: () => navigation.goBack() },
				]);
			});
	}

	componentWillUnmount() {
		if (PortailApi !== undefined) PortailApi.abortRequest();
	}

	filterByPoles(index) {
		const { entities, filters } = this.state;

		this.setState({ selectedFilterIndex: index });

		if (index === 0)
			// "All" filter
			this.setState({ filteredEntities: entities });
		else if (index > 0 && index < filters.length)
			// Pôles filters
			this.setState({
				filteredEntities: entities.filter(
					entity => entity.parent != null && entity.parent.shortname === filters[index]
				),
			});
		else throw e('wrong_filter');

		// Scroll to the first of the FlatList
		this.associationList.current.scrollToOffset({ animated: true, offset: 0 });
	}

	renderFilters() {
		const { selectedFilterIndex, filters } = this.state;

		return (
			<View
				style={{
					padding: 10,
					backgroundColor: '#fff',
					borderBottomWidth: 1,
					borderBottomColor: '#f1f1f1',
				}}
			>
				<SegmentedControlTab
					tabStyle={{ backgroundColor: 'transparent', borderColor: '#007383' }}
					tabTextStyle={{ color: '#007383' }}
					activeTabStyle={{ backgroundColor: '#007383' }}
					values={filters}
					selectedIndex={selectedFilterIndex}
					onTabPress={index => this.filterByPoles(index)}
				/>
			</View>
		);
	}

	render() {
		const { navigation } = this.props;
		const { filteredEntities } = this.state;

		return (
			<FlatList
				style={styles.associations.list}
				ref={this.associationList}
				data={filteredEntities.map(entity => {
					return { key: entity.id, entity };
				})}
				renderItem={({ item }) => (
					<AssociationBlock
						entity={item.entity}
						onPress={() => {
							navigation.navigate({
								key: item.key,
								routeName: 'Association',
								params: {
									id: item.entity.id,
									title: item.entity.shortname,
								},
							});
						}}
					/>
				)}
				ListHeaderComponent={this.renderFilters()}
				stickyHeaderIndices={[0]}
				ItemSeparatorComponent={() => <View style={styles.associations.separator} />}
				ListEmptyComponent={() => <FakeAssociationBlock title={_('loading')} />}
				initialNumToRender={5}
			/>
		);
	}
}

export default withNavigation(AssociationsList);
