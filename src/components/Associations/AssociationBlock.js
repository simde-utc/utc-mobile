import React from 'react';
import { Image, Text, TouchableHighlight, View } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';

import styles from '../../styles';
import pictureIcon from '../../img/icons/picture.png';

class AssociationBlock extends React.PureComponent {
	getPoleColor() {
		const { entity } = this.props;

		if (entity.parent == null) {
			return '#000';
		}

		switch (entity.parent.shortname) {
			case 'PAE':
				return '#f27941';
			case 'PTE':
				return '#1dafec';
			case 'PVDC':
				return '#fed43b';
			case 'PSEC':
				return '#8ec449';
			case 'BDE-UTC':
				return '#3c3746';
			default:
				return '#000';
		}
	}

	renderLogo() {
		const { entity } = this.props;
		const [height, width] = [100, 100];

		return entity.image ? (
			<Image
				style={{ height, width, backgroundColor: '#fff' }}
				source={{ uri: entity.image }}
				resizeMode="contain"
			/>
		) : (
			<Image
				style={{ height, width, backgroundColor: '#f1f1f1' }}
				source={pictureIcon}
				resizeMode="center"
			/>
		);
	}

	render() {
		const { onPress, entity } = this.props;

		return (
			<TouchableHighlight onPress={onPress}>
				<View style={styles.associations.block.view}>
					{this.renderLogo()}
					<View style={styles.associations.block.details}>
						<Text style={{ fontSize: 20, fontWeight: 'bold', color: this.getPoleColor() }}>
							{entity.shortname}
						</Text>
						<Text style={{ fontSize: 13, fontWeight: 'bold', color: '#6d6f71' }}>
							{entity.name.toLowerCase() !== entity.shortname.toLowerCase() ? entity.name : null}
						</Text>
					</View>
					<View style={styles.associations.block.icon}>
						<FontAwesomeIcon icon={['fas', 'arrow-right']} size={22} style={styles.text.yellow} />
					</View>
				</View>
			</TouchableHighlight>
		);
	}
}

export default AssociationBlock;
