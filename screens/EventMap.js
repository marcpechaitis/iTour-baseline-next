/**
 * @flow
 */

import React, { Component } from 'react';
import { Dimensions, Platform, StyleSheet, Text, View } from 'react-native';
import MapView from 'react-native-maps';
import colors from '../helpers/colors';
import params from '../helpers/params';

const { width, height, scale } = Dimensions.get('window'),
  vw = width / 100,
  vh = height / 100;

const ASPECT_RATIO = width / height;
// TODO - get user's location for starting Lat/Lng
const LATITUDE = 37.78825;
const LONGITUDE = -122.4324;
const LATITUDE_DELTA = 1.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;
const SPACE = 0.01;

function createMarker(modifier = 1) {
  return {
    latitude: LATITUDE - SPACE * modifier,
    longitude: LONGITUDE - SPACE * modifier,
  };
}

const MARKERS = [
  createMarker(),
  createMarker(2),
  createMarker(3),
  createMarker(4),
];

let TOUR_MARKERS = [];
TOUR_MARKERS = [
  { latitude: 40.7505045, longitude: -73.9934387 },
  { latitude: 39.9012015, longitude: -75.17197949999999 },
  { latitude: 42.366198, longitude: -71.062146 },
  { latitude: 38.89812510000001, longitude: -77.02088040000001 },
  { latitude: 41.768399, longitude: -72.6769853 },
  { latitude: 42.3410478, longitude: -83.0551629 },
  { latitude: 39.9692127, longitude: -83.0060593 },
  { latitude: 35.2251426, longitude: -80.8392351 },
  { latitude: 33.7572891, longitude: -84.3963244 },
  { latitude: 32.7905064, longitude: -96.8103549 },
  { latitude: 30.2769548, longitude: -97.7322085 },
  { latitude: 20.491521, longitude: -87.2427579 },
  { latitude: 29.9490351, longitude: -90.08205679999999 },
  { latitude: 28.539902, longitude: -81.38367199999999 },
  { latitude: 26.1581467, longitude: -80.3254084 },
];

const DEFAULT_PADDING = { top: 60, right: 60, bottom: 60, left: 60 };

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    height: height,
    width: width,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
});

export default class EventMap extends Component<{}> {
  constructor(props) {
    super(props);
    this.map = null;
    this.state = {
      region: {
        latitude: LATITUDE,
        longitude: LONGITUDE,
        latitudeDelta: LATITUDE_DELTA,
        longitudeDelta: LONGITUDE_DELTA,
      },
      ready: true,
    };
  }

  componentWillMount() {
    this.getDataFromDevice();
  }

  componentDidMount() {
    // this.map.fitToCoordinates(MARKERS, {
    //   edgePadding: DEFAULT_PADDING,
    //   animated: true,
    // });
  }

  getDataFromDevice() {
    try {
      AsyncStorage.getItem(
        'iTourData_' + params.BAND_NAME,
        (error, responseData) => {
          // console.log('iTourData retrieved! ' + responseData);

          // for (var showID in responseData)
          //   TOUR_MARKERS.push([showID, responseData[showID]]);
          TOUR_MARKERS = JSON.parse(responseData);
          console.log(TOUR_MARKERS);
          // this.setState({ isLoading: false });
        }
      );
    } catch (error) {
      console.log('Error retrieving data from device ' + error);
      // Error retrieving data from device
      // this.setState({
      //   isLoading: false,
      //   isRefreshing: false,
      //   isError: true,
      // });
    }
  }

  onMapReady = e => {
    if (!this.state.ready) {
      this.setState({ ready: true });
    }
    console.log('is ready');
    this.map.fitToCoordinates(TOUR_MARKERS, {
      edgePadding: DEFAULT_PADDING,
      animated: true,
    });
  };

  render() {
    return (
      <View style={styles.container}>
        <MapView
          showsUserLocation
          ref={ref => {
            this.map = ref;
          }}
          style={styles.map}
          onMapReady={this.onMapReady}
          initialRegion={{
            latitude: LATITUDE,
            longitude: LONGITUDE,
            latitudeDelta: LATITUDE_DELTA,
            longitudeDelta: LONGITUDE_DELTA,
          }}
        >
          {TOUR_MARKERS.map((marker, i) => (
            <MapView.Marker
              key={i}
              coordinate={marker}
              pinColor={colors.PRIMARY_COLOR}
            />
          ))}
        </MapView>
      </View>
    );
  }
}
