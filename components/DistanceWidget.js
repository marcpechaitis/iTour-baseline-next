'use strict';

import React, { Component } from 'react';
import {
  ActivityIndicator,
  Alert,
  AsyncStorage,
  Text,
  View
} from 'react-native';
import colors from '../helpers/colors';
import params from '../helpers/params';
import styles from '../helpers/styles';
import Config from 'react-native-config';
import GoogleAnalytics from 'react-native-google-analytics-bridge';

var event;

class DistanceWidget extends Component {
  constructor(props) {
    super(props);

    event = this.props.event;
    this.state = {
      isLoading: true,
      isError: false,
      distanceData: null,
      //      units: 'imperial',
      position: { coords: {} }
    };
  }

  componentWillMount() {
    //    console.log('DistanceWidget componentWillMount');
  }

  componentDidMount() {
    //    console.log('DistanceWidget componentDidMount');
    this.fetchData();
  }

  async fetchData() {
    let userLat = null;
    let userLng = null;

    let userPositionSession = await AsyncStorage.getItem(
      'iTourData_userLocationSession_' + params.BAND_NAME
    );
    if (userPositionSession === ' ' || userPositionSession === null) {
      this.setState({
        isLoading: false,
        isError: true
      });
    } else {
      userPositionSession = JSON.parse(userPositionSession);

      if (
        (typeof userPositionSession.coords.latitude !== 'undefined') &
        (userPositionSession.coords.longitude !== null)
      ) {
        userLat = userPositionSession.coords.latitude;
        userLng = userPositionSession.coords.longitude;
      } else {
        this.setState({ isError: true });
        return;
      }

      // use Imperial system measurements for USA, UK, Burma and Liberia
      let units = 'metric';
      switch (event.country) {
        case 'USA':
        case 'UK':
        case 'Burma':
        case 'Liberia':
          units = 'imperial';
          break;
        default:
          units = 'metric';
      }

      let DISTANCE_REQUEST_URL =
        'https://maps.googleapis.com/maps/api/distancematrix/json?units=';
      DISTANCE_REQUEST_URL =
        DISTANCE_REQUEST_URL + units + '&origins=' + userLat + ',' + userLng;
      DISTANCE_REQUEST_URL =
        DISTANCE_REQUEST_URL + '&destinations=' + event.lat + ',' + event.lng;
      DISTANCE_REQUEST_URL =
        DISTANCE_REQUEST_URL + '&key=' + Config.GOOGLE_DISTANCE_API_KEY;
      DISTANCE_REQUEST_URL = DISTANCE_REQUEST_URL.replace(/ /g, '+');

      try {
        let response = await fetch(DISTANCE_REQUEST_URL);

        if (response.status === 200) {
          let distanceData = await response.json();
          if (distanceData.status === 'OK') {
            this.setState({
              distanceData: distanceData,
              isLoading: false
            });
          } else {
            this.setState({
              isLoading: false,
              isError: true
            });
          }
        } else {
          this.setState({
            isLoading: false,
            isError: true
          });
        }
      } catch (error) {
        console.log(error.message);
        GoogleAnalytics.trackException(error.message, false);
        this.setState({
          isLoading: false,
          isError: true
        });
      }
    }
  }

  componentWillUnmount() {
    //    console.log('DistanceWidget componentWillUnmount');

    this.setState({
      position: { coords: {} }
    });
  }

  render() {
    if (this.state.isError) {
      return this.renderLoadingError();
    } else {
      if (this.state.isLoading) {
        return this.renderLoadingView();
      } else {
        if (this.state.distanceData.rows[0].elements[0].status !== 'OK') {
          return this.renderLoadingError();
        } else {
          //  condense the duration text value
          let duration = this.state.distanceData.rows[0].elements[0].duration
            .text;
          duration = duration.replace(' days', 'd ');
          duration = duration.replace(' day', 'd ');
          duration = duration.replace(' hours', 'h');
          duration = duration.replace(' hour', 'h');
          duration = duration.replace(' mins', 'm');
          duration = duration.replace(' min', 'm');

          return (
            <View
              style={[styles.widgetContainer, styles.directionRowContainer]}
            >
              <View
                style={
                  (styles.directionColumnContainer, styles.justifySpaceAround)
                }
              >
                <Text
                  style={[
                    styles.appTextColor,
                    styles.fontSize3,
                    styles.centerText
                  ]}
                >
                  Distance
                </Text>
                <Text
                  style={[
                    styles.appTextColor,
                    styles.fontSize4,
                    styles.centerText
                  ]}
                >
                  {this.state.distanceData.rows[0].elements[0].distance.text}
                </Text>
                <Text
                  style={[
                    styles.appTextColor,
                    styles.fontSize4,
                    styles.centerText
                  ]}
                >
                  {duration}
                </Text>
              </View>
            </View>
          );
        }
      }
    }
  }

  renderLoadingView() {
    return (
      <View>
        <ActivityIndicator
          animating={this.state.isLoading}
          size="small"
          color={colors.SPINNER_COLOR}
        />
        <Text style={styles.appTextColor}>Calculating</Text>
      </View>
    );
  }

  renderLoadingError() {
    return (
      <View style={[styles.widgetContainer, styles.directionRowContainer]}>
        <View style={styles.directionColumnContainer}>
          <Text
            style={[styles.appTextColor, styles.fontSize3, styles.centerText]}
          >
            Distance
          </Text>
          <Text
            style={[styles.appTextColor, styles.fontSize4, styles.centerText]}
          >
            Not Available
          </Text>
        </View>
      </View>
    );
  }
}

module.exports = DistanceWidget;
