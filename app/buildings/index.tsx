// app/buildings/index.tsx

// In expo-router, files defined as "index" serve as the default screen for their directory.

// Import necessary components and functions
import { Href, router } from "expo-router";
import { Button, FlatList, Text, View } from "react-native";

/*
    CODE BELOW WILL BE REPLACED WITH FIREBASE AUTHENTICATION
*/ 
// Define a list of buildings for the user to chose from
const buildings = [
    { id: "ChapultepecHall", name: "Chapultepec Hall" },
    { id: "HuaxyacacHall", name: "Huaxyacac Hall" },
    { id: "ZuraHall", name: "Zura Hall" },
];
/*
    CODE ABOVE WILL BE REPLACED WITH FIREBASE AUTHENTICATION
*/  

// Define the Buildings component
export default function Buildings() {

    // Render the list of buildings as buttons
    return (
        <View 
            style={{ flex: 1, padding: 16, }}
        >
            <Text 
                style={{ fontSize: 18, marginBottom: 12, }}
            >
                Select a building
            </Text>
            <FlatList
                // List all of the buildings
                data={buildings}
                keyExtractor={(b) => b.id}
                ItemSeparatorComponent={() => <View style={{ height: 8, }} />}
                renderItem={({ item }) => (
                    <Button
                        title={item.name}
                        // Redirect the user to the machines screen for the selected building
                        onPress={() =>
                            router.push(`/machines/${item.id}` as Href)
                        }
                    />
                )}
            />
        </View>
    );
}