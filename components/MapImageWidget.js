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

const mapStyles = StyleSheet.create({
  map: {
    ...StyleSheet.absoluteFillObject,
  },
});

class MapImageWidget extends Component {
  constructor(props) {
    super(props);
    event = this.props.event;
  }

  componentWillMount() {
    //    console.log('MapImageWidget componentWillMount');
  }

  componentDidMount() {
    //    console.log('MapImageWidget componentDidMount');
  }

  componentWillUnmount() {
    //    console.log('MapImageWidget componentWillUnmount');
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
      let GOOGLE_MAP_IMAGE_URL =
        'https://maps.googleapis.com/maps/api/staticmap?center=';
      GOOGLE_MAP_IMAGE_URL = GOOGLE_MAP_IMAGE_URL + event.lat + ',' + event.lng;
      GOOGLE_MAP_IMAGE_URL = GOOGLE_MAP_IMAGE_URL + '&zoom=15';
      GOOGLE_MAP_IMAGE_URL =
        GOOGLE_MAP_IMAGE_URL +
        '&size=' +
        Math.round(100 * vw) +
        'x' +
        Math.round(46 * vh);
      GOOGLE_MAP_IMAGE_URL =
        GOOGLE_MAP_IMAGE_URL +
        '+&markers=color:' +
        MARKER_COLOR +
        '|' +
        event.laopenMapAtEventLocationt +
        ',' +
        event.lng;
      GOOGLE_MAP_IMAGE_URL = GOOGLE_MAP_IMAGE_URL + '&scale=2';
      GOOGLE_MAP_IMAGE_URL =
        GOOGLE_MAP_IMAGE_URL +
        '&format=png&maptype=roadmap&style=element:geometry%7Ccolor:0xebe3cd&style=element:labels.text.fill%7Ccolor:0x523735&style=element:labels.text.stroke%7Ccolor:0xf5f1e6&style=feature:administrative%7Celement:geometry.stroke%7Ccolor:0xc9b2a6&style=feature:administrative.land_parcel%7Celement:geometry.stroke%7Ccolor:0xdcd2be&style=feature:administrative.land_parcel%7Celement:labels.text.fill%7Ccolor:0xae9e90&style=feature:landscape.natural%7Celement:geometry%7Ccolor:0xdfd2ae&style=feature:poi%7Celement:geometry%7Ccolor:0xdfd2ae&style=feature:poi%7Celement:labels.text.fill%7Ccolor:0x93817c&style=feature:poi.park%7Celement:geometry.fill%7Ccolor:0xa5b076&style=feature:poi.park%7Celement:labels.text.fill%7Ccolor:0x447530&style=feature:road%7Celement:geometry%7Ccolor:0xf5f1e6&style=feature:road.arterial%7Celement:geometry%7Ccolor:0xfdfcf8&style=feature:road.highway%7Celement:geometry%7Ccolor:0xf8c967&style=feature:road.highway%7Celement:geometry.stroke%7Ccolor:0xe9bc62&style=feature:road.highway.controlled_access%7Celement:geometry%7Ccolor:0xe98d58&style=feature:road.highway.controlled_access%7Celement:geometry.stroke%7Ccolor:0xdb8555&style=feature:road.local%7Celement:labels.text.fill%7Ccolor:0x806b63&style=feature:transit.line%7Celement:geometry%7Ccolor:0xdfd2ae&style=feature:transit.line%7Celement:labels.text.fill%7Ccolor:0x8f7d77&style=feature:transit.line%7Celement:labels.text.stroke%7Ccolor:0xebe3cd&style=feature:transit.station%7Celement:geometry%7Ccolor:0xdfd2ae&style=feature:water%7Celement:geometry.fill%7Ccolor:0xb9d3c2&style=feature:water%7Celement:labels.text.fill%7Ccolor:0x92998d';
      GOOGLE_MAP_IMAGE_URL =
        GOOGLE_MAP_IMAGE_URL + '&key=' + Config.GOOGLE_STATIC_MAPS_API_KEY;

      return (
        // <View>
        //   <Image source={{uri: GOOGLE_MAP_IMAGE_URL, width: Math.round(100*vw), height: Math.round(46*vh)}} />
        // </View>
        // <View style={mapStyles.container}>

        <MapView
          style={mapStyles.map}
          region={{
            latitude: parseFloat(event.lat),
            longitude: parseFloat(event.lng),
            latitudeDelta: 0.015,
            longitudeDelta: 0.0121,
          }}
        >
          <MapView.Marker
            coordinate={{
              latitude: parseFloat(event.lat),
              longitude: parseFloat(event.lng),
            }}
            title={event.venue}
            onCalloutPress={() => this.openMapAtEventLocation()}
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
