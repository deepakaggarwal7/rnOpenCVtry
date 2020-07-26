/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, {useEffect, useState} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Image,
  Text,
  StatusBar,
  Platform
} from 'react-native';
import OpenCV from './src/NativeModules/OpenCV';
import {NativeModules} from 'react-native';

import {
  Header,
  LearnMoreLinks,
  Colors,
  DebugInstructions,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';



const checkForBlurryImage = (imageAsBase64)=> {
  return new Promise((resolve, reject) => {
    if (Platform.OS === 'android') {
      OpenCV.checkForBlurryImage(
        imageAsBase64,
        (error) => {
          console.log(error);
        },
        (msg) => {
          resolve(msg);
      });
    } else {
      OpenCV.checkForBlurryImage(imageAsBase64, (error, dataArray) => {
        resolve(dataArray[0]);
      });
    }
  });
};

const covertToBlackAndWhite = (imageAsBase64)=> {
  return new Promise((resolve, reject) => {
    if (Platform.OS === 'android') {
      OpenCV.covertToBlackAndWhite(
        imageAsBase64,
        (error) => {
          console.log(error);
        },
        (msg) => {
          resolve(msg);
      });
    } else {
      OpenCV.covertToBlackAndWhite(imageAsBase64, (error, dataArray) => {
        resolve(dataArray[0]);
      });
    }
  });
};

const photo='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'    
const App: () => React$Node = () => {
  const [img, setImg] = useState();
  useEffect(() => {
    console.log(NativeModules)
    console.log(OpenCV);
    
    //checkForBlurryImage(photo).then((res) => console.log(res));
    covertToBlackAndWhite(photo).then((res) => {
      console.log(res);
      setImg(res);
     });
  }, []);

  return (
    <>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView>
        <ScrollView
          contentInsetAdjustmentBehavior="automatic"
          style={styles.scrollView}>
          <Header />
          {global.HermesInternal == null ? null : (
            <View style={styles.engine}>
              <Text style={styles.footer}>Engine: Hermes</Text>
            </View>
          )}
          <View style={styles.body}>
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>OpenCV(4.2) + React Native(0.63.2)</Text>
              <Image source={{uri: 'data:image/png;base64,' + photo}} style={{
    width: 200,
    height: 200,
    resizeMode: 'contain'
  }} />
              <Image source={{uri: 'data:image/png;base64,' + img}} style={{
    width: 200,
    height: 200,
    resizeMode: 'contain'
  }} />
             <Text style={styles.sectionTitle}>Step One</Text>
              <Text style={styles.sectionDescription}>
                Edit <Text style={styles.highlight}>App.js</Text> to change this
                screen and then come back to see your edits.
              </Text>
            </View>
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>See Your Changes</Text>
              <Text style={styles.sectionDescription}>
                <ReloadInstructions />
              </Text>
            </View>
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>Debug</Text>
              <Text style={styles.sectionDescription}>
                <DebugInstructions />
              </Text>
            </View>
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>Learn More</Text>
              <Text style={styles.sectionDescription}>
                Read the docs to discover what to do next:
              </Text>
            </View>
            <LearnMoreLinks />
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: Colors.lighter,
  },
  engine: {
    position: 'absolute',
    right: 0,
  },
  body: {
    backgroundColor: Colors.white,
  },
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: Colors.black,
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
    color: Colors.dark,
  },
  highlight: {
    fontWeight: '700',
  },
  footer: {
    color: Colors.dark,
    fontSize: 12,
    fontWeight: '600',
    padding: 4,
    paddingRight: 12,
    textAlign: 'right',
  },
});

export default App;
