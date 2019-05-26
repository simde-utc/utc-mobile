import React from 'react';
import {FlatList, SectionList, Text, TouchableHighlight, View, Linking} from "react-native";
import styles from "../../styles";
import Icon from "../../components/Icon";

class SocialNetwork extends React.PureComponent {
    render() {
        return (
            <TouchableHighlight onPress={() => Linking.openURL(this.props.app.url)}>
                <View style={{
                    padding: 10,
                    backgroundColor: '#fff',
                    flex: 1,
                    flexDirection: 'row',
                    alignItems: 'center'
                }}>
                    <View style={{flex: 1}}>
                        <Text style={{fontSize: 16, fontWeight: 'bold'}}>{this.props.app.name}</Text>
                        <Text style={{fontSize: 13, fontWeight: 'bold', color: '#6d6f71'}}>{this.props.app.shortName}</Text>
                    </View>
                    <View>
                        <Icon image={require('../../img/icons/open.png')}/>
                    </View>
                </View>
            </TouchableHighlight>
        )
    }
}

export class ContactsScreen extends React.PureComponent {
    static navigationOptions = {
        headerTitle: 'Contacts',
        headerStyle: {
            backgroundColor: '#fff'
        },
        headerTintColor: '#007383',
        headerForceInset: { top: 'never' }
    };

    render() {
        return <SectionList
            style={{backgroundColor: '#f4f4f4'}}
            renderItem={({item, index, section}) =>  <SocialNetwork app={item.app}/> }
            renderSectionHeader={({section: {title}}) => (
                <View style={{
                    padding: 10,
                    backgroundColor: '#fff',
                    flex: 1,
                    flexDirection: 'row',
                    alignItems: 'center'
                }}>
                    <Text style={{fontSize: 18, fontWeight: 'bold', color: '#007383'}}>{title}</Text>
                </View>
            )}
            sections={[
                {title: 'Réseaux sociaux', data: require('../../data/social_networks').map(app => { return {key: app.name, app: app} })},
            ]}
            keyExtractor={(item, index) => item + index}
            ItemSeparatorComponent={() => <View style={styles.associations.separator}/>}
        />
    }
}
