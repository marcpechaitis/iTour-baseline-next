'use strict';

import { Linking } from 'react-native';

export function showWebBrowser(navigation, targetURL, targetTitle) {
  navigation.navigate('WebBrowser', {
    target: targetURL,
    targetTitle: targetTitle,
  });
}
export function launchURL(url) {
  Linking.canOpenURL(url)
    .then(supported => {
      if (!supported) {
        console.log("Can't handle url: " + url);
      } else {
        return Linking.openURL(url);
      }
    })
    .catch(error => console.log('An unexpected error happened', error));
}
