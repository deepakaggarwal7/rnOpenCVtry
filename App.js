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

const img1 ='data:image/jpg;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAMAAADXqc3KAAAB+FBMVEUAAAA/mUPidDHiLi5Cn0XkNTPmeUrkdUg/m0Q0pEfcpSbwaVdKskg+lUP4zA/iLi3msSHkOjVAmETdJSjtYFE/lkPnRj3sWUs8kkLeqCVIq0fxvhXqUkbVmSjwa1n1yBLepyX1xxP0xRXqUkboST9KukpHpUbuvRrzrhF/ljbwaljuZFM4jELaoSdLtElJrUj1xxP6zwzfqSU4i0HYnydMtUlIqUfywxb60AxZqEXaoifgMCXptR9MtklHpEY2iUHWnSjvvRr70QujkC+pUC/90glMuEnlOjVMt0j70QriLS1LtEnnRj3qUUXfIidOjsxAhcZFo0bjNDH0xxNLr0dIrUdmntVTkMoyfL8jcLBRuErhJyrgKyb4zA/5zg3tYFBBmUTmQTnhMinruBzvvhnxwxZ/st+Ktt5zp9hqota2vtK6y9FemNBblc9HiMiTtMbFtsM6gcPV2r6dwroseLrMrbQrdLGdyKoobKbo3Zh+ynrgVllZulTsXE3rV0pIqUf42UVUo0JyjEHoS0HmsiHRGR/lmRz/1hjqnxjvpRWfwtOhusaz0LRGf7FEfbDVmqHXlJeW0pbXq5bec3fX0nTnzmuJuWvhoFFhm0FtrziBsjaAaDCYWC+uSi6jQS3FsSfLJiTirCOkuCG1KiG+wSC+GBvgyhTszQ64Z77KAAAARXRSTlMAIQRDLyUgCwsE6ebm5ubg2dLR0byXl4FDQzU1NDEuLSUgC+vr6urq6ubb29vb2tra2tG8vLu7u7uXl5eXgYGBgYGBLiUALabIAAABsElEQVQoz12S9VPjQBxHt8VaOA6HE+AOzv1wd7pJk5I2adpCC7RUcHd3d3fXf5PvLkxheD++z+yb7GSRlwD/+Hj/APQCZWxM5M+goF+RMbHK594v+tPoiN1uHxkt+xzt9+R9wnRTZZQpXQ0T5uP1IQxToyOAZiQu5HEpjeA4SWIoksRxNiGC1tRZJ4LNxgHgnU5nJZBDvuDdl8lzQRBsQ+s9PZt7s7Pz8wsL39/DkIfZ4xlB2Gqsq62ta9oxVlVrNZpihFRpGO9fzQw1ms0NDWZz07iGkJmIFH8xxkc3a/WWlubmFkv9AB2SEpDvKxbjidN2faseaNV3zoHXvv7wMODJdkOHAegweAfFPx4G67KluxzottCU9n8CUqXzcIQdXOytAHqXxomvykhEKN9EFutG22p//0rbNvHVxiJywa8yS2KDfV1dfbu31H8jF1RHiTKtWYeHxUvq3bn0pyjCRaiRU6aDO+gb3aEfEeVNsDgm8zzLy9egPa7Qt8TSJdwhjplk06HH43ZNJ3s91KKCHQ5x4sw1fRGYDZ0n1L4FKb9/BP5JLYxToheoFCVxz57PPS8UhhEpLBVeAAAAAElFTkSuQmCC';
const photo='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'    
const App: () => React$Node = () => {
  const [img, setImg] = useState();
  useEffect(() => {
    console.log(NativeModules)
    console.log(OpenCV);
    let img ='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'
    //checkForBlurryImage(img).then((res) => console.log(res));
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
              <Text style={styles.sectionTitle}>Step One</Text>
              <Image source={{uri: 'data:image/png;base64,' + img}} style={{
    width: 200,
    height: 200,
    resizeMode: 'contain'
  }} />
              <Image
  style={{
    width: 51,
    height: 51,
    resizeMode: 'contain'
  }}
  source={{
    uri:
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADMAAAAzCAYAAAA6oTAqAAAAEXRFWHRTb2Z0d2FyZQBwbmdjcnVzaEB1SfMAAABQSURBVGje7dSxCQBACARB+2/ab8BEeQNhFi6WSYzYLYudDQYGBgYGBgYGBgYGBgYGBgZmcvDqYGBgmhivGQYGBgYGBgYGBgYGBgYGBgbmQw+P/eMrC5UTVAAAAABJRU5ErkJggg=='
  }}
/>
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
