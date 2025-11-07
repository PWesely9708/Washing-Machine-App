// app/login.tsx

// Import necessary components and functions
import { router } from "expo-router";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useState } from "react";
import { ActivityIndicator, Alert, Image, Text, TextInput, TouchableOpacity, View } from "react-native";
import { auth } from "../src/firebase";

// Define our default input style
const inputStyle = {
    borderWidth: 1,
    borderColor: "#374151",
    backgroundColor: "#1F2937",
    color: "#FFF",
    padding: 14,
    borderRadius: 10,
    marginBottom: 14,
    fontSize: 16,
} as const;

// Define the Login component
export default function Login() {
    // Define state variables for email, password, and busy status, as well as their setter functions
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [busy, setBusy] = useState(false);

    // Asynchronous functions handle lengthy operations without blocking the main thread
    const onLogin = async () => {
        // Verify validity of email and password inputs
        const e = email.trim().toLowerCase();
        if (!e.endsWith("@sdsu.edu")) {
            return Alert.alert("Invalid Email", "Use your @sdsu.edu email.");
        }
        if (password.length < 6) {
            return Alert.alert("Weak password", "Minimum 6 characters.");
        }

        // Indicate that a login operation is in progress
        setBusy(true);

        try {
            // Attempt to sign in the user with the provided email and password
            await signInWithEmailAndPassword(auth, e, password);
            router.replace("/buildings");
        } catch (err: any) {
            // Handle specific error for invalid credentials
            if (err?.code === "auth/invalid-credential") {
                Alert.alert("You have entered invalid email or password.", "Try again");
            } else {
                // Handle other sign-in errors
                Alert.alert("Sign-in failed", err?.message ?? "Try again.");
            }
        } finally {
            // Indicate that the login operation has completed
            setBusy(false);
        }
    };

    // Render the login screen UI
    return (
    <View 
        style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#111827", padding: 24, }}
    >
        <Image 
            // Display the app logo
            source={require("../assets/images/splash-icon.png")} 
            style={{ width: 140, height: 140, marginBottom: 30, resizeMode: "contain", }} 
        />
        <Text 
            // Display the app title
            style={{ fontSize: 26, fontWeight: "700", color: "#FFF", marginBottom: 20, }}
        >
            Laundry Tracker
        </Text>
        <View 
            style={{ width: "100%", }}
        >
            <TextInput
                // Input field for email
                placeholder="Enter your SDSU email"
                placeholderTextColor="#9CA3AF"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                style={inputStyle}
            />
            <TextInput
                // Input field for password
                placeholder="Password"
                placeholderTextColor="#9CA3AF"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                autoCapitalize="none"
                style={inputStyle}
            />
        </View>
        <TouchableOpacity
            // Handle login button press
            onPress={onLogin}
            disabled={busy}
            style={{ 
                backgroundColor: busy ? "#6366F1aa" : "#4F46E5", 
                paddingVertical: 12, borderRadius: 10, alignItems: "center", width: "100%", marginTop: 4,
            }}
        >
            {busy ? <ActivityIndicator color="#fff" /> : 
                <Text 
                    style={{ color: "#FFF", fontWeight: "600", fontSize: 18, }}
                >
                    Sign in
                </Text>
            }
        </TouchableOpacity>
        <TouchableOpacity 
            // Navigate to the registration screen
            onPress={() => router.push("/register")} 
            style={{ paddingVertical: 12, alignItems: "center", width: "100%", }}
        >
            <Text 
                style={{ color: "#9CA3AF", }}
            >
                Create account
            </Text>
        </TouchableOpacity>  
    </View>
  );
}