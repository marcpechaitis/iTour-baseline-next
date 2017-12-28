'use strict';
import React, { Component } from 'react';
import {
  ActivityIndicator,
  Alert,
  AppState,
  AsyncStorage,
  Image,
  Linking,
  Platform,
  Text,
  TouchableHighlight,
  TouchableOpacity,
  View,
} from 'react-native';
import styles from '../helpers/styles';
import colors from '../helpers/colors';
import params from '../helpers/params';
import { showWebBrowser } from '../helpers/common';
// import { Actions } from 'react-native-router-flux';
import ActionButton from 'react-native-action-button';
import Config from 'react-native-config';
import Dimensions from 'Dimensions';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import GoogleAnalytics from 'react-native-google-analytics-bridge';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import DistanceWidget from '../components/DistanceWidget';
import MapImageWidget from '../components/MapImageWidget';
import PlacesWidget from '../components/PlacesWidget';
import WeatherWidget from '../components/WeatherWidget';
import CountdownWidget from '../components/CountdownWidget';

const { width, height, scale } = Dimensions.get('window'),
  vw = width / 100,
  vh = height / 100,
  vmin = Math.min(vw, vh),
  vmax = Math.max(vw, vh);

let event;
let mapsURL;

class EventDetail extends Component {
  constructor(props) {
    super(props);
    let IphoneXBottomOffset = 30;

    if (Platform.OS === 'ios' && Dimensions.get('window').height === 812) {
      IphoneXBottomOffset = 80;
    } else {
      console.log('ho ho');
    }

    this.state = {
      isLoadingGeocodeData: true,
      LoadingText: 'Loading Show...',
      isError: false,
      theEvent: this.props.navigation.state.params.event,
      geocodeData: null,
      userPosition: null,
      isFindingUser: false,
      IphoneXBottomOffset: IphoneXBottomOffset,
    };
  }

  componentWillMount() {}

  componentDidMount() {
    // Actions.refresh({
    //   title: this.props.navigation.state.params.event.title,
    //   rightTitle: 'Setlist',
    //   rightButtonTextStyle: styles.appTextColor,
    //   onRight: () => this.getURLAndCallWebBrowser('setlist')
    // });
    const params = {
      right: (
        <TouchableOpacity
          onPress={() => this.getURLAndCallWebBrowser('setlist')}
        >
          <Text style={{ color: 'white', paddingRight: 16 }}>Setlist</Text>
        </TouchableOpacity>
      ),
    };
    this.props.navigation.setParams(params);
    GoogleAnalytics.trackScreenView(
      this.props.navigation.state.params.event.YYYYMMDD +
        ' ' +
        this.props.navigation.state.params.event.altName
    );
    this.getEventLocation();
  }

  getEventLocation() {
    // load the event latitude and longitude from local storage, if it exists
    try {
      AsyncStorage.multiGet(
        [event.venue + '.lat', event.venue + '.lng'],
        (error, stores) => {
          this.props.navigation.state.params.event.lat = stores[0][1];
          this.props.navigation.state.params.event.lng = stores[1][1];

          if (
            this.props.navigation.state.params.event.lat === null ||
            this.props.navigation.state.params.event.lng === null
          ) {
            // local storage does not exist, fetch it from API
            this.fetchGeocode();
          } else {
            this.setState({ isLoadingGeocodeData: false });
          }
        }
      );
    } catch (error) {
      // Error getting local data
      console.log(error.message);
      GoogleAnalytics.trackException(error.message, false);
      this.fetchGeocode();
    }
  }

  async fetchGeocode() {
    let GEOCODE_URL =
      'https://maps.googleapis.com/maps/api/geocode/json?address=';
    GEOCODE_URL =
      GEOCODE_URL +
      this.props.navigation.state.params.event.address +
      ',+' +
      this.props.navigation.state.params.event.city +
      ',+' +
      this.props.navigation.state.params.event.state +
      ' ';
    GEOCODE_URL =
      GEOCODE_URL +
      this.props.navigation.state.params.event.postal +
      '&key=' +
      Config.GOOGLE_GEOCODE_API_KEY;
    GEOCODE_URL = GEOCODE_URL.replace(/ /g, '+');

    try {
      let response = await fetch(GEOCODE_URL);

      if (response.status === 200) {
        let responseJson = await response.json();
        if (responseJson.status === 'OK') {
          try {
            // now that we have the response, save the values to local storage so we don't have to call API again for this venue
            await AsyncStorage.multiSet([
              [
                this.props.navigation.state.params.event.venue + '.lat',
                JSON.stringify(responseJson.results[0].geometry.location.lat),
              ],
              [
                this.props.navigation.state.params.event.venue + '.lng',
                JSON.stringify(responseJson.results[0].geometry.location.lng),
              ],
            ]);
            //          console.log(this.props.navigation.state.params.event.venue + ' location saved!');
          } catch (error) {
            // Error saving data
            console.log(error.message);
            GoogleAnalytics.trackException(error.message, false);
          }

          this.props.navigation.state.params.event.lat =
            responseJson.results[0].geometry.location.lat;
          this.props.navigation.state.params.event.lng =
            responseJson.results[0].geometry.location.lng;
          this.setState({
            isLoadingGeocodeData: false,
            theEvent: this.props.navigation.state.params.event,
            geocodeData: responseJson,
          });
        } else {
          // Something is wrong and we did not get expected results for the address.  Let's try searching on venue name
          let GEOCODE_URL =
            'https://maps.googleapis.com/maps/api/place/textsearch/json?query=';
          GEOCODE_URL =
            GEOCODE_URL +
            this.props.navigation.state.params.event.venue +
            '&key=' +
            Config.GOOGLE_GEOCODE_API_KEY;
          GEOCODE_URL = GEOCODE_URL.replace(/ /g, '+');

          try {
            let response = await fetch(GEOCODE_URL);

            if (response.status === 200) {
              let responseJson = await response.json();
              if (responseJson.status === 'OK') {
                try {
                  // now that we have the response, save the values to local storage so we don't have to call API again for this venue
                  await AsyncStorage.multiSet([
                    [
                      this.props.navigation.state.params.event.venue + '.lat',
                      JSON.stringify(
                        responseJson.results[0].geometry.location.lat
                      ),
                    ],
                    [
                      this.props.navigation.state.params.event.venue + '.lng',
                      JSON.stringify(
                        responseJson.results[0].geometry.location.lng
                      ),
                    ],
                  ]);
                } catch (error) {
                  // Error saving data
                  console.log(error.message);
                  GoogleAnalytics.trackException(error.message, false);
                }

                this.props.navigation.state.params.event.lat =
                  responseJson.results[0].geometry.location.lat;
                this.props.navigation.state.params.event.lng =
                  responseJson.results[0].geometry.location.lng;
                this.setState({
                  isLoadingGeocodeData: false,
                  theEvent: this.props.navigation.state.params.event,
                  geocodeData: responseJson,
                });
              } else {
                this.setState({ isLoadingGeocodeData: false, isError: true });
              }
            }
          } catch (error) {
            // something wrong with the API response
            console.log(error.message);
            GoogleAnalytics.trackException(error.message, false);
            Alert.alert('Network Problems', 'Check your network connection');
            this.setState({ isLoadingGeocodeData: false, isError: true });
          }
        }
      } else {
        this.setState({ isError: true });
      }
    } catch (error) {
      // something wrong with the API response
      console.log(error.message);
      GoogleAnalytics.trackException(error.message, false);
      Alert.alert('Network Problems', 'Check your network connection');
      this.setState({ isLoadingGeocodeData: false, isError: true });
    }
  }

  componentWillUnmount() {
    AppState.removeEventListener('change', null);
  }

  render() {
    //  event = this.props.navigation.state.params.event;
    event = this.props.navigation.state.params.event;
    console.log('BEFORE LAT/LNG: ' + event.lat + ' ' + event.lng);
    if (this.state.isLoadingGeocodeData) {
      return this.renderLoadingView();
    } else {
      const altName = typeof event.altName !== 'undefined' ? event.altName : '';
      const notes = typeof event.notes !== 'undefined' ? event.notes : '';
      const eventTimes =
        event.timeShow + event.timeDoors + event.timeLots + event.timezone;
      const venue = typeof event.venue !== 'undefined' ? event.venue : '';
      const address = typeof event.address !== 'undefined' ? event.address : '';
      const city =
        typeof event.city !== 'undefined' && event.city !== ''
          ? event.city + ', '
          : '';
      const state = typeof event.state !== 'undefined' ? event.state : '';
      const postal =
        typeof event.postal !== 'undefined' ? ' ' + event.postal : '';
      const cityStatePostal = city + state + postal;
      const country = typeof event.country !== 'undefined' ? event.country : '';
      const phone = typeof event.phoneNbr !== 'undefined' ? event.phoneNbr : '';
      const phoneToCall = phone.replace(/-/g, '');

      return (
        <View>
          {/* <View style={[styles.headerContainer]} /> */}
          <View style={[styles.contentContainer]}>
            <View style={[styles.infoContainer, styles.eventInfoContainer]}>
              <PlacesWidget event={this.state.theEvent} />
              <View
                style={{
                  position: 'absolute',
                  flex: 1,
                  justifyContent: 'center',
                  alignItems: 'center',
                  width: width,
                  height: 32 * vh,
                }}
              >
                <TouchableHighlight
                  onPress={() => this.getURLAndCallWebBrowser('venue')}
                  underlayColor={colors.PRIMARY_COLOR}
                >
                  <View>
                    <Text
                      style={[
                        styles.appTextColor,
                        styles.altName,
                        styles.overlayText,
                      ]}
                    >
                      {altName}
                    </Text>
                  </View>
                </TouchableHighlight>
                {(() => {
                  if (notes) {
                    return (
                      <Text
                        style={[
                          styles.appTextColor,
                          styles.notes,
                          styles.overlayText,
                        ]}
                      >
                        {notes}
                      </Text>
                    );
                  }
                })()}
                <Text
                  style={[
                    styles.appTextColor,
                    styles.eventTimes,
                    styles.overlayText,
                  ]}
                >
                  {eventTimes}
                </Text>
                <View style={styles.locationContainerDetail}>
                  <TouchableHighlight
                    onPress={() => this.getDirectionsViaMapsApp()}
                    underlayColor={colors.PRIMARY_COLOR}
                  >
                    <View>
                      <Text
                        style={[
                          styles.appTextColor,
                          styles.venueDetail,
                          styles.overlayText,
                        ]}
                      >
                        {venue}
                      </Text>
                      <Text
                        style={[
                          styles.appTextColor,
                          styles.address,
                          styles.overlayText,
                        ]}
                      >
                        {address}
                      </Text>
                      <Text
                        style={[
                          styles.appTextColor,
                          styles.address,
                          styles.overlayText,
                        ]}
                      >
                        {cityStatePostal}
                      </Text>
                      {(() => {
                        if (country !== 'USA') {
                          return (
                            <Text
                              style={[
                                styles.appTextColor,
                                styles.address,
                                styles.overlayText,
                              ]}
                            >
                              {country}
                            </Text>
                          );
                        }
                      })()}
                    </View>
                  </TouchableHighlight>
                  {(() => {
                    if (phone !== '') {
                      return (
                        <TouchableHighlight
                          onPress={() => this.makePhoneCall(phoneToCall)}
                          underlayColor={colors.PRIMARY_COLOR}
                        >
                          <View>
                            <Text
                              style={[
                                styles.appTextColor,
                                styles.phone,
                                styles.overlayText,
                              ]}
                            >
                              {phone}
                            </Text>
                          </View>
                        </TouchableHighlight>
                      );
                    }
                  })()}
                </View>
              </View>
              {/* </PlacesWidget> */}
            </View>

            <View style={[styles.infoContainer, styles.extraInfoContainer]}>
              {(() => {
                if (!this.state.isFindingUser) {
                  return (
                    <TouchableHighlight
                      onPress={() => this.getDirectionsViaMapsApp()}
                      underlayColor={colors.PRIMARY_COLOR}
                    >
                      <View>
                        <DistanceWidget event={this.state.theEvent} />
                      </View>
                    </TouchableHighlight>
                  );
                } else {
                  return (
                    <View>
                      <ActivityIndicator
                        animating={this.state.isFindingUser}
                        size="small"
                        color={colors.SPINNER_COLOR}
                      />
                      <Text
                        style={[
                          styles.appTextColor,
                          styles.fontSize2,
                          styles.centerText,
                        ]}
                      >
                        Finding your location...
                      </Text>
                    </View>
                  );
                }
              })()}
              <View>
                <WeatherWidget
                  event={this.state.theEvent}
                  navigation={this.props.navigation}
                />
              </View>
              <CountdownWidget event={this.state.theEvent} />
            </View>

            {/* <TouchableHighlight
              onPress={() => this.openMapAtEventLocation()}
              underlayColor={colors.PRIMARY_COLOR}
            > */}
            <View style={[styles.infoContainer, styles.mapInfoContainer]}>
              <MapImageWidget event={this.state.theEvent} />
              <View
                style={[styles.infoContainer, styles.placePictureInfoContainer]}
              />
            </View>
            {/* </TouchableHighlight> */}
            <ActionButton
              buttonColor={colors.PRIMARY_COLOR}
              backdrop={<View style={styles.actionButtonBackground} />}
              icon={
                <Ionicons
                  name="md-more"
                  color={colors.APP_TEXT_COLOR}
                  size={28}
                />
              }
              offsetY={this.state.IphoneXBottomOffset}
            >
              <ActionButton.Item
                buttonColor={colors.APP_TEXT_COLOR}
                title="Directions"
                onPress={() => this.getDirectionsViaMapsApp()}
              >
                <MaterialIcons
                  name="directions"
                  style={styles.actionButtonIcon}
                />
              </ActionButton.Item>
              <ActionButton.Item
                buttonColor={colors.APP_TEXT_COLOR}
                title="Tickets"
                onPress={() => this.getURLAndCallWebBrowser('tickets')}
              >
                <FontAwesome name="ticket" style={styles.actionButtonIcon} />
              </ActionButton.Item>
              <ActionButton.Item
                buttonColor={colors.APP_TEXT_COLOR}
                title="Local Music"
                onPress={() => this.getURLAndCallWebBrowser('music')}
              >
                <Ionicons
                  name="md-musical-notes"
                  style={styles.actionButtonIcon}
                />
              </ActionButton.Item>
              <ActionButton.Item
                buttonColor={colors.APP_TEXT_COLOR}
                title="Seating Chart"
                onPress={() => this.getURLAndCallWebBrowser('seating')}
              >
                <MaterialIcons
                  name="event-seat"
                  style={styles.actionButtonIcon}
                />
              </ActionButton.Item>
              <ActionButton.Item
                buttonColor={colors.APP_TEXT_COLOR}
                title="Videos"
                onPress={() => this.getURLAndCallWebBrowser('videos')}
              >
                <Ionicons name="logo-youtube" style={styles.actionButtonIcon} />
              </ActionButton.Item>
            </ActionButton>
          </View>
        </View>
      );
    }
  }

  renderLoadingView() {
    return (
      <View style={(styles.appContainer, styles.loadingContainer)}>
        <ActivityIndicator
          animating={this.state.isLoadingGeocodeData}
          size="large"
          color={colors.SPINNER_COLOR}
        />
        <Text style={styles.loading}>{this.state.LoadingText}</Text>
      </View>
    );
  }

  getDirectionsViaMapsApp() {
    GoogleAnalytics.trackEvent('Map', 'directions', {
      label:
        this.props.navigation.state.params.event.YYYYMMDD +
        ' ' +
        this.props.navigation.state.params.event.altName,
      value: 0,
    });
    //    this.determineLocation();
    if (
      this.props.navigation.state.params.event.lat !== null &&
      this.props.navigation.state.params.event.lng !== null
    ) {
      this.setState({
        isFindingUser: true,
        LoadingText: 'Finding current location...',
      });
      try {
        navigator.geolocation.getCurrentPosition(
          position => {
            if (
              position.coords.latitude !== 'undefined' &&
              position.coords.latitude !== 'undefined'
            ) {
              this.setState({ isFindingUser: false });
              mapsURL =
                'http://maps.apple.com/?saddr=' +
                position.coords.latitude +
                ',';
              mapsURL = mapsURL + position.coords.longitude + '&daddr=';
              mapsURL =
                mapsURL +
                this.props.navigation.state.params.event.lat +
                ',' +
                this.props.navigation.state.params.event.lng;
              Linking.canOpenURL(mapsURL)
                .then(supported => {
                  if (!supported) {
                    console.log("Can't handle url: " + mapsURL);
                  } else {
                    return Linking.openURL(mapsURL);
                  }
                })
                .catch(
                  err => console.log('An error occurred', err),
                  GoogleAnalytics.trackException('Error Opening Maps', false)
                );
            } else {
              this.setState({ isFindingUser: false });
              Alert.alert(
                'Location Error',
                params.APP_NAME +
                  ' encountered a problem finding your location.',
                [{ text: 'OK', onPress: () => this.openMapAtEventLocation() }]
              );
            }
          },
          error => {
            console.log('LOCATION ERROR! (EventList)');

            this.setState({ isFindingUser: false });
            Alert.alert(
              'Location Error',
              params.APP_NAME + ' encountered a problem finding your location.',
              [{ text: 'OK', onPress: () => this.openMapAtEventLocation() }]
            );
          },
          { enableHighAccuracy: true, timeout: 10000, maximumAge: 1000 }
        );
      } catch (error) {
        // Error saving data
        GoogleAnalytics.trackException(error.message, false);
      }
    } else {
      this.getEventLocation();
    }
  }

  makePhoneCall(phoneNbrToCall) {
    GoogleAnalytics.trackEvent('Phone', 'venue', {
      label:
        this.props.navigation.state.params.event.YYYYMMDD +
        ' ' +
        this.props.navigation.state.params.event.altName,
      value: 0,
    });
    const phoneURL = 'tel:' + phoneNbrToCall;
    this.LaunchURL(phoneURL);
  }

  LaunchURL(url) {
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

  openMapAtEventLocation() {
    GoogleAnalytics.trackEvent('Map', 'venue', {
      label:
        this.props.navigation.state.params.event.YYYYMMDD +
        ' ' +
        this.props.navigation.state.params.event.altName,
      value: 0,
    });
    if (
      this.props.navigation.state.params.event.lat !== null &&
      this.props.navigation.state.params.event.lng !== null
    ) {
      let mapsURL = 'http://maps.apple.com/?ll=';
      mapsURL =
        mapsURL +
        this.props.navigation.state.params.event.lat +
        ',' +
        this.props.navigation.state.params.event.lng;
      mapsURL =
        mapsURL + '&q=' + this.props.navigation.state.params.event.venue;

      this.LaunchURL(mapsURL);
    } else {
      this.getEventLocation();
    }
  }

  getURLAndCallWebBrowser(targetType) {
    let targetURL = params.BAND_URL_DEFAULT;
    let targetTitle = params.BAND_NAME;
    GoogleAnalytics.trackEvent('WebView', targetType, {
      label:
        this.props.navigation.state.params.event.YYYYMMDD +
        ' ' +
        this.props.navigation.state.params.event.altName,
      value: 0,
    });
    switch (targetType) {
      case 'music':
        if (this.props.navigation.state.params.event.country === 'USA') {
          targetURL =
            params.MUSIC_URL1 +
            this.props.navigation.state.params.event.YYYYMMDD +
            params.MUSIC_URL2 +
            this.props.navigation.state.params.event.postal +
            params.MUSIC_URL3;
        } else {
          targetURL = params.MUSIC_URL_NON_USA;
        }
        targetTitle = params.MUSIC_TITLE;
        break;
      case 'seating':
        targetURL = this.props.navigation.state.params.event.seatingURL;
        targetTitle = params.SEATING_TITLE;
        break;
      case 'setlist':
        targetURL = this.props.navigation.state.params.event.setlistURL;
        targetTitle = params.SETLIST_TITLE;
        break;
      case 'tickets':
        targetURL = params.TICKETS_URL;
        targetTitle = params.TICKETS_TITLE;
        break;
      case 'venue':
        targetURL = this.props.navigation.state.params.event.venueURL;
        targetTitle = this.props.navigation.state.params.event.venue;
        break;
      case 'videos':
        targetURL =
          params.VIDEO_URL + this.props.navigation.state.params.event.altName;
        targetURL = targetURL.replace(/ /g, '%20');
        targetTitle = params.VIDEO_TITLE;
        break;
      case 'weather':
        targetURL =
          params.WEATHER_URL +
          this.props.navigation.state.params.event.lat +
          ',' +
          this.props.navigation.state.params.event.lng;
        targetTitle = params.WEATHER_TITLE;
        break;
      default:
        targetURL = params.BAND_URL_DEFAULT;
        targetTitle = params.BAND_NAME;
    }

    // this.showWebBrowser(targetURL, targetTitle);
    showWebBrowser(this.props.navigation, targetURL, targetTitle);
  }

  // showWebBrowser(targetURL, targetTitle) {
  //   // Actions.WebBrowser({ target: targetURL, targetTitle: targetTitle });
  //   this.props.navigation.navigate('WebBrowser', {
  //     target: targetURL,
  //     targetTitle: targetTitle
  //   });
  //   console.log('open WebView');
  // }
}

module.exports = EventDetail;
