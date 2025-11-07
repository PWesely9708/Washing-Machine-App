// app/index.tsx

// In expo-router, files defined as "index" serve as the default screen for their directory.

// Import necessary components and functions
import { router } from "expo-router";
import { useEffect } from "react";

export default function Index() {
    // Runs once the component is mounted (when index is first loaded)
    useEffect(() => {
        // Redirect the user to the login screen
        router.replace("/login");
    }, []);
    
    // Render nothing as this screen only serves to redirect
    return null;
}