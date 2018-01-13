'use strict';

import React, { Component } from 'react';
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  Image,
  Linking,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import colors from '../helpers/colors';
import { launchURL } from '../helpers/common';
import styles from '../helpers/styles';
import Config from 'react-native-config';
import GoogleAnalytics from 'react-native-google-analytics-bridge';
import MapView from 'react-native-maps';

var event;

var MARKER_COLOR = colors.MAP_MARKER_COLOR;

const { width, height, scale } = Dimensions.get('window'),
  vw = width / 100,
  vh = height / 100,
  vmin = Math.min(vw, vh),
  vmax = Math.max(vw, vh);

// const mapStyles = StyleSheet.create({
//   map: {
//     ...StyleSheet.absoluteFillObject,
//   },
// });

class MapImageWidget extends Component {
  constructor(props) {
    super(props);
    event = this.props.event;
    // this.state = {
    //   showsTraffic: true,
    // };
  }

  componentWillMount() {
    console.log('MapImageWidget componentWillMount');
    // this.state.showsTraffic = this.props.showsTraffic;
  }

  componentDidMount() {
    //    console.log('MapImageWidget componentDidMount');
  }

  componentWillUnmount() {
    //    console.log('MapImageWidget componentWillUnmount');
  }

  shouldComponentUpdate() {
    // if (this.props.showsTraffic === this.state.showsTraffic) {
    //   console.log(
    //     'MapImageWidget shouldComponentUpdate FALSE ' +
    //       this.props.showsTraffic +
    //       ' ' +
    //       this.state.showsTraffic
    //   );
    //   return false;
    // } else {
    //   console.log(
    //     'MapImageWidget shouldComponentUpdate TRUE ' +
    //       this.props.showsTraffic +
    //       ' ' +
    //       this.state.showsTraffic
    //   );
    //   return true;
    // }
    return false;
  }

  openMapAtEventLocation() {
    GoogleAnalytics.trackEvent('Map', 'venue', {
      label: event.YYYYMMDD + ' ' + event.altName,
      value: 0,
    });
    if (event.lat !== null && event.lng !== null) {
      let mapsURL = 'http://maps.apple.com/?ll=';
      mapsURL = mapsURL + event.lat + ',' + event.lng;
      mapsURL = mapsURL + '&q=' + event.venue;

      launchURL(mapsURL);
    } else {
      this.getEventLocation();
    }
  }

  render() {
    if (
      typeof event !== 'undefined' &&
      (event.lat !== null || event.lng !== null)
    ) {
      return (
        <MapView
          style={styles.map}
          region={{
            latitude: parseFloat(event.lat),
            longitude: parseFloat(event.lng),
            latitudeDelta: 0.015,
            longitudeDelta: 0.0121,
          }}
          mapType="standard"
          showsUserLocation={true}
          // showsTraffic={this.state.showsTraffic}
        >
          <MapView.Marker
            coordinate={{
              latitude: parseFloat(event.lat),
              longitude: parseFloat(event.lng),
            }}
            title={event.venue}
            onCalloutPress={() => this.openMapAtEventLocation()}
            pinColor={colors.PRIMARY_COLOR}
            // description={'Get Directions'}
          />
        </MapView>
        // </View>
      );
    } else {
      return (
        <View
          style={(styles.directionColumnContainer, styles.loadingContainer)}
        >
          <Text
            style={[styles.appTextColor, styles.fontSize4, styles.centerText]}
          >
            Map Not
          </Text>
          <Text
            style={[styles.appTextColor, styles.fontSize4, styles.centerText]}
          >
            Available
          </Text>
        </View>
      );
    }
  }
}

module.exports = MapImageWidget;
