import { Audio, AVPlaybackStatusSuccess } from 'expo-av';
import { Recording, Sound, RECORDING_OPTIONS_PRESET_HIGH_QUALITY } from 'expo-av/build/Audio';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';

import MeterVisualizer from './MeterVisualizer';

export default function AudioRecorder() {
  let meters: (number | undefined)[];
  const [recording, setRecording] = useState<Recording>();
  const [playingRecording, setPlayingRecording] = useState<boolean>();
  const [sound, setSound] = useState<Sound>();
  const [uri, setUri] = useState<string>('');
  const [metering, setMetering] = useState<any>();
  const [data, setData] = useState<any>([]);

  async function startRecording() {
    try {
      meters = [];
      setData([]);
      console.log('Requesting permissions..');
      await Audio.requestPermissionsAsync();
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true
      });
      console.log('Starting recording..');
      const recording = new Audio.Recording();
      const result = await recording.prepareToRecordAsync(RECORDING_OPTIONS_PRESET_HIGH_QUALITY);
      console.log('result', result);
      recording.setProgressUpdateInterval(10);
      await recording.startAsync();
      setRecording(recording);
      console.log('Recording started');
      recording.setOnRecordingStatusUpdate((o) => {
        setMetering(o.metering);
        if (o.metering && meters.length < 100) {
          meters.push(o.metering);
        } else {
          meters.shift() && meters.push(o.metering);
        }
        o.metering && setData([...meters]);
        console.log('metering', o.metering);
      });
    } catch (err) {
      console.error('Failed to start recording', err);
    }
  }

  async function stopRecording() {
    console.log('Stopping recording..');
    setRecording(undefined);
    await recording?.stopAndUnloadAsync();
    const uri = recording?.getURI() ?? '';
    console.log('Recording stopped and stored at', uri);
    setUri(uri);
  }

  async function playSound() {
    console.log('Playing Sound');
    const { sound } = await Audio.Sound.createAsync({ uri });
    setSound(sound);
    setPlayingRecording(true);
    await sound?.setVolumeAsync(1);
    await sound?.playAsync();
    sound?.setOnPlaybackStatusUpdate(async (o) => {
      console.log(o);
      if ((o as AVPlaybackStatusSuccess).didJustFinish) {
        setPlayingRecording(false);
        await sound?.stopAsync();
        await sound?.unloadAsync();
      }
    });
  }

  async function stopSound() {
    console.log('Stop Sound');
    setPlayingRecording(false);
    await sound?.stopAsync();
    await sound?.unloadAsync();
  }

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <Button
        title={recording ? 'Stop Recording' : 'Start Recording'}
        onPress={recording ? stopRecording : startRecording}
      />
      <Text>{metering}</Text>
      <MeterVisualizer {...{ data }} />
      <Button
        title={!playingRecording ? 'Play Sound' : 'Stop Sound'}
        onPress={!playingRecording ? playSound : stopSound}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'space-evenly'
  }
});
