// app/machines/[buildingID].tsx

// In expo-router, files defined in brackets (e.g., [buildingID]) are dynamic route segments, meaning they can handle variable values in the URL path.

// Import necessary components and functions
import { useLocalSearchParams } from "expo-router";
import React, { useState } from 'react';
import { Alert, Modal, ScrollView, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// Helper functions
const STATUS_CONFIG: Record<MachineStatus, { text: string; color: string }> = {
    available: { text: 'Available', color: '#10B981' },
    'in-use': { text: 'In Use', color: '#EF4444' },  // Must use quotes for keys with hyphens
    finishing: { text: 'Finishing Soon', color: '#F59E0B' },
    broken: { text: 'Out of Order', color: '#6B7280' },
};
const formatTime = (seconds: number): string => {
    if (seconds <= 0) return '00:00';  // No time left
    const m = Math.floor(seconds / 60);  // Minutes
    const s = seconds % 60;  // Seconds
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;  // Format as MM:SS
};


// Possible machine statuses
type MachineStatus = 'available' | 'in-use' | 'finishing' | 'broken';

// Structure for machine data
interface Machine {
    id: number;
    type: 'washer' | 'dryer';
    status: MachineStatus;
    timer: number;
}

// Structure for laundry room data
interface LaundryRoom {
    id: string;
    name: string;
    // List of machines in the room
    machines: Machine[];
}

// Structure for machine card props
interface MachineCardProps {
    machine: Machine;   // Which machine is selected
    onAction: (machine: Machine) => void;  // When the user interacts with the machine
}

// Struct for the report modoal props
interface ReportModalProps {
    visible: boolean;
    onClose: () => void;  // Close the modal
    onSubmit: (machine: Machine, message: string) => void;  // Callback when submitting a report
    machine: Machine | null;  // The machine being reported
}


// Define the Machines component
export default function Machines() {
    // Retrieve the buildingId from the route parameters (which building was selected)
    const { buildingId } = useLocalSearchParams<{ buildingId: string }>();

    // Define state variables for laundry data, modal visibility, and selected machine, as well as their setter functions
    const [laundryData, setLaundryData] = useState(INITIAL_DATA);
    const [isModalVisible, setModalVisible] = useState(false);
    const [selectedMachine, setSelectedMachine] = useState<Machine | null>(null);

    // Find the selected room based on the buildingId from the route parameters
    const selectedRoom = laundryData.laundryRooms.find(r => r.id === buildingId);

    // Simulate machine timers counting down every second
    React.useEffect(() => {
        const interval = setInterval(() => {
            setLaundryData(prev => ({
                // Update previous data for all machines in the selected building
                laundryRooms: prev.laundryRooms.map(room => room.id === buildingId ? {
                    ...room, machines: room.machines.map(machine => {
                        // If the machine is running, decrement its timer
                        if ((machine.status === "in-use" || machine.status === "finishing") && machine.timer > 0) {
                            const newTimer = machine.timer - 1;
                            let newStatus: MachineStatus = machine.status;

                            // Change status when less than 5 min left (300 seconds)
                            if (newTimer <= 300 && newTimer > 0) newStatus = "finishing";
                            if (newTimer <= 0) return { ...machine, status: "available", timer: 0 };

                            // Return updated machine with new timer and status
                            return { ...machine, timer: newTimer, status: newStatus };
                        }
                        return machine;
                    }),
                } : room),
            }));
        }, 1000);  // Interval of 1 second (1000 milliseconds)

        // Cleanup interval on component unmount or buildingId change
        return () => clearInterval(interval);
    }, [buildingId]);
 
    // Simulate when a user selects a machine to start or report
    const handleAction = (machine: Machine) => {
        if (machine.status === "available") {
            // Set the time for washing or drying cycle (30 or 45 minutes)
            const cycleTime = machine.type === "washer" ? 1800 : 2700;
            // Update the machine status to "in-use" and set the timer
            updateMachine(machine.id, { status: "in-use", timer: cycleTime });
        }
        else {
            // Open the report modal for non-available machines
            setSelectedMachine(machine);
            setModalVisible(true);
        }
    };

    // Update a machine's status and timer
    const updateMachine = (machineId: number, patch: Partial<Machine>) => {
        setLaundryData(prev => ({
            laundryRooms: prev.laundryRooms.map(room => room.id === buildingId ? {
                ...room, machines: room.machines.map(m => m.id === machineId ? { ...m, ...patch } : m),
            } : room),
        }));
    };

    // Report modal submit handler
    const handleReportSubmit = async (machine: Machine, message: string) => {
        console.log(`Reporting machine #${machine.id}: ${message}`);

        // Update machine status to broken
        updateMachine(machine.id, { status: "broken", timer: 0 });

        // Log the report (could be sent to a server in a real app)
        const time = new Date().toLocaleString();
        const reportData = {
            machineId: machine.id,
            machineType: machine.type,
            message: message,
            timestamp: time,
        };

        // For demonstration, we just log it to the console
        // This will later be sent to the firebase backend for storage
        console.log("Report submitted:", reportData);

        // Show success message
        Alert.alert(
            "Report Submitted",
            `Issue reported for ${machine.type} #${machine.id}. Thank you for your feedback!`
        );

        // Close the modal
        setModalVisible(false);
        setSelectedMachine(null);
    };

    // Render the machines screen
    return (
        <SafeAreaView 
            style={styles.container} 
            edges={['top', 'left', 'right', 'bottom']}
        >
            <StatusBar 
                barStyle="light-content" 
            />
            <Text 
                // Display the name of the selected laundry room
                style={{ color: '#FFF', fontSize: 22, fontWeight: '600', padding: 16, }}
            >
                {selectedRoom?.name}
            </Text>
            <ScrollView 
                contentContainerStyle={styles.machinesGrid}
            >
                {selectedRoom?.machines.map(m => (
                    <MachineCard key={m.id} machine={m} onAction={handleAction} />
                ))}
            </ScrollView>
            <ReportModal
                visible={isModalVisible}
                onClose={() => setModalVisible(false)}
                onSubmit={handleReportSubmit}
                machine={selectedMachine}
            />
        </SafeAreaView>
    );
}

/*
    CODE BELOW WILL BE REPLACED WITH FIREBASE AUTHENTICATION
*/
// Mock initial data for laundry rooms and machines
const INITIAL_DATA: { laundryRooms: LaundryRoom[] } = {
    laundryRooms: [{
        id: 'ChapultepecHall',
        name: 'Chapultepec Hall',
        machines: [
            { id: 1, type: 'washer', status: 'available', timer: 0 },
            { id: 2, type: 'washer', status: 'in-use', timer: 1800 },
            { id: 3, type: 'washer', status: 'broken', timer: 0 },
            { id: 4, type: 'washer', status: 'available', timer: 0 },
            { id: 5, type: 'dryer', status: 'in-use', timer: 2700 },
            { id: 6, type: 'dryer', status: 'available', timer: 0 },
            { id: 7, type: 'dryer', status: 'finishing', timer: 240 },
            { id: 8, type: 'dryer', status: 'available', timer: 0 },
        ],
    },
    {
        id: 'HuaxyacacHall',
        name: 'Huaxyacac Hall',
        machines: [
            { id: 9, type: 'washer', status: 'available', timer: 0 },
            { id: 10, type: 'washer', status: 'available', timer: 0 },
            { id: 11, type: 'dryer', status: 'in-use', timer: 1200 },
            { id: 12, type: 'dryer', status: 'broken', timer: 0 },
        ],
    },
    {
        id: 'ZuraHall',
        name: 'Zura Hall',
        machines: [
            { id: 9, type: 'washer', status: 'available', timer: 0 },
            { id: 10, type: 'washer', status: 'available', timer: 0 },
            { id: 11, type: 'dryer', status: 'in-use', timer: 1200 },
            { id: 12, type: 'dryer', status: 'broken', timer: 0 },
        ],
    },
    ],
};
/*
    CODE ABOVE WILL BE REPLACED WITH FIREBASE AUTHENTICATION
*/

// Interact with a machine
const MachineCard = ({ machine, onAction }: MachineCardProps) => {
    const config = STATUS_CONFIG[machine.status];
    // Disable action for broken machines
    const isActionDisabled = machine.status === 'broken';

    // Render the machine card UI
    return (
        <View 
            style={styles.machineCard}
        >
            <View 
                style={[styles.machineStatusIndicator, { backgroundColor: config.color }, ]} 
            />
            <View 
                style={styles.machineInfo}
            >
                <Text 
                    // Display machine type and ID
                    style={styles.machineType}
                >
                    {machine.type.toUpperCase()} #{machine.id}
                </Text>
                <Text 
                    // Display machine status
                    style={[styles.machineStatusText, { color: config.color }, ]}
                >
                    {config.text}
                </Text>
                { /* Display machine timer if in use or finishing */ }
                {(machine.status === 'in-use' || machine.status === 'finishing') && (<Text style={styles.machineTimer}>{formatTime(machine.timer)}</Text>)}
            </View>
            <TouchableOpacity
                style={[styles.actionButton, isActionDisabled && styles.actionButtonDisabled]}
                onPress={() => onAction(machine)}
                disabled={isActionDisabled}
            >
                <Text 
                    // Display action button text based on machine status
                    style={styles.actionButtonText}
                >
                    {machine.status === 'available' ? 'Start' : 'Report'}
                </Text>
            </TouchableOpacity>
        </View>
    );
};

// Exercise a user report on a machine
const ReportModal = ({ visible, onClose, onSubmit, machine }: ReportModalProps) => {
    // Define state for the report message input and its setter function
    const [reportMessage, setReportMessage] = useState('');

    // Handle the submit action
    const handleSubmit = () => {
        if (machine) {
            onSubmit(machine, reportMessage);  // Call the submit callback
            setReportMessage('');  // Reset the text box
            onClose();  // Close the modal
        }
    };

    // Render the report modal UI
    return (
        <Modal
            visible={visible}
            transparent={true}
            animationType="fade"
        >
            <View 
                style={styles.modalBackdrop}
            >
                <View 
                    style={styles.modalContainer}
                >
                    <Text 
                        // Display the modal title with the machine ID
                        style={styles.modalTitle}
                    >
                        Report Machine #{machine?.id}
                    </Text>
                    <Text 
                        // Display the modal subtitle
                        style={styles.modalSubtitle}
                    >
                        Please describe the issue.
                    </Text>
                    <TextInput
                        // Input for the report message
                        style={styles.modalInput}
                        placeholder="e.g., 'not spinning', 'won't turn on'"
                        placeholderTextColor="#9CA3AF"
                        multiline
                        value={reportMessage}
                        onChangeText={setReportMessage}
                    />
                    <View 
                        style={styles.modalActions}
                    >
                        <TouchableOpacity 
                            style={[styles.modalButton, styles.modalButtonCancel]} 
                            onPress={onClose}
                        >
                            <Text 
                                // Display the cancel button text
                                style={styles.modalButtonText}
                            >
                                Cancel
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity 
                            style={[styles.modalButton, styles.modalButtonSubmit]} 
                            onPress={handleSubmit}
                        >
                            <Text 
                                // Display the submit button text
                                style={styles.modalButtonText}
                            >
                                Submit
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
};


// Define styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#111827',
    },
    machinesGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'flex-start',
        padding: 10,
    },
    machineCard: {
        width: '46%',
        backgroundColor: '#1F2937',
        borderRadius: 12,
        padding: 15,
        margin: '2%',
        position: 'relative',
        overflow: 'hidden',
    },
    machineStatusIndicator: {
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0,
        width: 6,
    },
    machineInfo: {
        marginLeft: 10,
        alignItems: 'flex-start',
    },
    machineType: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#FFF',
    },
    machineStatusText: {
        fontSize: 14,
        fontWeight: '600',
        marginTop: 4,
    },
    machineTimer: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#E5E7EB',
        marginTop: 8,
    },
    actionButton: {
        marginTop: 15,
        backgroundColor: '#4F46E5',
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 8,
        alignSelf: 'flex-start',
        marginLeft: 10,
    },
    actionButtonDisabled: {
        backgroundColor: '#4B5563',
    },
    actionButtonText: {
        color: '#FFF',
        fontWeight: '600',
        fontSize: 14,
    },
    modalBackdrop: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContainer: {
        width: '90%',
        backgroundColor: '#1F2937',
        borderRadius: 12,
        padding: 20,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#FFF',
        textAlign: 'center',
    },
    modalSubtitle: {
        fontSize: 14,
        color: '#9CA3AF',
        textAlign: 'center',
        marginTop: 8,
        marginBottom: 20,
    },
    modalInput: {
        backgroundColor: '#374151',
        borderRadius: 8,
        color: '#FFF',
        padding: 15,
        height: 100,
        textAlignVertical: 'top',
        fontSize: 16,
    },
    modalActions: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20,
    },
    modalButton: {
        flex: 1,
        padding: 12,
        borderRadius: 8,
        alignItems: 'center',
    },
    modalButtonCancel: {
        backgroundColor: '#4B5563',
        marginRight: 10,
    },
    modalButtonSubmit: {
        backgroundColor: '#4F46E5',
    },
    modalButtonText: {
        color: '#FFF',
        fontWeight: 'bold',
    },
});