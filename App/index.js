// Filename: index.js
// Combined code from all files

import React, { useRef, useState } from 'react';
import { SafeAreaView, StyleSheet, Text, TextInput, Button, View, ActivityIndicator } from 'react-native';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import axios from 'axios';

const Stack = createStackNavigator();

const LoginScreen = () => {
    const emailRef = useRef('');
    const passwordRef = useRef('');
    const [loading, setLoading] = useState(false);

    const navigation = useNavigation();

    const handleLogin = async () => {
        setLoading(true);
        try {
            const response = await axios.post('http://apihub.p.appply.xyz:3300/chatgpt', {
                messages: [
                    { role: "system", content: "You are a helpful assistant. Please provide answers for given requests." },
                    { role: "user", content: `Login attempt with Email: ${emailRef.current}, Password: ${passwordRef.current}` }
                ],
                model: "gpt-4o"
            });
            const resultString = response.data.response;
            setLoading(false);
            alert(`Login Successful:\nResponse: ${resultString}`);
        } catch (error) {
            setLoading(false);
            alert('Login Failed');
        }
    };

    return (
        <SafeAreaView style={styles.loginContainer}>
            <Text style={styles.title}>Login</Text>
            <TextInput
                style={styles.input}
                placeholder="Email"
                onChangeText={(text) => emailRef.current = text}
                keyboardType="email-address"
                autoCapitalize="none"
            />
            <TextInput
                style={styles.input}
                placeholder="Password"
                onChangeText={(text) => passwordRef.current = text}
                secureTextEntry
            />
            {loading ? (
                <ActivityIndicator size="large" color="#0000ff" />
            ) : (
                <Button title="Login" onPress={handleLogin} />
            )}
            <Button title="Signup" onPress={() => navigation.navigate('Signup')} />
        </SafeAreaView>
    );
};

const SignupScreen = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const navigation = useNavigation();

    const handleSignup = async () => {
        setLoading(true);
        try {
            const response = await axios.post('http://apihub.p.appply.xyz:3300/chatgpt', {
                messages: [
                    { role: "system", content: "You are a helpful assistant. Please provide answers for given requests." },
                    { role: "user", content: `Signup attempt with Username: ${username}, Email: ${email}, Password: ${password}` }
                ],
                model: "gpt-4o"
            });
            const resultString = response.data.response;
            setLoading(false);
            alert(`Signup Successful:\nResponse: ${resultString}`);
            navigation.navigate('Login');
        } catch (error) {
            setLoading(false);
            alert('Signup Failed');
        }
    };

    return (
        <SafeAreaView style={styles.signupContainer}>
            <Text style={styles.title}>Signup</Text>
            <TextInput
                style={styles.input}
                placeholder="Username"
                value={username}
                onChangeText={setUsername}
            />
            <TextInput
                style={styles.input}
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
            />
            <TextInput
                style={styles.input}
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
            />
            {loading ? (
                <ActivityIndicator size="large" color="#0000ff" />
            ) : (
                <Button title="Signup" onPress={handleSignup} />
            )}
        </SafeAreaView>
    );
};

export default function App() {
    return (
        <NavigationContainer>
            <SafeAreaView style={styles.container}>
                <Stack.Navigator initialRouteName="Login">
                    <Stack.Screen name="Login" component={LoginScreen} />
                    <Stack.Screen name="Signup" component={SignupScreen} />
                </Stack.Navigator>
            </SafeAreaView>
        </NavigationContainer>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: 20,
    },
    loginContainer: {
        flex: 1,
        justifyContent: 'center',
        padding: 20,
    },
    signupContainer: {
        flex: 1,
        justifyContent: 'center',
        padding: 20,
    },
    title: {
        fontSize: 24,
        marginBottom: 20,
        textAlign: 'center',
    },
    input: {
        height: 50,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 5,
        marginBottom: 15,
        paddingHorizontal: 10,
    },
});