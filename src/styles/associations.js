export const associations = {
    list: {},

    separator: {
        borderBottomWidth: 1,
        borderBottomColor: '#f1f1f1'
    },

    block: {
        view: {
            padding: 10,
            backgroundColor: '#fff',
            flex: 1,
            flexDirection: 'row',
        },
        details: {
            paddingLeft: 10,
            backgroundColor: '#fff',
            borderLeftWidth: 2,
            borderLeftColor: '#fff',
            flex: 1
        }
    },

    details: {
        logoView: {
            backgroundColor: '#fff',
            alignItems: 'center',
        },
        textView: {
            title: {
                fontSize: 30,
                fontWeight: 'bold'
            },
            subtitle: {
                fontSize: 15,
                fontWeight: 'bold',
                color: '#6d6f71'
            },
            description: {
                fontSize: 15,
                color: '#6d6f71'
            }
        }
    }
};
