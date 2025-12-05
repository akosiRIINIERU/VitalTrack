// src/screens/DashboardPage.js
import { useNavigation } from '@react-navigation/native';
import { useCallback, useEffect, useState } from 'react';
import { RefreshControl, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import MapView, { Marker } from 'react-native-maps';

// ⚠️ CRITICAL: Replace this with your Permanent Public URL from Stage 2.2
const API_URL = 'https://YOUR_PERMANENT_API_DOMAIN/api/getLatestSensorData';

const DashboardPage = () => {
  const navigation = useNavigation();
  const [latestData, setLatestData] = useState({
    temperature: '...',
    humidity: '...',
    status: 'Loading',
  });
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [workerLocations, setWorkerLocations] = useState([
      // Placeholder data for the map
      { id: '01', latlng: { latitude: 10.3157, longitude: 123.8854 }, status: 'Green' },
      { id: '12', latlng: { latitude: 10.3167, longitude: 123.8864 }, status: 'Yellow' },
      { id: '27', latlng: { latitude: 10.3147, longitude: 123.8874 }, status: 'Red' },
  ]);

  // Helper to determine status based on ESP32 logic (>38.0 is Danger)
  const getStatusColor = (temp) => {
    const tempValue = parseFloat(temp);
    if (isNaN(tempValue)) return '#333';
    if (tempValue > 38.0) return 'red';   // Danger
    if (tempValue > 35.0) return 'orange'; // Moderate
    return 'green';                      // Safe
  };

  const fetchData = async () => {
    try {
      const response = await fetch(API_URL);
      const data = await response.json(); // Data expected: { temp: 36.5, humidity: 55.2 }
      
      const newTemp = data.temp ? data.temp.toFixed(1) : 'N/A';
      const newHum = data.humidity ? data.humidity.toFixed(1) : 'N/A';

      setLatestData({
        temperature: newTemp,
        humidity: newHum,
        status: newTemp > 38.0 ? 'Danger' : (newTemp > 35.0 ? 'Moderate' : 'Safe'),
      });

    } catch (error) {
      console.error("Failed to fetch sensor data:", error);
      setLatestData(prev => ({ ...prev, status: 'Error' }));
    }
  };

  // Setup auto-refresh and initial load
  useEffect(() => {
    fetchData(); 
    const intervalId = setInterval(fetchData, 15000); // Refresh every 15 seconds
    return () => clearInterval(intervalId); // Cleanup
  }, []);

  const onRefresh = useCallback(async () => {
    setIsRefreshing(true);
    await fetchData();
    setIsRefreshing(false);
  }, []);

  const statusColor = getStatusColor(latestData.temperature);

  return (
    <SafeAreaView style={dashboardStyles.container}>
      <ScrollView
        contentContainerStyle={dashboardStyles.scrollContent}
        refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />}
      >
        <View style={dashboardStyles.header}>
            <Text style={dashboardStyles.appName}>VitalTrack</Text>
            {/* Menu Icon to navigate to Settings */}
            <TouchableOpacity onPress={() => navigation.navigate('Settings')}>
                <Text style={{ fontSize: 30 }}>☰</Text>
            </TouchableOpacity>
        </View>

        {/* 1. Total Workers Section */}
        <View style={dashboardStyles.card}>
          <Text style={dashboardStyles.cardTitle}>Total Workers</Text>
          <View style={dashboardStyles.statsRow}>
            <Text style={dashboardStyles.statValue}>42</Text>
            <Text style={dashboardStyles.statValue}>38</Text>
            <Text style={dashboardStyles.statValue}>2</Text>
          </View>
          <View style={dashboardStyles.statsRow}>
            <Text style={dashboardStyles.statLabel}>Workers</Text>
            <Text style={dashboardStyles.statLabel}>Active Minds</Text>
            <Text style={dashboardStyles.statLabel}>Alerts</Text>
          </View>
        </View>

        {/* 2. Current Device State (Live ESP32 Data) */}
        <View style={dashboardStyles.card}>
          <Text style={dashboardStyles.cardTitle}>Current Device State (Worker 01)</Text>
          <View style={dashboardStyles.deviceStateRow}>
            <Text style={dashboardStyles.deviceStateValue}>
              Temp: {latestData.temperature} °C
            </Text>
            <Text style={dashboardStyles.deviceStateValue}>
              Humidity: {latestData.humidity} %
            </Text>
          </View>
          <View style={dashboardStyles.statusIndicatorRow}>
            <View style={[dashboardStyles.statusDot, { backgroundColor: statusColor }]} />
            <Text style={[dashboardStyles.statusText, { color: statusColor }]}>
              {latestData.status.toUpperCase()}
            </Text>
          </View>
        </View>

        {/* 3. Live Map */}
        <View style={dashboardStyles.card}>
          <Text style={dashboardStyles.cardTitle}>Live Map</Text>
          <MapView
            style={dashboardStyles.map}
            initialRegion={{
              latitude: 10.3157, // Placeholder for Cebu City
              longitude: 123.8854, 
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            }}
          >
            {/* Rendering Markers based on status */}
            {workerLocations.map(marker => (
                <Marker
                    key={marker.id}
                    coordinate={marker.latlng}
                    title={`Worker ${marker.id}`}
                    pinColor={marker.status.toLowerCase()} // Green, Yellow, Red
                />
            ))}
          </MapView>
        </View>
        
        {/* 4. Recents Alerts Timeline */}
        <View style={dashboardStyles.card}>
          <Text style={dashboardStyles.cardTitle}>Recents Alerts Timeline</Text>
          {/* Use FlatList or map function for a real list */}
          <Text style={dashboardStyles.timelineItem}>10:32 AM - Worker 27 fall detected (Zone C)</Text>
          <Text style={dashboardStyles.timelineItem}>09:46 AM - Worker 12 temp &gt; 30°C</Text>
          <Text style={dashboardStyles.timelineItem}>08:15 AM - Worker 05 device signal lost</Text>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
};

// ... (Styles for DashboardPage)
const dashboardStyles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FBEBEB' },
  scrollContent: { padding: 15 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 10, marginBottom: 10 },
  appName: { fontSize: 24, fontWeight: 'bold' },
  card: { backgroundColor: '#FFFFFF', borderRadius: 8, padding: 15, marginBottom: 15, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 2, },
  cardTitle: { fontSize: 16, fontWeight: '600', marginBottom: 10 },
  statsRow: { flexDirection: 'row', justifyContent: 'space-around', marginBottom: 5 },
  statValue: { fontSize: 28, fontWeight: 'bold', width: '33%', textAlign: 'center' },
  statLabel: { fontSize: 12, color: '#666', width: '33%', textAlign: 'center' },
  deviceStateRow: { flexDirection: 'row', justifyContent: 'space-around', paddingVertical: 10 },
  deviceStateValue: { fontSize: 16, fontWeight: '500' },
  statusIndicatorRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingTop: 10 },
  statusDot: { width: 10, height: 10, borderRadius: 5, marginRight: 8 },
  statusText: { fontSize: 16, fontWeight: 'bold' },
  map: { height: 200, borderRadius: 8, marginBottom: 10 },
  timelineItem: { fontSize: 14, paddingVertical: 5, borderBottomWidth: 1, borderBottomColor: '#eee' }
});

export default DashboardPage;