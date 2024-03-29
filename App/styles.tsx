import {
    StyleSheet
} from 'react-native';
const styles = StyleSheet.create({
    page: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%',
        width: '100%'
    },
    flexRow: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    centerNoFlex: {
        justifyContent: 'center',
        alignItems: 'center'
    },
    gameOverText: {
        color: 'red',
        fontSize: 24,
        fontWeight: 'bold'
    },
    actionBlock: {
        height: '50%',
        width: '100%'
    },
    logo: {
        fontSize: 40,
        color: 'white'
    },
    whiteSircle: {
        backgroundColor: 'white',
        borderRadius: 100,
        borderBottomColor: 'black',
        borderBottomWidth: 4,
        borderEndWidth: 4,
        borderStartWidth: 4,
        alignItems: 'center',
        justifyContent: 'flex-start',
    },
    topCircle: {
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        position: 'absolute',
    },
    start: {
        borderRadius: (50 / 2),
        backgroundColor: 'red',
        height: 50,
        width: 50,
        borderColor: 'black',
        borderWidth: 4
    },
    startText: {
        fontSize: 20
    },
    stop: {
        backgroundColor: 'black',
        height: 50,
        width: 50,
        borderColor: 'red',
        borderWidth: 4
    },
    stopText: {
        fontSize: 20
    },
    elevation: {
        elevation: 20,
        shadowColor: '#52006A',
    },
    overlay: {
        backgroundColor: 'rgba(0, 0, 0, 0.1)',
        width: '100%',
        height: '100%',
        opacity: 0.9,

    },
    splashContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
    },
    input: {
        borderColor: "gray",
        width: 160,
        borderWidth: 1,
        borderRadius: 20,
        padding: 10,
    },
    playerName: {
        textDecorationLine: 'underline',
        textDecorationColor: 'blue'
    },
    scoreText: {
        color: 'yellow',
        fontSize: 14,
    },
    allScoreText: {
        textDecorationLine: 'underline',
    },
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 22,
    },
    modalView: {
        margin: 20,
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 35,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    button: {
        borderRadius: 20,
        padding: 10,
        elevation: 2,
    },
    buttonOpen: {
        backgroundColor: '#F194FF',
    },
    buttonClose: {
        backgroundColor: '#2196F3',
    },
    textStyle: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    modalText: {
        marginBottom: 15,
        textAlign: 'center',
    },
})
export default styles;