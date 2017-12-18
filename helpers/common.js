export function showWebBrowser(navigation, targetURL, targetTitle) {
  navigation.navigate('WebBrowser', {
    target: targetURL,
    targetTitle: targetTitle
  });
}
