
import { useState } from 'react'; 
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button } from 'react-native';
import { Audio } from 'expo-av';
import { Recording, RecordingStatus, RECORDING_OPTIONS_PRESET_HIGH_QUALITY } from 'expo-av/build/Audio';
import { Chart, SetData } from "@dpwiese/react-native-canvas-charts/ChartJs";
import { useRef } from "react";


export default function AudioRecorder() {
  const [recording, setRecording] = useState<Recording>();
  const [sound, setSound] = useState<any>();
  const [metering, setMetering] = useState<any>();
  const [status, setStatus] = useState<RecordingStatus>();
  const setDataRef = useRef<SetData>();

  async function startRecording() {
    try {
      console.log('Requesting permissions..');
      await Audio.requestPermissionsAsync();
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      }); 
      console.log('Starting recording..');
        //   const { recording, status } = await Audio.Recording.createAsync(
        //      RECORDING_OPTIONS_PRESET_HIGH_QUALITY
        //   );
        const recording = new Audio.Recording();
        const result = await recording.prepareToRecordAsync(RECORDING_OPTIONS_PRESET_HIGH_QUALITY);
        console.log('result', result);
        recording.setProgressUpdateInterval(50)
        recording.setOnRecordingStatusUpdate((o)=> {
            console.log('metering', o.metering);
            setMetering(o.metering)
            // setDataRef?.current?.setData(o.metering);
        });
        await recording.startAsync();
      setRecording(recording);
      console.log('status', status);
      setStatus(status);
      console.log('Recording started');
    } catch (err) {
      console.error('Failed to start recording', err);
    }
  }

  async function stopRecording() {
    console.log('Stopping recording..');
    setRecording(undefined);
    await recording?.stopAndUnloadAsync();
    const uri = recording?.getURI() || ''; 
    console.log('Recording stopped and stored at', uri);
    const { sound } = await Audio.Sound.createAsync(
        {uri}
    );
   setSound(sound);
  }

  async function playSound() {
    console.log('Loading Sound');

    console.log('Playing Sound');
    await sound.playAsync(); }

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <Button
        title={recording ? 'Stop Recording' : 'Start Recording'}
        onPress={recording ? stopRecording : startRecording}
      />
      <Text>{metering}</Text>
      <Button
        title="Play Sound"
        onPress={playSound}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'space-evenly',
  },
});