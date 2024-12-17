import { AppState } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { startRecording, stopRecording } from './screenRecorder';

class RecordingService {
  constructor() {
    this.isRecording = false;
    this.recordingTimer = null;
    this.appCheckTimer = null;
    this.targetApps = new Set(['youtube']);
    this.currentApp = null;
    this.timeInApp = 0;
    this.RECORD_DURATION = 2 * 60 * 1000; // 2 minutes in milliseconds
    this.INTERVAL_DURATION = 15 * 60 * 1000; // 15 minutes in milliseconds
    this.isEnabled = true; // New property for developer toggle
  }

  async init() {
    // Load saved target apps
    try {
      const savedApps = await AsyncStorage.getItem('targetApps');
      if (savedApps) {
        this.targetApps = new Set(JSON.parse(savedApps));
      }
    } catch (error) {
      console.error('Error loading target apps:', error);
    }

    // Start monitoring app state
    AppState.addEventListener('change', this.handleAppStateChange);
  }

  handleAppStateChange = async (nextAppState) => {
    if (nextAppState === 'active') {
      this.startAppTracking();
    } else {
      this.stopAppTracking();
    }
  };

  startAppTracking = () => {
    // Check current app every second
    this.appCheckTimer = setInterval(async () => {
      const currentApp = await this.getCurrentApp(); // You'll need to implement this using native modules
      
      if (this.targetApps.has(currentApp)) {
        this.timeInApp += 1000;
        
        // Start recording after 15 minutes
        if (this.timeInApp >= this.INTERVAL_DURATION && !this.isRecording) {
          this.startRecordingSession();
        }
      } else {
        this.timeInApp = 0;
      }
    }, 1000);
  };

  stopAppTracking = () => {
    if (this.appCheckTimer) {
      clearInterval(this.appCheckTimer);
    }
    if (this.isRecording) {
      this.stopRecordingSession();
    }
    this.timeInApp = 0;
  };

  startRecordingSession = async () => {
    if (!this.isEnabled) return;
    if (this.isRecording) return;

    this.isRecording = true;
    await startRecording();

    // Stop recording after 2 minutes
    this.recordingTimer = setTimeout(() => {
      this.stopRecordingSession();
      this.timeInApp = 0; // Reset timer for next interval
    }, this.RECORD_DURATION);
  };

  stopRecordingSession = async () => {
    if (!this.isRecording) return;

    if (this.recordingTimer) {
      clearTimeout(this.recordingTimer);
    }

    this.isRecording = false;
    await stopRecording();
  };

  async addTargetApp(appPackageName) {
    this.targetApps.add(appPackageName.toLowerCase());
    await this.saveTargetApps();
  }

  async removeTargetApp(appPackageName) {
    this.targetApps.delete(appPackageName.toLowerCase());
    await this.saveTargetApps();
  }

  async saveTargetApps() {
    try {
      await AsyncStorage.setItem('targetApps', JSON.stringify([...this.targetApps]));
    } catch (error) {
      console.error('Error saving target apps:', error);
    }
  }

  getTargetApps() {
    return [...this.targetApps];
  }

  setRecordingEnabled(enabled) {
    this.isEnabled = enabled;
    if (!enabled && this.isRecording) {
      this.stopRecordingSession();
    }
    if (!enabled) {
      this.stopAppTracking();
    } else {
      this.startAppTracking();
    }
  }
}

export default new RecordingService(); 