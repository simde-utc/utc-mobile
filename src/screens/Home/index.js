import React from 'react';
import { ScrollView } from 'react-native';

import ArticlesCaroussel from '../../components/Home/ArticlesCaroussel';
import ShortcutGrid from '../../components/Home/ShortcutGrid';
import styles from '../../styles';

const Home = ({ navigation }) => (
	<ScrollView style={styles.bg.background}>
		<ArticlesCaroussel />
		<ShortcutGrid navigation={navigation} />
	</ScrollView>
);

export default Home;
