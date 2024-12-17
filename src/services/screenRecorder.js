import { NativeModules, Platform } from 'react-native';

const { ScreenRecorderModule } = NativeModules;

export const startRecording = async () => {
  try {
    if (Platform.OS === 'android') {
      await ScreenRecorderModule.startRecording();
    } else {
      // iOS implementation
      // You'll need to implement this using ReplayKit
    }
  } catch (error) {
    console.error('Error starting recording:', error);
    throw error;
  }
};

export const stopRecording = async () => {
  try {
    if (Platform.OS === 'android') {
      const videoPath = await ScreenRecorderModule.stopRecording();
      return videoPath;
    } else {
      // iOS implementation
    }
  } catch (error) {
    console.error('Error stopping recording:', error);
    throw error;
  }
}; 