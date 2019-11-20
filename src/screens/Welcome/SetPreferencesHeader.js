import React from 'react';

import HeaderView from '../../components/HeaderView';
import { _, Welcome as t } from '../../utils/i18n';

export default class SetPreferencesHeaderScreen extends React.Component {
    constructor(props){
        super(props);
    }
    
    render() {
        return (
            <HeaderView
                style={{flex: 1}}
                title={t('learn_more')}
                subtitle={t('allow_param')}
            />
        );
    }
}
