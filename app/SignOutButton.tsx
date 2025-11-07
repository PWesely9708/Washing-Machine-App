// SignOutButton.tsx

// Import necessary components and functions
import { router } from "expo-router";
import { signOut } from "firebase/auth";
import { Alert, Text, TouchableOpacity } from "react-native";
import { auth } from "../src/firebase";

// Define the SignOutButton component
export default function SignOutButton() {

    // Asynchronous functions handle lengthy operations without blocking the main thread
    const onPress = async () => {
        try {
            // Attempt to sign out the user and redirect to the login screen
            await signOut(auth);
            router.replace("/login");
        } catch (e: any) {
            // Handle sign-out errors
            Alert.alert("Logout failed", e?.message ?? "Try again.");
        } finally {
            // Ensure the user is redirected to the login screen
            router.replace("/login");
        }
    };

    // Render the sign out button
    return (
        <TouchableOpacity 
            onPress={onPress} 
            style={{ paddingHorizontal: 12, paddingVertical: 8, }}
        >
            <Text 
                style={{ color: "#fff", fontWeight: "600", }}
            >
                Sign Out
            </Text>
        </TouchableOpacity>
    );
} 