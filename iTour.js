'use strict';

import React, { Component } from 'react';
import {
  Alert,
  AppState,
  Platform,
  StyleSheet,
  Text,
  View
} from 'react-native';
import {
  Scene,
  Reducer,
  Router,
  Switch,
  Modal,
  Actions,
  ActionConst
} from 'react-native-router-flux';
import params from './helpers/params';
import styles from './helpers/styles';
import CodePush from 'react-native-code-push';
import Config from 'react-native-config';
import GoogleAnalytics from 'react-native-google-analytics-bridge';
import EventList from './components/EventList';
import EventDetail from './components/EventDetail';
import WebBrowser from './components/WebBrowser';

let appstate;
let codePushDeploymentKeyIOS;
let codePushDeploymentKeyANDROID;
let codePushDeploymentKey;

const instructions = Platform.select({
  ios: 'Press Cmd+R to reload,\n' + 'Cmd+D or shake for dev menu',
  android:
    'Double tap R on your keyboard to reload,\n' +
    'Shake or press menu button for dev menu'
});

export default class iTour extends Component<{}> {
  componentWillMount() {}

  componentDidMount() {
    // CodePush.sync({
    //   //      deploymentKey: this.getCodePushDeploymentKey(),
    //   updateDialog: false,
    //   installMode: CodePush.InstallMode.ON_APP_RESUME
    // });
    console.log('Mounted');
  }

  getCodePushDeploymentKey() {
    let bIsThisFreeApp = false;
    let loc = params.APP_NAME.indexOf('FREE');
    if (loc >= 0) {
      bIsThisFreeApp = true;
    }

    switch (params.BAND) {
      case 'DEAD':
        // Dead & Co.
        codePushDeploymentKeyIOS = Config.CODEPUSH_DEAD_IOS_PRODUCTION;
        codePushDeploymentKeyANDROID = Config.CODEPUSH_DEAD_ANDROID_PRODUCTION;
        break;
      case 'DMB':
        // Dave Matthews Band
        if (bIsThisFreeApp) {
          codePushDeploymentKeyIOS = Config.CODEPUSH_DMB_FREE_IOS_PRODUCTION;
        } else {
          codePushDeploymentKeyIOS = Config.CODEPUSH_DMB_IOS_PRODUCTION;
        }

        codePushDeploymentKeyANDROID = Config.CODEPUSH_DMB_ANDROID_PRODUCTION;
        break;
      case 'PEARLJAM':
        // Pearl Jam
        codePushDeploymentKeyIOS = Config.CODEPUSH_PEARLJAM_IOS_PRODUCTION;
        codePushDeploymentKeyANDROID =
          Config.CODEPUSH_PEARLJAM_ANDROID_PRODUCTION;
        break;
      case 'PHISH':
        // Phish
        if (bIsThisFreeApp) {
          codePushDeploymentKeyIOS = Config.CODEPUSH_PHISH_FREE_IOS_PRODUCTION;
        } else {
          codePushDeploymentKeyIOS = Config.CODEPUSH_PHISH_IOS_PRODUCTION;
        }

        codePushDeploymentKeyANDROID = Config.CODEPUSH_PHISH_ANDROID_PRODUCTION;
        break;
      case 'RADIOHEAD':
        // Radiohead
        codePushDeploymentKeyIOS = Config.CODEPUSH_RADIOHEAD_IOS_PRODUCTION;
        codePushDeploymentKeyANDROID =
          Config.CODEPUSH_RADIOHEAD_ANDROID_PRODUCTION;
        break;
      case 'SCI':
        // String Cheese Incident
        if (bIsThisFreeApp) {
          codePushDeploymentKeyIOS = Config.CODEPUSH_SCI_FREE_IOS_PRODUCTION;
        } else {
          codePushDeploymentKeyIOS = Config.CODEPUSH_SCI_IOS_PRODUCTION;
        }

        codePushDeploymentKeyANDROID = Config.CODEPUSH_SCI_ANDROID_PRODUCTION;
        break;
      case 'UMPHREYS':
        // Umphrey's McGee
        if (bIsThisFreeApp) {
          codePushDeploymentKeyIOS =
            Config.CODEPUSH_UMPHREYS_FREE_IOS_PRODUCTION;
        } else {
          codePushDeploymentKeyIOS = Config.CODEPUSH_UMPHREYS_IOS_PRODUCTION;
        }

        codePushDeploymentKeyANDROID =
          Config.CODEPUSH_UMPHREYS_ANDROID_PRODUCTION;
        break;
      case 'WSP':
        // Widespread Panic
        if (bIsThisFreeApp) {
          codePushDeploymentKeyIOS = Config.CODEPUSH_WSP_FREE_IOS_PRODUCTION;
        } else {
          codePushDeploymentKeyIOS = Config.CODEPUSH_WSP_IOS_PRODUCTION;
        }

        codePushDeploymentKeyANDROID = Config.CODEPUSH_WSP_ANDROID_PRODUCTION;
        break;
      default:
        codePushDeploymentKeyIOS = Config.CODEPUSH_PHISH_IOS_PRODUCTION;
        codePushDeploymentKeyANDROID = Config.CODEPUSH_PHISH_ANDROID_PRODUCTION;
        break;
    }

    codePushDeploymentKey =
      Platform.OS === 'ios'
        ? codePushDeploymentKeyIOS
        : codePushDeploymentKeyANDROID;
    return codePushDeploymentKey;
  }

  render() {
    GoogleAnalytics.setTrackerId(Config.GOOGLE_ANALYTICS_TRACKING_ID);

    // Recommend you set this much higher in real app! 30 seconds+
    GoogleAnalytics.setDispatchInterval(30);

    return (
      // <View style={styles.container}>
      //   <Text style={styles.welcome}>Welcome to React Native!</Text>
      //   <Text style={styles.instructions}>To get started, edit App.js</Text>
      //   <Text style={styles.instructions}>{instructions}</Text>
      // </View>

      <Router
      // navigationBarStyle={styles.navBar}
      // titleStyle={styles.navBarTextStyle}
      // barButtonTextStyle={styles.barButtonTextStyle}
      // barButtonIconStyle={styles.barButtonIconStyle}
      // allowFontScaling={false}
      >
        <Scene key="root">
          <Scene
            key="EventList"
            component={EventList}
            navigationBarStyle={styles.navBar}
            titleStyle={styles.navBarTextStyle}
            barButtonTextStyle={styles.barButtonTextStyle}
            barButtonIconStyle={styles.barButtonIconStyle}
            allowFontScaling={false}
            title={params.APP_NAME}
            initial={true}
          />
          <Scene
            key="EventDetail"
            component={EventDetail}
            navigationBarStyle={styles.navBar}
            titleStyle={styles.navBarTextStyle}
            barButtonTextStyle={styles.barButtonTextStyle}
            barButtonIconStyle={styles.barButtonIconStyle}
            allowFontScaling={false}
          />
          <Scene
            key="WebBrowser"
            component={WebBrowser}
            navigationBarStyle={styles.navBar}
            titleStyle={styles.navBarTextStyle}
            barButtonTextStyle={styles.barButtonTextStyle}
            barButtonIconStyle={styles.barButtonIconStyle}
            allowFontScaling={false}
          />
        </Scene>
      </Router>
    );
  }
}

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: '#F5FCFF'
//   },
//   welcome: {
//     fontSize: 20,
//     textAlign: 'center',
//     margin: 10
//   },
//   instructions: {
//     textAlign: 'center',
//     color: '#333333',
//     marginBottom: 5
//   }
// })
