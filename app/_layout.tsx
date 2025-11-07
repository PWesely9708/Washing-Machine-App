// app/_layout.tsx

// In expo-router, files defined as "_layout" serve as layout wrappers for all nested screens under their directory.

// Import necessary components and functions
import { Stack, router, usePathname } from "expo-router";
import { onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from "react";
import { auth } from "../src/firebase";
import SignOutButton from "./SignOutButton";

// Define the root layout component for our directory
export default function RootLayout() {
    // Define our path
    const path = usePathname();
    // Set ready state to false and define function setReady to update it
    const [ready, setReady] = useState(false);

    // Runs once the component is mounted (when layout is first loaded) and whenever the path changes
    useEffect(() => {
        // Called whenever the authentication state changes (log in / log out)
        const unsub = onAuthStateChanged(auth, (user) => {
            // Mark the app as ready once we have an auth state
            setReady(true);
            // Create a list of public routes that do not require authentication
            const publicRoutes = ["/login", "/register", "/dev/import"];
            // Check if the current path is a public route
            const atPublic = publicRoutes.some((p) => path?.startsWith(p));
            // No user, redirect them to user log in screen
            if (!user && !atPublic) {
              router.replace("/login");
            } 
            // User is logged in, redirect them to the buildings screen
            else if (user && atPublic) {
              router.replace("/buildings");
            }
        });
        // Return the unsubscribe function to clean up the listener when the component unmounts or path changes
        return unsub;
    }, [path]);

    // If the app is not ready, return null (render nothing)
    if (!ready) {
        return null;
    }
 
    // If the app is ready, render the stack navigator with our screens
    return (
        <Stack
            screenOptions={{
                // Set header styles for all screens
                headerStyle: { backgroundColor: "#111827" },
                headerTintColor: "#fff",
                // Add the sign out button to the header on all screens
                headerRight: () => <SignOutButton/>,
            }}
        >
            {/* Define our screens */}
            <Stack.Screen 
                name="login" 
                options={{ headerShown: false, }} 
            />
            <Stack.Screen 
                name="register" 
                options={{ headerShown: false, }} 
            />
            <Stack.Screen 
                name="buildings/index" 
                // The back button is not visible on the buildings screen
                options={{ headerBackVisible: false, title: "Buildings", }} 
            />
            <Stack.Screen 
                name="machines/[buildingId]" 
                options={{ title: "Machines", }} 
            />
        </Stack>
    );
}