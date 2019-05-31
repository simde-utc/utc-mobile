import React from 'react';
import {createStackNavigator} from "react-navigation";
import {ScrollView, Text, TouchableHighlight, View} from "react-native";
import ProfileScreen from "../Profile";
import Icon from "../../components/Icon";
import Arrow from '../../img/icons/arrow_yellow.png'
import styles from '../../styles'
import {ProfileHeader} from "../Profile/ProfileHeader";
import AssociationsListScreen from "../Associations";
import AssociationScreen from "../Associations/Association";
import {MapNavigator} from "../Map";
import {InteractionsScreen} from "../Interactions";
import {ContactsScreen} from "../Contacts";
import {FAQNavigator} from "../FAQ";

export class FullWidthButton extends React.Component {
    render() {
        return (
            <TouchableHighlight style={{marginBottom: 10}} onPress={this.props.onPress} underlayColor={'#007383'} activeOpacity={0.7}>
                <View style={{
                    padding: 10,
                    backgroundColor: '#fff',
                    flex: 1,
                    flexDirection: 'row',
                    alignItems: 'center',
                }}>
                    <View style={{
                        backgroundColor: '#fff',
                        borderLeftWidth: 2,
                        borderLeftColor: '#fff',
                        flex: 1
                    }}>
                        <Text style={styles.navigation.fullWidthButton.text}>{this.props.name}</Text>
                    </View>
                    <View>
                        <Icon image={require('../../img/icons/arrow_yellow.png')}/>
                    </View>
                </View>
            </TouchableHighlight>
        );
        return (
            <TouchableHighlight onPress={this.props.onPress} underlayColor={'#007383'} activeOpacity={0.7}>
                <View style={styles.navigation.fullWidthButton.view}>
                    <Text style={styles.navigation.fullWidthButton.text}>{this.props.name}</Text>
                    <View>
                        <Icon style={{}} image={Arrow}/>
                    </View>
                </View>
            </TouchableHighlight>

        )
    }
}

export class NavigationScreen extends React.Component {
    render() {
        return (
            <ScrollView style={styles.navigation.scrollView}>
                <ProfileHeader onPress={() => this.props.navigation.navigate('Profile')}/>
                <FullWidthButton name={'Mon compte'} onPress={() => this.props.navigation.navigate('Profile')}/>
                <FullWidthButton name={'Liste des associations'} onPress={() => this.props.navigation.navigate('Associations')}/>
                <FullWidthButton name={'Foire aux questions'} onPress={() => this.props.navigation.navigate('FAQ')}/>
                <FullWidthButton name={'Interactions'} onPress={() => this.props.navigation.navigate('Interactions')}/>
                <FullWidthButton name={'Plan'} onPress={() => this.props.navigation.navigate('Map')}/>
                <FullWidthButton name={'Contacts'} onPress={() => this.props.navigation.navigate('Contacts')}/>
            </ScrollView>
        );
    }
}

export default NavigationNavigator = createStackNavigator({
    Navigation: {
        screen: NavigationScreen,
        navigationOptions: {
            header: null,
            headerForceInset: { top: 'never' }
        }
    },
    Associations: {
        screen: AssociationsListScreen
    },
    Association: {
        screen: AssociationScreen
    },
    FAQ: {
        screen: FAQNavigator,
        navigationOptions: {
            header: null,
        }
    },
    Map: {
        screen: MapNavigator,
        navigationOptions: {
            headerTitle: 'Plan',
            headerStyle: {
                backgroundColor: '#fff'
            },
            headerTintColor: '#007383',
            headerForceInset: { top: 'never' }
        }
    },
    Interactions: {
        screen: InteractionsScreen
    },
    Contacts: {
        screen: ContactsScreen
    },
    Profile: {
        screen: ProfileScreen
    }

},{
    initialRouteName: 'Navigation'
});
