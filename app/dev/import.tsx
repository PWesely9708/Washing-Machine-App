// app/dev/import.tsx

// Import necessary components and functions
import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import { Alert, Text, TouchableOpacity, View } from "react-native";
import { db } from "../../src/firebase";

// Import the JSON (relative path from this file)
import seed from "../../data.json";

// Map incoming text status -> our defined status values
function normalizeStatus(s: string) {
    const x = s.trim().toLowerCase();
    if (x === "running") {
        return "Running";
    }
    if (x === "available") {
        return "Available";
    }
    if (x === "outofservice" || x === "offline" || x === "oos") {
        return "OutOfService";
    }
    // default to Available if unknown
    return "Available";
}
 
// Define the ImportSeed component
export default function ImportSeed() {
    // Asynchronous functions handle lengthy operations without blocking the main thread
    const run = async () => {
        try {
            // Iterate through each row in the seed data in the JSON file, adding buildings and machines to Firestore database
            for (const row of seed as Array<{ Location: string; machineID: string; Status: string }>) {
                const buildingId = row.Location.trim();
                const machineId = row.machineID.trim();

                const bRef = doc(db, "buildings", buildingId);
                await setDoc(bRef, {
                    name: buildingId,
                    updatedAt: serverTimestamp(),
                },
                { merge: true }
                );

                const mRef = doc(db, "buildings", buildingId, "machines", machineId);
                await setDoc(mRef, {
                    name: `Machine ${machineId}`,
                    type: Number(machineId) % 2 === 0 ? "Dryer" : "Washer", 
                    status: normalizeStatus(row.Status),
                    updatedAt: serverTimestamp(),
                },
                { merge: true }
                );
            }   
            // Notify the user that the import process is complete
            Alert.alert("Import complete", "Buildings and machines have been seeded.");
        } catch (e: any) {
            // Handle import errors
            Alert.alert("Import failed", e?.message ?? "Unknown error");
        }
    };

    // Render the import screen UI
    return (
        <View 
            style={{ flex: 1, backgroundColor: "#111827", alignItems: "center", justifyContent: "center", padding: 24, }}
        >
            <TouchableOpacity 
                onPress={run} 
                style={{ backgroundColor: "#4F46E5", paddingVertical: 12, paddingHorizontal: 24, borderRadius: 10, }}
            >
            <Text 
                // Display the import button text
                style={{ color: "#fff", fontWeight: "700", }}
            >
                Import data.json → Firestore
            </Text>
            </TouchableOpacity>
            <Text 
                // Display instructions for using the import screen
                style={{ color: "#9CA3AF", marginTop: 12, textAlign: "center", }}
            >
                Open this screen once: /dev/import
            </Text>
        </View>
    );
}