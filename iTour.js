/* @flow */

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
import params from './helpers/params';
import styles from './helpers/styles';
import CodePush from 'react-native-code-push';
import Config from 'react-native-config';
import GoogleAnalytics from 'react-native-google-analytics-bridge';

import { Root, Tabs } from './helpers/router';

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

    return <Root />;
  }
}
