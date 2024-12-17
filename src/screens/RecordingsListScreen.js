import React, { useState, useEffect } from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { List, IconButton, Menu, Divider } from 'react-native-paper';
import { formatDistanceToNow } from 'date-fns';
import { NativeModules } from 'react-native';

const { ScreenRecorderModule } = NativeModules;

const RecordingsListScreen = () => {
  const [recordings, setRecordings] = useState([]);
  const [sortOrder, setSortOrder] = useState('desc'); // 'desc' for newest first
  const [menuVisible, setMenuVisible] = useState(false);

  useEffect(() => {
    loadRecordings();
  }, []);

  const loadRecordings = async () => {
    try {
      const recordingFiles = await ScreenRecorderModule.getRecordings();
      const recordingsWithMetadata = recordingFiles.map(file => ({
        id: file.path,
        path: file.path,
        name: file.name,
        date: new Date(file.lastModified),
        size: file.size,
      }));

      sortRecordings(recordingsWithMetadata, sortOrder);
      setRecordings(recordingsWithMetadata);
    } catch (error) {
      console.error('Error loading recordings:', error);
    }
  };

  const sortRecordings = (recordingsList, order) => {
    recordingsList.sort((a, b) => {
      if (order === 'desc') {
        return b.date - a.date;
      }
      return a.date - b.date;
    });
  };

  const toggleSortOrder = () => {
    const newOrder = sortOrder === 'desc' ? 'asc' : 'desc';
    setSortOrder(newOrder);
    const newRecordings = [...recordings];
    sortRecordings(newRecordings, newOrder);
    setRecordings(newRecordings);
  };

  const deleteRecording = async (path) => {
    try {
      await ScreenRecorderModule.deleteRecording(path);
      setRecordings(recordings.filter(rec => rec.path !== path));
    } catch (error) {
      console.error('Error deleting recording:', error);
    }
  };

  const playRecording = async (path) => {
    try {
      await ScreenRecorderModule.playRecording(path);
    } catch (error) {
      console.error('Error playing recording:', error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Menu
          visible={menuVisible}
          onDismiss={() => setMenuVisible(false)}
          anchor={
            <IconButton
              icon="sort"
              onPress={() => setMenuVisible(true)}
            />
          }
        >
          <Menu.Item
            onPress={() => {
              toggleSortOrder();
              setMenuVisible(false);
            }}
            title={sortOrder === 'desc' ? 'Oldest First' : 'Newest First'}
          />
        </Menu>
      </View>
      <FlatList
        data={recordings}
        keyExtractor={item => item.path}
        renderItem={({ item }) => (
          <List.Item
            title={item.name}
            description={formatDistanceToNow(item.date, { addSuffix: true })}
            left={props => <List.Icon {...props} icon="video" />}
            right={props => (
              <View style={styles.actions}>
                <IconButton
                  icon="play"
                  onPress={() => playRecording(item.path)}
                />
                <IconButton
                  icon="delete"
                  onPress={() => deleteRecording(item.path)}
                />
              </View>
            )}
          />
        )}
        ItemSeparatorComponent={() => <Divider />}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    padding: 8,
  },
  actions: {
    flexDirection: 'row',
  },
});

export default RecordingsListScreen; 