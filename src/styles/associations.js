export const associations = {
    layout: {
        backgroundColor: '#f8f8f8'
    },

    block: {
        view: {
            backgroundColor: '#f2f2f2',
            margin: 10,
            marginBottom: 0,
            borderWidth: 2,
            borderRadius: 4,
            borderColor: '#fff',
            flex: 1,
            flexDirection: 'row',
        },
        details: {
            padding: 10,
            borderLeftWidth: 2,
            borderLeftColor: '#fff',
            flex: 1
        }
    },

    details: {
        logoView: {
            backgroundColor: '#fff',
            borderWidth: 2,
            borderColor: '#fff',
            alignItems: 'center',
        },
        textView: {
            title: {
                fontSize: 30,
                fontWeight: 'bold'
            },
            subtitle: {
                paddingBottom: 10,
                fontSize: 15,
                fontWeight: 'bold',
                color: '#6d6f71'
            },
            description: {
                fontSize: 15,
                color: '#6d6f71'
            }
        }
    },

    member: {
    }

};
