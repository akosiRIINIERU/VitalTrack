import React, { useEffect, useState } from 'react';
import { ActivityIndicator, SafeAreaView, StatusBar, StyleSheet, Text, View } from 'react-native';

const SensorDataDisplay = () => {
    // Define the type for sensor data
    type SensorData = {
        temperature: number;
        humidity: number;
        timestamp: string;
    };

    // State variables for data, loading status, and errors
    const [data, setData] = useState<SensorData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // 🛑 IMPORTANT: Replace 'YOUR_LOCAL_IP' with your computer's actual local IP address (e.g., 192.168.1.100)
    // The port must match the one in server.js (3000)
    const API_URL = 'http://192.168.1.2:3000/api/data'; 

    const fetchData = async () => {
        // Only show the loading indicator on the initial fetch, not for every poll
        if (data === null) {
            setLoading(true);
        }
        
        try {
            const response = await fetch(API_URL);
            
            if (!response.ok) {
                throw new Error(`HTTP Error! Status: ${response.status}. Check if Node server is running and IP is correct.`);
            }
            
            const json = await response.json();
            setData(json);
            setError(null); // Clear previous errors
            
        } catch (e) {
            console.error("Failed to fetch data:", e);
            setError(e instanceof Error ? e.message : String(e));
        } finally {
            setLoading(false); // Stop loading regardless of success or failure
        }
    };

    // useEffect for data polling (runs every 5 seconds)
    useEffect(() => {
        // Fetch immediately on mount
        fetchData(); 

        // Set up interval to poll the server
        const intervalId = setInterval(fetchData, 5000); // Poll every 5 seconds

        // Cleanup function: Clear the interval when the component unmounts
        return () => clearInterval(intervalId);
    }, []); // Empty dependency array means it only runs on mount/unmount

    // --- Rendering Logic ---

    if (loading && data === null) {
        return (
            <SafeAreaView style={styles.container}>
                <ActivityIndicator size="large" color="#007bff" />
                <Text style={{ marginTop: 10 }}>Connecting to server...</Text>
            </SafeAreaView>
        );
    }

    if (error) {
        return (
            <SafeAreaView style={styles.container}>
                <Text style={styles.errorText}>❌ Connection Error</Text>
                <Text style={styles.errorDetails}>
                    {error.includes("Failed to fetch") ? 
                        "Cannot reach server. Ensure Node.js server is running and the API_URL IP address is correct." : 
                        error
                    }
                </Text>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" />
            <Text style={styles.header}>🏠 Sensor Data</Text>
            
            {/* Display the latest data */}
            {data ? (
                <View style={styles.card}>
                    <Text style={styles.dataTitle}>Temperature</Text>
                    <Text style={styles.dataValue}>🌡️ {data.temperature}</Text>
                    
                    <View style={styles.separator} />
                    
                    <Text style={styles.dataTitle}>Humidity</Text>
                    <Text style={styles.dataValue}>💧 {data.humidity}</Text>
                    
                    <Text style={styles.metaText}>
                        Last Update: {new Date(data.timestamp).toLocaleTimeString()}
                    </Text>
                </View>
            ) : (
                <Text>No data available.</Text>
            )}
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
    },
    header: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 30,
        color: '#333',
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 25,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 5,
        minWidth: '80%',
        alignItems: 'center',
    },
    dataTitle: {
        fontSize: 16,
        color: '#6c757d',
        marginBottom: 5,
        fontWeight: '600',
    },
    dataValue: {
        fontSize: 48,
        fontWeight: '900',
        color: '#007bff',
        marginBottom: 15,
    },
    separator: {
        height: 1,
        backgroundColor: '#e9ecef',
        width: '100%',
        marginVertical: 15,
    },
    metaText: {
        fontSize: 14,
        color: '#6c757d',
        marginTop: 20,
        textAlign: 'center',
    },
    errorText: {
        fontSize: 22,
        color: 'red',
        fontWeight: 'bold',
        marginBottom: 10,
    },
    errorDetails: {
        color: '#333',
        textAlign: 'center',
        paddingHorizontal: 30,
    }
});

export default SensorDataDisplay;