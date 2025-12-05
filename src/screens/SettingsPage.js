// src/screens/SettingsPage.js
import React, { useContext, useState } from 'react';
import { SafeAreaView, StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native';

const AuthContext = React.createContext(null);

const SettingsPage = ({ navigation }) => {
  const { signOut } = useContext(AuthContext);
  const [isPairingEnabled, setPairingEnabled] = useState(false);
  const [isBrightnessMax, setBrightnessMax] = useState(true);
  const [isHapticEnabled, setHapticEnabled] = useState(true);

  return (
    <SafeAreaView style={settingsStyles.container}>
      <ScrollView contentContainerStyle={settingsStyles.scrollContent}>
        <Text style={settingsStyles.title}>Settings</Text>

        {/* Helmet Group */}
        <View style={settingsStyles.groupCard}>
          <Text style={settingsStyles.groupTitle}>Helmet</Text>
          <View style={settingsStyles.row}>
            <Text style={settingsStyles.label}>Pair Helmet</Text>
            <Switch
              onValueChange={setPairingEnabled}
              value={isPairingEnabled}
            />
          </View>
          <TouchableOpacity style={settingsStyles.row} onPress={() => Alert.alert('Firmware', 'Checking for updates...')}>
            <Text style={settingsStyles.label}>Firmware Updates</Text>
            <Text style={settingsStyles.chevron}>{`>`}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={settingsStyles.row} onPress={() => Alert.alert('SOS', 'Edit contact info.')}>
            <Text style={settingsStyles.label}>SOS Contact</Text>
            <Text style={settingsStyles.chevron}>{`>`}</Text>
          </TouchableOpacity>
        </View>

        {/* Displays Group */}
        <View style={settingsStyles.groupCard}>
          <Text style={settingsStyles.groupTitle}>Displays</Text>
          <View style={settingsStyles.row}>
            <Text style={settingsStyles.label}>Brightness</Text>
            <Switch
              onValueChange={setBrightnessMax}
              value={isBrightnessMax}
            />
          </View>
          <View style={settingsStyles.row}>
            <Text style={settingsStyles.label}>Haptic Alerts</Text>
            <Switch
              onValueChange={setHapticEnabled}
              value={isHapticEnabled}
            />
          </View>
        </View>

        {/* Log Out Button */}
        <TouchableOpacity style={settingsStyles.logOutButton} onPress={signOut}>
          <Text style={settingsStyles.logOutText}>Log Out</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

// ... (Styles for SettingsPage)
const settingsStyles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FBEBEB' },
  scrollContent: { padding: 20 },
  title: { fontSize: 30, fontWeight: 'bold', marginBottom: 30, alignSelf: 'center' },
  groupCard: { backgroundColor: '#FFFFFF', borderRadius: 10, padding: 15, marginBottom: 25 },
  groupTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 15 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#eee' },
  label: { fontSize: 16 },
  chevron: { fontSize: 16, color: '#999' },
  logOutButton: { backgroundColor: '#FFECF0', padding: 15, borderRadius: 10, alignItems: 'center', marginTop: 30 },
  logOutText: { fontSize: 18, fontWeight: 'bold', color: '#333' }
});

export default SettingsPage;    