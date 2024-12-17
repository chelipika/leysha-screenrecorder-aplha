import React, { useState, useEffect } from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { List, Checkbox, Searchbar } from 'react-native-paper';
import RecordingService from '../services/RecordingService';

const AppSelectionScreen = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [installedApps, setInstalledApps] = useState([]);
  const [selectedApps, setSelectedApps] = useState(new Set(RecordingService.getTargetApps()));

  useEffect(() => {
    loadInstalledApps();
  }, []);

  const loadInstalledApps = async () => {
    // You'll need to implement this using native modules
    // For now, we'll use a dummy list
    setInstalledApps([
      { packageName: 'youtube', appName: 'YouTube' },
      { packageName: 'netflix', appName: 'Netflix' },
      { packageName: 'twitter', appName: 'Twitter' },
      // Add more apps...
    ]);
  };

  const toggleApp = async (packageName) => {
    const newSelected = new Set(selectedApps);
    if (newSelected.has(packageName)) {
      newSelected.delete(packageName);
      await RecordingService.removeTargetApp(packageName);
    } else {
      newSelected.add(packageName);
      await RecordingService.addTargetApp(packageName);
    }
    setSelectedApps(newSelected);
  };

  const filteredApps = installedApps.filter(app =>
    app.appName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <Searchbar
        placeholder="Search apps"
        onChangeText={setSearchQuery}
        value={searchQuery}
        style={styles.searchbar}
      />
      <FlatList
        data={filteredApps}
        keyExtractor={item => item.packageName}
        renderItem={({ item }) => (
          <List.Item
            title={item.appName}
            right={() => (
              <Checkbox
                status={selectedApps.has(item.packageName) ? 'checked' : 'unchecked'}
                onPress={() => toggleApp(item.packageName)}
              />
            )}
          />
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchbar: {
    margin: 16,
  },
});

export default AppSelectionScreen; 