import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    Switch,
    Button,
    Image,
    Platform, Alert, Modal
} from 'react-native';
import Slider from '@react-native-community/slider';
import * as ImagePicker from 'expo-image-picker';
import { useNavigation } from '@react-navigation/native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { LinearGradient } from 'expo-linear-gradient';
import Checkbox from 'expo-checkbox';

const termsOfServiceText = `
MoneySplit - Terms of Service

1. Acceptance of Terms
By accessing or using MoneySplit, you agree to be bound by these Terms of Service. If you do not agree with any part of the terms, you may not access the platform.

2. Description of Service
MoneySplit is a group expense tracking application designed to allow users to split bills, track shared expenses, and settle debts easily with friends, roommates, or colleagues.

3. User Accounts
- You must provide truthful and accurate information when registering.
- Users are solely responsible for maintaining the confidentiality of their login credentials.
- You agree to notify MoneySplit of any unauthorized use or security breach of your account.

4. User Conduct
You agree not to:
- Impersonate another person or entity.
- Post harmful, offensive, or illegal content.
- Use the platform for harassment, fraud, or to violate any laws.
- Attempt to bypass MoneySplit’s verification, filters, or policies.

5. Expense Content
- All expense details, including descriptions and amounts, must be user-generated and accurate.
- MoneySplit is not responsible for the accuracy of user-submitted information.

6. Limited Liability
MoneySplit provides a platform for tracking and splitting expenses and cannot be held liable for disputes, inaccurate calculations, or off-platform agreements. Use at your own discretion.

7. Data Privacy & Legal Compliance
MoneySplit complies with applicable privacy laws.
- Users have the right to request data deletion.
- For more details, refer to our Privacy Policy.

8. Modification of Terms
MoneySplit reserves the right to modify these Terms at any time. Continued use of the service after changes indicates acceptance of the updated terms.

9. Governing Law
These Terms shall be governed by and construed in accordance with the laws of the State of California, without regard to its conflict of law provisions.

10. Contact Information
For questions or legal concerns, please contact us at:
Email: legal@MoneySplitapp.com
`;

export default function AuthScreen() {
    const navigation = useNavigation();
    const [mode, setMode] = useState('login');

    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const [agreed, setAgreed] = useState(false);

    const [termsVisible, setTermsVisible] = useState(false);

    const validateRegister = () => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            Alert.alert('Invalid Email', 'Please enter a valid email address.');
            return false;
        }

        if (password.length < 6) {
            Alert.alert('Invalid Password', 'Password must be at least 6 characters long.');
            return false;
        }
        return true;
    };

    const toggleTermsModal = () => {
        setTermsVisible(!termsVisible);
    };

    const handleLogin = async () => {
        console.log('Login attempted with:', { email, password });

        if (email === 'test@example.com' && password === 'password') {
            Alert.alert("Login Successful", "Welcome back!");
            navigation.replace("Home");
        } else {
            Alert.alert("Login Failed", "Invalid email or password.");
        }
    };

    const handleRegister = async () => {
        if (!validateRegister()) return;

        if (password !== confirmPassword) {
            Alert.alert("Error", "Passwords do not match.");
            return;
        }

        console.log('Registration attempted with:', { fullName, email, password });

        Alert.alert("Success", "You have successfully registered!");
        navigation.replace("Home");
    };

    return (
        <LinearGradient colors={['#7cb342', '#33691e']} style={styles.container}>
            <ScrollView style={styles.scrollContainer} contentContainerStyle={{ paddingBottom: 100 }}>
                <Image source={require('../assets/logo.png')} style={styles.logo} />
                <Text style={styles.header}>MoneySplit</Text>

                <View style={styles.tabContainer}>
                    <TouchableOpacity
                        style={[styles.tab, mode === 'login' && styles.activeTab]}
                        onPress={() => setMode('login')}
                    >
                        <Text style={[styles.tabText, mode === 'login' && styles.activeTabText]}>Login</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.tab, mode === 'register' && styles.activeTab]}
                        onPress={() => setMode('register')}
                    >
                        <Text style={[styles.tabText, mode === 'register' && styles.activeTabText]}>Register</Text>
                    </TouchableOpacity>
                </View>

                {mode === 'login' ? (
                    <View style={styles.formContainer}>
                        <TextInput
                            style={styles.input}
                            placeholder="Email"
                            value={email}
                            onChangeText={setEmail}
                            placeholderTextColor="#558b2f"
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Password"
                            secureTextEntry
                            value={password}
                            onChangeText={setPassword}
                            placeholderTextColor="#558b2f"
                        />
                        <TouchableOpacity style={styles.button} onPress={handleLogin}>
                            <Text style={styles.buttonText}>Login</Text>
                        </TouchableOpacity>
                    </View>
                ) : (
                    <View style={styles.formContainer}>
                        <Text style={styles.section}>Account Info</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Full Name"
                            value={fullName}
                            onChangeText={setFullName}
                            placeholderTextColor="#558b2f"
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Email"
                            value={email}
                            onChangeText={setEmail}
                            placeholderTextColor="#558b2f"
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Password"
                            placeholderTextColor="#558b2f"
                            secureTextEntry
                            value={password}
                            onChangeText={setPassword}
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Confirm Password"
                            placeholderTextColor="#558b2f"
                            secureTextEntry
                            value={confirmPassword}
                            onChangeText={setConfirmPassword}
                        />

                        <View style={styles.termsContainer}>
                            <Checkbox value={agreed} onValueChange={setAgreed} color={agreed ? '#4630EB' : undefined} />
                            <TouchableOpacity onPress={toggleTermsModal}>
                                <Text style={styles.termsText}>I agree to Terms of Service</Text>
                            </TouchableOpacity>
                        </View>

                        <TouchableOpacity
                            style={[styles.button, !(agreed) && { opacity: 0.5 }]}
                            disabled={!agreed}
                            onPress={handleRegister}
                        >
                            <Text style={styles.buttonText}>Register</Text>
                        </TouchableOpacity>
                    </View>
                )}

                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={termsVisible}
                    onRequestClose={toggleTermsModal}
                >
                    <View style={styles.centeredView}>
                        <View style={styles.modalView}>
                            <Text style={styles.modalTitle}>Terms of Service</Text>
                            <ScrollView style={styles.termsTextContainer}>
                                <Text style={styles.termsTextContent}>{termsOfServiceText}</Text>
                            </ScrollView>
                            <TouchableOpacity
                                style={[styles.button, { backgroundColor: 'rgba(74, 20, 140, 0.9)' }]}
                                onPress={toggleTermsModal}
                            >
                                <Text style={styles.buttonText}>Close</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>
            </ScrollView>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollContainer: {
        flex: 1,
        padding: 20,
    },
    logo: {
        width: 100,
        height: 100,
        resizeMode: 'contain',
        alignSelf: 'center',
        marginBottom: 10,
    },
    header: {
        fontSize: 28,
        fontWeight: 'bold',
        color: 'white',
        textAlign: 'center',
        marginBottom: 20,
    },
    tabContainer: {
        flexDirection: 'row',
        backgroundColor: 'rgba(255,255,255,0.2)',
        borderRadius: 12,
        overflow: 'hidden',
        marginBottom: 30,
    },
    tab: {
        flex: 1,
        paddingVertical: 12,
        alignItems: 'center',
    },
    tabText: {
        color: 'white',
        fontWeight: '600',
    },
    activeTab: {
        backgroundColor: 'rgba(0,0,0,0.3)',
    },
    activeTabText: {
        color: 'white',
    },
    formContainer: {
        marginBottom: 20,
    },
    input: {
        backgroundColor: 'rgba(255,255,255,0.8)',
        borderRadius: 8,
        color: '#33691e',
        paddingHorizontal: 12,
        paddingVertical: Platform.OS === 'ios' ? 12 : 8,
        marginBottom: 10,
    },
    section: {
        color: '#c5e1a5',
        fontSize: 18,
        marginTop: 20,
        marginBottom: 10,
    },
    switchRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginVertical: 10,
    },
    button: {
        backgroundColor: '#8bc34a',
        padding: 14,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 20,
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 16,
    },
    genderContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
        marginBottom: 10,
    },
    genderOption: {
        backgroundColor: 'rgba(255,255,255,0.1)',
        borderWidth: 1,
        borderColor: '#64b5f6',
        borderRadius: 20,
        paddingHorizontal: 12,
        paddingVertical: 6,
        marginRight: 8,
        marginBottom: 8,
    },
    genderOptionSelected: {
        backgroundColor: '#64b5f6',
    },
    genderText: {
        color: '#fff',
    },
    genderTextSelected: {
        color: '#000',
        fontWeight: 'bold',
    },
    termsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    termsText: {
        color: '#fff',
        marginLeft: 10,
        textDecorationLine: 'underline',
    },
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
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
        width: '90%',
        height: '80%',
    },
    modalTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 15,
        textAlign: 'center',
    },
    termsTextContainer: {
        width: '100%',
        marginBottom: 20,
    },
    termsTextContent: {
        fontSize: 14,
        textAlign: 'left',
    },
});
