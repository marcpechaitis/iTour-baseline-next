'use strict';

import React, { Component } from 'react';
import {
  BackHandler,
  Platform,
  Text,
  TouchableOpacity,
  View,
  WebView
} from 'react-native';
import { NavigationActions } from 'react-navigation';
import params from '../helpers/params';
import styles from '../helpers/styles';
// import { Actions } from 'react-native-router-flux';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const WEBVIEW_REF = 'webview';

const DEFAULT_URL = params.BAND_URL_DEFAULT;

class WebBrowser extends Component {
  constructor(props) {
    super(props);

    // this.handleBackButtonClick = this.handleBackButtonClick.bind(this);

    this.state = {
      title: '',
      url: DEFAULT_URL,
      status: 'No Page Loaded',
      backButtonEnabled: false,
      forwardButtonEnabled: false,
      loading: true,
      scalesPageToFit: true,
      event: this.props.event
    };
  }

  componentWillMount() {
    //    console.log('WebBrowser componentWillMount');
    // BackHandler.addEventListener(
    //   'hardwareBackPress',
    //   this.handleBackButtonClick
    // );
  }

  componentDidMount() {
    //    console.log('WebBrowser componentDidMount');
    //  Actions.refresh({ title: this.props.targetTitle });
  }

  componentWillUnmount() {
    //    console.log('WebBrowser componentWillUnmount');
    // BackHandler.removeEventListener(
    //   'hardwareBackPress',
    //   this.handleBackButtonClick
    // );
  }

  // handleBackButtonClick() {
  //   Alert.alert('goback');
  //   //   this.props.navigation.goBack(null);
  //   this.props.navigation.dispatch(NavigationActions.back());
  //   return true;
  // }

  render() {
    return (
      <View style={styles.flexOne}>
        <WebView
          ref={WEBVIEW_REF}
          automaticallyAdjustContentInsets={true}
          source={{ uri: this.props.target }}
          style={styles.webViewContentController}
          javascriptEnabled={true}
          domStorageEnabled={true}
          decelerationRate="normal"
          onNavigationStateChange={this.onNavigationStateChange}
          onShouldStartLoadWithRequest={this.onShouldStartLoadWithRequest}
          startInLoadingState={true}
          scalesPageToFit={true}
        />
        <View style={styles.webViewFooterContainer}>
          <TouchableOpacity onPress={this.goBack}>
            <MaterialIcons
              name="navigate-before"
              style={
                this.state.backButtonEnabled
                  ? styles.navButton
                  : styles.disabledButton
              }
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={this.goForward}>
            <MaterialIcons
              name="navigate-next"
              style={
                this.state.forwardButtonEnabled
                  ? styles.navButton
                  : styles.disabledButton
              }
            />
          </TouchableOpacity>
        </View>
      </View>
      //  {/*   <View style={styles.flexOne}> */}
      // <View>
      //   <WebView
      //     ref={WEBVIEW_REF}
      //     automaticallyAdjustContentInsets={true}
      //     // source={{ uri: this.props.target }}
      //     // source={{ uri: this.props.target }}
      //     source={{ uri: tempURL }}
      //     style={styles.webViewContentController}
      //     javascriptEnabled={true}
      //     domStorageEnabled={true}
      //     decelerationRate="normal"
      //     onNavigationStateChange={this.onNavigationStateChange}
      //     onShouldStartLoadWithRequest={this.onShouldStartLoadWithRequest}
      //     startInLoadingState={true}
      //     scalesPageToFit={true}
      //     style={{ height: 320, width: 320 }}
      //   />
      //   <View style={styles.webViewFooterContainer}>
      //     <TouchableOpacity onPress={this.goBack}>
      //       <MaterialIcons
      //         name="navigate-before"
      //         style={
      //           this.state.backButtonEnabled
      //             ? styles.navButton
      //             : styles.disabledButton
      //         }
      //       />
      //     </TouchableOpacity>
      //     <TouchableOpacity onPress={this.goForward}>
      //       <MaterialIcons
      //         name="navigate-next"
      //         style={
      //           this.state.forwardButtonEnabled
      //             ? styles.navButton
      //             : styles.disabledButton
      //         }
      //       />
      //     </TouchableOpacity>
      //   </View>
      // </View>
    );
  }

  goBack = () => {
    this.refs[WEBVIEW_REF].goBack();
  };

  goForward = () => {
    this.refs[WEBVIEW_REF].goForward();
  };

  // TODO - add refresh button to footer
  /*
  reload = () => {
    this.refs[WEBVIEW_REF].reload();
  };
*/
  onShouldStartLoadWithRequest = event => {
    // Implement any custom loading logic here, don't forget to return!
    return true;
  };

  onNavigationStateChange = navState => {
    console.log(
      'canGoBack ' +
        navState.canGoBack +
        ' canGoForward ' +
        navState.canGoForward
    );
    this.setState({
      backButtonEnabled: navState.canGoBack,
      forwardButtonEnabled: navState.canGoForward,
      url: navState.url,
      status: navState.title,
      loading: navState.loading,
      scalesPageToFit: true
    });
  };
}

export default WebBrowser;
