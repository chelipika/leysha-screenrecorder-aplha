import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { List, Switch, Button, Divider, Text } from 'react-native-paper';
import RecordingService from '../services/RecordingService';

const DeveloperScreen = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [isRecordingEnabled, setIsRecordingEnabled] = useState(true);

  const toggleRecording = async () => {
    if (isRecording) {
      await RecordingService.stopRecordingSession();
      setIsRecording(false);
    } else {
      await RecordingService.startRecordingSession();
      setIsRecording(true);
    }
  };

  const toggleRecordingEnabled = (enabled) => {
    setIsRecordingEnabled(enabled);
    RecordingService.setRecordingEnabled(enabled);
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.warning}>⚠️ Developer Options</Text>
      
      <List.Section>
        <List.Item
          title="Enable Recording Service"
          description="Turn off to completely disable recording functionality"
          right={() => (
            <Switch
              value={isRecordingEnabled}
              onValueChange={toggleRecordingEnabled}
            />
          )}
        />
        <Divider />
        <View style={styles.buttonContainer}>
          <Button
            mode="contained"
            onPress={toggleRecording}
            style={styles.button}
            disabled={!isRecordingEnabled}
          >
            {isRecording ? 'Stop Test Recording' : 'Start Test Recording'}
          </Button>
        </View>
      </List.Section>

      <Text style={styles.note}>
        Note: Test recording will start immediately and continue until stopped manually.
        This is for testing purposes only and bypasses the normal 15-minute wait period.
      </Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  warning: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 16,
    color: '#ff4444',
  },
  buttonContainer: {
    padding: 16,
  },
  button: {
    marginVertical: 8,
  },
  note: {
    fontSize: 14,
    color: '#666',
    padding: 16,
    fontStyle: 'italic',
  },
});

export default DeveloperScreen; 