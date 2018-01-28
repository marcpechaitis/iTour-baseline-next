/**
 * @flow
 */

import React, { Component } from 'react';
import {
  ActivityIndicator,
  AsyncStorage,
  Dimensions,
  Platform,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import MapView from 'react-native-maps';
import colors from '../helpers/colors';
import params from '../helpers/params';
import styles from '../helpers/styles';

const { width, height, scale } = Dimensions.get('window'),
  vw = width / 100,
  vh = height / 100;
const ASPECT_RATIO = width / height;
// TODO - get user's location for starting Lat/Lng
const LATITUDE = 37.78825;
const LONGITUDE = -122.4324;
const LATITUDE_DELTA = 10.922;
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
// let TOUR_MARKERS = [
//   { latitude: 40.7505045, longitude: -73.9934387 },
//   { latitude: 39.9012015, longitude: -75.17197949999999 },
//   { latitude: 42.366198, longitude: -71.062146 },
//   { latitude: 38.89812510000001, longitude: -77.02088040000001 },
//   { latitude: 41.768399, longitude: -72.6769853 },
//   { latitude: 42.3410478, longitude: -83.0551629 },
//   { latitude: 39.9692127, longitude: -83.0060593 },
//   { latitude: 35.2251426, longitude: -80.8392351 },
//   { latitude: 33.7572891, longitude: -84.3963244 },
//   { latitude: 32.7905064, longitude: -96.8103549 },
//   { latitude: 30.2769548, longitude: -97.7322085 },
//   { latitude: 20.491521, longitude: -87.2427579 },
//   { latitude: 29.9490351, longitude: -90.08205679999999 },
//   { latitude: 28.539902, longitude: -81.38367199999999 },
//   { latitude: 26.1581467, longitude: -80.3254084 },
// ];

const DEFAULT_PADDING = { top: 60, right: 60, bottom: 60, left: 60 };

// const stylesMap = StyleSheet.create({
//   container: {
//     ...StyleSheet.absoluteFillObject,
//     height: height,
//     width: width,
//     justifyContent: 'flex-end',
//     alignItems: 'center',
//   },
//   map: {
//     ...StyleSheet.absoluteFillObject,
//   },
// });

export default class EventMap extends React.PureComponent {
  constructor(props) {
    super(props);
    this.map = null;
    this.state = {
      isLoading: true,
    };
  }

  componentWillMount() {
    this.getDataFromDevice();
  }
  componentDidMount() {
    console.log('EventMap loaded');
    // this.getDataFromDevice();
    if (this.state.isLoading === false) {
      //   this.map.fitToCoordinates(TOUR_MARKERS, {
      //     edgePadding: DEFAULT_PADDING,
      //     animated: true,
      //   });
      this.map.fitToSuppliedMarkers(
        TOUR_MARKERS,
        false // not animated
      );
    }
  }

  getDataFromDevice() {
    try {
      AsyncStorage.getItem(
        'iTourData_' + params.BAND_NAME,
        (error, responseData) => {
          // console.log('iTourData retrieved! ' + responseData);

          // for (var showID in responseData)
          //   TOUR_MARKERS.push([showID, responseData[showID]]);

          // TOUR_MARKERS = JSON.parse(responseData);
          if (responseData != null) {
            TOUR_MARKERS = this.removeDupes(JSON.parse(responseData));
          }
          console.log(JSON.stringify(TOUR_MARKERS));
          this.setState({ isLoading: false });
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

  removeDupes(incomingDataWithDupes) {
    let outgoingDataWithoutDupes = [];
    let previousVenues = [];

    incomingDataWithDupes.forEach(function(entry) {
      if (previousVenues.indexOf(entry.venue) === -1) {
        outgoingDataWithoutDupes.push(entry);
      }
      previousVenues.push(entry.venue);
    });

    return outgoingDataWithoutDupes;
  }

  onRegionChange = region => {
    if (!this.state.regionSet) return;
    this.setState({
      region,
    });
  };

  render() {
    if (this.state.isLoading) {
      return this.renderLoadingView();
    }
    // console.log('MARKERS ' + JSON.stringify(TOUR_MARKERS));
    //   console.log('MARKERS ' + JSON.stringify(MARKERS));
    console.log('SCREEN PROPS MAP ' + JSON.stringify(this.props.screenProps));
    //  TOUR_MARKERS = this.props.screenProps.bingo;
    return (
      <View style={styles.mapContainer}>
        <MapView
          showsUserLocation
          ref={ref => {
            this.map = ref;
          }}
          style={styles.map}
          // onLayout={() =>
          //   this.map.fitToCoordinates(TOUR_MARKERS, {
          //     edgePadding: { top: 10, right: 10, bottom: 10, left: 10 },
          //     animated: false,
          //   })
          // }
          onLayout={() => console.log('Map onLayout')}
          // onMapReady={() => console.log('Map onReady')}
          // onMapReady={
          //   () =>
          //     this.map.fitToCoordinates(TOUR_MARKERS, {
          //       edgePadding: { top: 10, right: 10, bottom: 10, left: 10 },
          //       animated: false,
          //     })

          //   this.map.fitToSuppliedMarkers(
          //     TOUR_MARKERS,
          //     false // not animated
          //   )
          // }
          // onRegionChangeComplete={region => this.props.changeRegion(region)}

          initialRegion={{
            latitude: LATITUDE,
            longitude: LONGITUDE,
            latitudeDelta: LATITUDE_DELTA,
            longitudeDelta: LONGITUDE_DELTA,
          }}
        >
          {TOUR_MARKERS.map((event, i) => (
            <MapView.Marker
              key={i}
              ref={comp => (this['callout-' + i] = comp)}
              zIndex={0}
              onPress={() => {
                TOUR_MARKERS.map((marker, index) => {
                  this['callout-' + index].setNativeProps({ zIndex: 0 });
                });
                this['callout-' + i].setNativeProps({ zIndex: 9999 });
              }}
              title={event.venue}
              coordinate={{
                latitude: parseFloat(event.lat),
                longitude: parseFloat(event.lng),
              }}
              pinColor={colors.PRIMARY_COLOR}
              onCalloutPress={e => console.log('calloutPress')}
              // onPress={e => console.log('markerPress')}
              // onMarkerPress={() => {
              //   // fixes callout overlay bug
              //   this.map.animateToCoordinate(
              //     {
              //       latitude: this.latitude + this.latitudeDelta * 0.01,
              //       longitude: this.longitude + this.longitudeDelta * 0.01,
              //     },
              //     0
              //   );
              // }}
            />
          ))}
        </MapView>
      </View>
    );
  }

  renderLoadingView() {
    return (
      <View style={(styles.appContainer, styles.loadingContainer)}>
        <ActivityIndicator
          animating={this.state.isLoading}
          size="large"
          color={colors.SPINNER_COLOR}
        />
        <Text style={styles.loading}>Loading map...</Text>
      </View>
    );
  }
}
