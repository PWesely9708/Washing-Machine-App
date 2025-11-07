// app/register.tsx

// Import necessary components and functions
import { router } from "expo-router";
import { createUserWithEmailAndPassword } from "firebase/auth";
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

// Define the Register component
export default function Register() {
  // Define state variables for email, password, confirm password, and busy status, as well as their setter functions
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [pw2, setPw2] = useState("");
  const [busy, setBusy] = useState(false);

  // Asynchronous functions handle lengthy operations without blocking the main thread
  const onRegister = async () => {
      const e = email.trim().toLowerCase();

      // Validate email and password inputs
      if (!e.endsWith("@sdsu.edu"))
          return Alert.alert("Invalid Email", "Please use your @sdsu.edu address.");
      if (pw.length < 6)
          return Alert.alert("Weak password", "Password must be at least 6 characters.");
      if (pw !== pw2)
          return Alert.alert("Password mismatch", "Your passwords do not match.");

      // Indicate that a registration operation is in progress
      setBusy(true);

      try {
          // Attempt to create a new user with the provided email and password
          await createUserWithEmailAndPassword(auth, e, pw);
          Alert.alert("Success", "Account created successfully!");
          // Redirect the user to the buildings screen
          router.replace("/buildings");
      } catch (err: any) {
          // Handle registration errors
          Alert.alert("Registration failed", err?.message ?? "Please try again.");
      } finally {
          // Indicate that the registration operation has completed
          setBusy(false);
      }
  }; 

  // Render the registration screen
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
            // Display the screen title
            style={{ fontSize: 26, fontWeight: "700", color: "#FFF", marginBottom: 20, }}
        >
            Create Account
        </Text>
        <View 
            style={{ width: "100%", }}
        >
            <TextInput
                // Email input field
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
                // Password input field
                placeholder="Password"
                placeholderTextColor="#9CA3AF"
                value={pw}
                onChangeText={setPw}
                secureTextEntry
                autoCapitalize="none"
                style={inputStyle}
            />
            <TextInput
                // Confirm password input field
                placeholder="Confirm password"
                placeholderTextColor="#9CA3AF"
                value={pw2}
                onChangeText={setPw2}
                secureTextEntry
                autoCapitalize="none"
                style={inputStyle}
            />
        </View>
        <TouchableOpacity
            // Handle register button press
            onPress={onRegister}
            disabled={busy}
            style={{
                backgroundColor: busy ? "#6366F1aa" : "#4F46E5",
                paddingVertical: 12, borderRadius: 10, alignItems: "center", width: "100%", marginTop: 8,
            }}
        >
            {busy ? ( <ActivityIndicator color="#fff" /> ) : (
                <Text 
                    style={{ color: "#FFF", fontWeight: "600", fontSize: 18, }}
                >
                    Create Account
                </Text>
            )}
        </TouchableOpacity>
        <TouchableOpacity
            // Navigate to the login screen
            onPress={() => router.replace("/login")}
            style={{ paddingVertical: 12, alignItems: "center", width: "100%", }}
        >
            <Text 
                style={{ color: "#9CA3AF", }}
            >
                Already have an account? Sign in
            </Text>
        </TouchableOpacity>
        <TouchableOpacity
            // Navigate to the import screen for development purposes
            onPress={() => router.push("/dev/import")}
            style={{ marginTop: 16, padding: 12, backgroundColor: "#4F46E5", borderRadius: 8, }}
        >
            <Text 
                style={{ color: "#fff", fontWeight: "600", }}
            >
                Go to Import Screen
            </Text>
        </TouchableOpacity>
    </View>
  );
}