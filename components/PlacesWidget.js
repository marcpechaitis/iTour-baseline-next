'use strict';

import React, { Component } from 'react';
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  Image,
  ScrollView,
  Text,
  TouchableHighlight,
  View,
} from 'react-native';
import colors from '../helpers/colors';
import styles from '../helpers/styles';
import Config from 'react-native-config';
import GoogleAnalytics from 'react-native-google-analytics-bridge';

var event;

const { width, height, scale } = Dimensions.get('window'),
  vw = width / 100,
  vh = height / 100,
  vmin = Math.min(vw, vh),
  vmax = Math.max(vw, vh);

class PlacesWidget extends Component {
  constructor(props) {
    super(props);
    event = this.props.event;
    this.state = {
      isLoading: true,
      isError: false,
      placeURL: '',
      placePhotoReference: '',
    };
  }

  componentWillMount() {
    //    console.log('PlacesWidget componentWillMount');
  }

  componentDidMount() {
    console.log('PlacesWidget componentDidMount');
    if (this.props.event.lat !== null && this.props.event.lat !== null) {
      this.fetchData();
    } else {
      this.setState({ isError: true });
    }
  }

  async fetchData() {
    this.setState({ isLoading: true });

    // First we need to get the photo reference from the places API
    let GOOGLE_PLACE_API_URL =
      'https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=';
    GOOGLE_PLACE_API_URL =
      GOOGLE_PLACE_API_URL + this.props.event.lat + ',' + this.props.event.lng;
    GOOGLE_PLACE_API_URL =
      GOOGLE_PLACE_API_URL +
      '&radius=750&rankby=prominence&name=' +
      this.props.event.venue;
    GOOGLE_PLACE_API_URL =
      GOOGLE_PLACE_API_URL + '&key=' + Config.GOOGLE_PLACES_API_KEY;
    GOOGLE_PLACE_API_URL = GOOGLE_PLACE_API_URL.replace(/ /g, '+');

    try {
      let response = await fetch(GOOGLE_PLACE_API_URL);
      // console.log('PLACE: ' + GOOGLE_PLACE_API_URL);
      // console.log('Places response: ' + JSON.stringify(response));
      // console.log('Places response status: ' + response.status);

      if (response.status === 200) {
        let responsePlaces = await response.json();
        console.log('Places response: ' + responsePlaces.status);
        if (responsePlaces.status === 'OK') {
          if (typeof responsePlaces.results[0].photos !== 'undefined') {
            this.setState({
              isLoading: false,
              placePhotoReference:
                responsePlaces.results[0].photos[0].photo_reference,
            });
          }
        } else {
          this.setState({
            isLoading: false,
            isError: true,
          });
          console.log('bingo 2');
        }
      } else {
        this.setState({
          isLoading: false,
          isError: true,
        });
        console.log('bingo 3');
      }
    } catch (error) {
      console.log(error.message);
      GoogleAnalytics.trackException(error.message, false);
      this.setState({
        isLoading: false,
        isError: true,
      });
    }
  }

  componentWillUnmount() {
    //    console.log('PlacesWidget componentWillUnmount');
  }

  render() {
    if (this.state.isError) {
      return <View />;
    } else {
      if (typeof this.state.placePhotoReference !== 'undefined') {
        let PLACE_PHOTO_URL =
          'https://maps.googleapis.com/maps/api/place/photo?maxwidth=';
        PLACE_PHOTO_URL =
          PLACE_PHOTO_URL +
          Math.round(270 * vw) +
          '&maxheight=' +
          Math.round(180 * vw);
        PLACE_PHOTO_URL =
          PLACE_PHOTO_URL + '&photoreference=' + this.state.placePhotoReference;
        PLACE_PHOTO_URL =
          PLACE_PHOTO_URL + '&key=' + Config.GOOGLE_PLACES_API_KEY;

        const resizeMode = 'cover';
        return (
          <View>
            <Image
              style={{ resizeMode, position: 'relative' }}
              source={{
                uri: PLACE_PHOTO_URL,
                width: width,
                height: 32 * vh,
              }}
            />
          </View>
        );
      } else {
        return;
      }
    }
  }
}

module.exports = PlacesWidget;
