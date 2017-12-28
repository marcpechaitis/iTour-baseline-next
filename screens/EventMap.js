/**
 * @flow
 */

import React, { Component } from 'react';
import { Dimensions, Platform, StyleSheet, Text, View } from 'react-native';
import MapView from 'react-native-maps';

const { width, height, scale } = Dimensions.get('window'),
  vw = width / 100,
  vh = height / 100;

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    height: height,
    width: width,
    justifyContent: 'flex-end',
    alignItems: 'center'
  },
  map: {
    ...StyleSheet.absoluteFillObject
  }
});

export default class EventMap extends Component<{}> {
  render() {
    const { region } = this.props;
    console.log(region);

    return (
      <View style={styles.container}>
        <MapView
          style={styles.map}
          region={{
            latitude: 37.78825,
            longitude: -122.4324,
            latitudeDelta: 0.015,
            longitudeDelta: 0.0121
          }}
        />
      </View>
    );
  }
}
