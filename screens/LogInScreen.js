import React, { useState } from 'react'
import { View, Text, StyleSheet, TextInput, TouchableWithoutFeedback } from 'react-native'
import Title from '../components/Title'
import { fire } from '../database/firebase';
import LogInBackground from '../components/icons/loginBG'
import { useContext } from 'react';
import { ModelContext } from '../model/MyYummiBiteModel';

export default function LogInScreen({ navigation }) {
    const model = useContext(ModelContext);
    const [email, setEmail] = useState(null);
    const [password, setPassword] = useState(null);

    /* const [authenticated, setAuthenticated] = useState(false);
    const [user, setUser] = useState(null); */

    const handleLogIn = async () => {
        try {
            await fire.auth().signInWithEmailAndPassword(email, password);
            /* model.setUser(); */
            /* setAuthenticated(true);
            const userID = fire.auth().currentUser.uid;
            authenticated ? setUser(userID) : null;
            console.log(userID); */
            navigation.navigate('TabNav');
        } catch (error) {
            alert(`ERROR: ${error}`);
        }
    }

    return (
        <View>
            <View style={styles.formContainer}>
                <Title>My Yummi Bite</Title>
                <TextInput placeholder="Email" placeholderTextColor="#fff" style={styles.textInput} value={email} onChangeText={(value) => setEmail(value)} />
                <TextInput placeholder="Password" placeholderTextColor="#fff" style={styles.textInput} value={password} onChangeText={(value) => setPassword(value)} />
                <TouchableWithoutFeedback onPress={handleLogIn}>
                    <View style={styles.confirmBtn}>
                        <Text style={styles.buttonText}>Confirm</Text>
                    </View>
                </TouchableWithoutFeedback>
            </View >
            <View style={styles.SignUpContainer}>
                <Text>Don't you have an account yet?</Text>
                <TouchableWithoutFeedback onPress={() => navigation.navigate('SignUp')}>
                    <Text style={styles.register}>Register</Text>
                </TouchableWithoutFeedback>
            </View>
            <LogInBackground style={styles.background} />
        </View>
    )
}

const styles = StyleSheet.create({
    formContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        margin: 25,
        paddingTop: 130
    },
    textInput: {
        width: '100%',
        color: 'white',
        borderBottomWidth: 1,
        borderColor: '#fff',
        paddingHorizontal: 10,
        marginBottom: 50,

    },
    confirmBtn: {
        backgroundColor: '#FF8A9B',
        /* flex: 1, */
        height: 23,
        borderRadius: 15,
        paddingHorizontal: 100,
        justifyContent: 'center',
    },
    buttonText: {
        fontFamily: 'Poppins-Bold',
        fontWeight: 'bold',
        textTransform: 'uppercase',
        textAlign: 'center',
        fontSize: 12,
        color: 'white',
    },
    SignUpContainer: {
        flexDirection: 'row',
        marginVertical: 70,
        position: 'absolute',
        bottom: '-60%',
        left: 20
    },
    register: {
        marginHorizontal: 5,
        color: '#FF8A9B',
    },
    background: {
        position: 'absolute',
        top: 0,
        zIndex: -1,
    }
})
