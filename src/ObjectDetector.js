import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { RNCamera } from 'react-native-camera';
import ml from '@react-native-firebase/ml';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'stretch',
  },
  snapButtonContainer: {
    flex: 0,
    flexDirection: "row",
    justifyContent: "center",
  },
  snapButton: {
    flex: 0,
    backgroundColor: '#fff',
    borderRadius: 5,
    padding: 15,
    paddingHorizontal: 20,
    alignSelf: 'center',
    margin: 20,
  },
  snapButtonText: {
    fontSize: 14,
  }
});

const ObjectDetector = () => {

  const WaitingView = () => (
    <View style={styles.container}>
      <Text>Waiting</Text>
    </View>
  )

  const takePicture = async (camera) => {
    const options = { quality: 0.5, base64: true };
    const data = await camera.takePictureAsync(options);
    console.log(data.uri);
    try {
      processImage(data.uri);
    } catch (error) {
      console.warn(error);
    }
  }

  async function processImage(filepath) {
    const labels = await ml().cloudImageLabelerProcessImage(filepath);
    labels.forEach(label => {
      console.log('Service labelled the image: ', label.text);
      console.log('Confidence in the label: ', label.confidence);
    });
  }

  return (
    <View style={styles.container}>
      <RNCamera 
        style={styles.container}
        type={RNCamera.Constants.Type.back}
        androidCameraPermissionOptions={{
          title: 'Permision to use camera',
          message: 'We need your permision to use your camera',
          buttonPositive: 'Allow',
          buttonNegative: 'Decline'
        }}
        onTextRecognized={(blocks) => console.log("Detected blocks: ", blocks)}
      >
        {({ camera, status }) => {
          if (status !== "READY") return <WaitingView />

          return (
            <View style={styles.snapButtonContainer}>
              <TouchableOpacity onPress={() => takePicture(camera)} style={styles.snapButton}>
                <Text style={styles.snapButtonText}> SNAP </Text>
              </TouchableOpacity>
            </View>
          )
        }}
      </RNCamera>
    </View>
  )
}

export { ObjectDetector };
