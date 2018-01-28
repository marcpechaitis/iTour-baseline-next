/**
 * @flow
 */

'use strict';
import React, { Component } from 'react';
import {
  ActivityIndicator,
  Alert,
  AppState,
  AsyncStorage,
  Image,
  FlatList,
  Linking,
  ListView,
  Platform,
  RefreshControl,
  StatusBar,
  Text,
  TouchableHighlight,
  TouchableOpacity,
  View,
} from 'react-native';
// import { Actions } from 'react-native-router-flux';
import Config from 'react-native-config';
import GoogleAnalytics from 'react-native-google-analytics-bridge';
import SplashScreen from 'react-native-splash-screen';
import colors from '../helpers/colors';
import params from '../helpers/params';
import styles from '../helpers/styles';
import moment from 'moment';
import timezone from 'moment-timezone';
//import tranform from 'moment-transform';
moment().format();

let dataURL;
let responseData;
switch (params.BAND) {
  case 'DEAD':
    // Dead & Co.
    dataURL = Config.DATA_URL_DEAD;
    break;
  case 'DMB':
    // Dave Matthews Band
    dataURL = Config.DATA_URL_DMB;
    break;
  case 'PEARLJAM':
    // Pearl Jam
    dataURL = Config.DATA_URL_PEARLJAM;
    break;
  case 'PHISH':
    // Phish
    dataURL = Config.DATA_URL_PHISH;
    break;
  case 'RADIOHEAD':
    // Radiohead
    dataURL = Config.DATA_URL_RADIOHEAD;
    break;
  case 'SCI':
    // String Cheese Incident
    dataURL = Config.DATA_URL_SCI;
    break;
  case 'UMPHREYS':
    // Umphrey's McGee
    dataURL = Config.DATA_URL_UMPHREYS;
    break;
  case 'WSP':
    // Widespread Panic
    dataURL = Config.DATA_URL_WSP;
    break;
  default:
    dataURL = Config.DATA_URL_PHISH;
    break;
}

let REQUEST_URL = dataURL + '?nocache=' + new Date().getTime();
let userPositionSession;
const BLANK_STRING = ' ';

class MyListItem extends React.PureComponent {
  _onPress = () => {
    this.showEventDetail(this.props.event);
  };

  showEventDetail(event) {
    // Assign the showtimes and timezone to properties of the event

    const momentShow = moment(event.dateShow, moment.ISO_8601);
    event.momentShow = momentShow;
    event.timeShow = !event.dateShow
      ? ''
      : 'Show: ' + momentShow.format('h:mma');
    const momentMidnight = moment(momentShow);
    momentMidnight.set({ hour: 23, minute: 59, second: 59 });
    event.momentMidnight = momentMidnight;
    event.tzMidnight = timezone.tz(event.momentMidnight, event.timeZone);

    const momentDoors = moment(event.dateDoors, moment.ISO_8601);
    event.timeDoors = !event.dateDoors
      ? ''
      : ' Doors: ' + momentDoors.format('h:mma');

    const momentLots = moment(event.dateLots, moment.ISO_8601);
    event.timeLots = !event.dateLots
      ? ''
      : ' Lots: ' + momentLots.format('h:mma');

    const tzEvent = timezone.tz(event.dateShow, event.timeZone);
    event.tzShow = tzEvent;
    event.timezone =
      typeof tzEvent !== 'undefined' ? ' ' + tzEvent.zoneAbbr() : '';

    event.title = momentShow.format('ddd, MMM D');
    event.YYYYMMDD = momentShow.format('YYYYMMDD');

    // event.isLocationError = this.state.isLocationError;
    // event.userPosition = this.state.userPosition;

    //    Actions.EventDetail({ event });

    this.props.navigation.navigate('EventDetail', { event: event });
  }

  render() {
    const tzShow = timezone.tz(
      this.props.event.dateShow,
      this.props.event.timeZone
    );
    const dateString = tzShow.month() + 1 + '/' + tzShow.date();

    let city =
      typeof this.props.event.city !== 'undefined' &&
      this.props.event.city !== ''
        ? this.props.event.city + ', '
        : '';

    let country = this.props.event.country;
    let aSpace = ' ';
    return (
      // <TouchableOpacity onPress={this.showEventDetail(this.props.event)}>
      // <TouchableOpacity onPress={console.log('press')}>
      // <TouchableOpacity onPress={this._onPress}>
      //   <View>
      //     <Text>{this.props.event.city}</Text>
      //   </View>
      // </TouchableOpacity>
      <TouchableHighlight
        onPress={this._onPress}
        underlayColor={colors.SPINNER_COLOR}
      >
        <View style={styles.listContentContainer}>
          <View style={styles.rowContainer}>
            <View style={styles.theRow1}>
              <View style={styles.venueContainer}>
                <Text style={styles.venue}>{this.props.event.venue}</Text>
              </View>
            </View>
            <View style={styles.theRow2}>
              <Text style={styles.date}>{dateString}</Text>
              <View style={styles.detailsContainer}>
                <View style={styles.locationContainer}>
                  <Text
                    style={styles.street}
                    ellipsizeMode="middle"
                    numberOfLines={1}
                  >
                    {this.props.event.address}
                  </Text>
                  {(() => {
                    if (country !== 'USA') {
                      return (
                        <Text
                          style={styles.cityState}
                          ellipsizeMode="middle"
                          numberOfLines={1}
                        >
                          {city}
                          {this.props.event.state}
                          {aSpace}
                          {this.props.event.country}
                        </Text>
                      );
                    }
                  })()}
                  {(() => {
                    if (country === 'USA') {
                      return (
                        <Text
                          style={styles.cityState}
                          ellipsizeMode="middle"
                          numberOfLines={1}
                        >
                          {city}
                          {this.props.event.state}
                        </Text>
                      );
                    }
                  })()}
                </View>
              </View>
            </View>
          </View>
          <View style={styles.separator} />
        </View>
      </TouchableHighlight>
    );
  }
}

class EventList extends Component {
  _keyExtractor = (event, index) => event.showID;

  constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
      isRefreshing: false,
      isError: false,
      // dataSource: new ListView.DataSource({
      //   rowHasChanged: (row1, row2) => row1 !== row2
      // }),
      userPosition: null,
      isLocationError: false,
    };
  }

  componentWillMount() {
    //    console.log('EventList componentWillMount');
    // if user is opening app for first time, or resuming app from background ('active')
    // we need to know where user is so we call determineLocation().  if user is leaving
    // app, we need to clear out the saved user location so the next time user opens app
    // it is retrieved again
    AppState.addEventListener(
      'change',
      //      {(state === 'active') ? this.determineLocation() : this.clearLocation()}
      state => {
        if (state === 'active') {
          this.determineLocation();
          // this.nagTheFreeAppUser();
        } else {
          this.clearLocation();
        }
      }
    );
  }

  componentDidMount() {
    console.log('EventList componentDidMount');
    SplashScreen.hide();
    //    this.nagTheFreeAppUser();
    this.fetchData();
    this.determineLocation();
  }

  componentWillUnmount() {
    //    console.log('EventDetail componentWillUnmount');
    AppState.removeEventListener('change', null);
  }

  clearLocation() {
    // call this method when user exits app to make sure we get the user's current location for the next session
    AsyncStorage.setItem(
      'iTourData_userLocationSession_' + params.BAND_NAME,
      BLANK_STRING
    );
  }

  async determineLocation() {
    try {
      userPositionSession = await AsyncStorage.getItem(
        'iTourData_userLocationSession_' + params.BAND_NAME
      );

      if (
        userPositionSession === BLANK_STRING ||
        userPositionSession === null
      ) {
        navigator.geolocation.getCurrentPosition(
          position => {
            this.setState({ userPosition: position });
            userPositionSession = position;
            AsyncStorage.setItem(
              'iTourData_userLocationSession_' + params.BAND_NAME,
              JSON.stringify(userPositionSession)
            );
          },
          error => {
            console.log('LOCATION ERROR! (EventList)');
          },
          { enableHighAccuracy: true, timeout: 10000, maximumAge: 1000 }
        );
      } else {
        // user position already determined and saved to device, do nothing
        userPositionSession = JSON.parse(userPositionSession);
        this.setState({ isError: false });
      }
    } catch (error) {
      // Error saving data
      GoogleAnalytics.trackException(error.message, false);
    }
  }

  async fetchData() {
    if (this.state.isRefreshing) {
      return;
    }

    this.setState({ isRefreshing: true });

    try {
      let response = await fetch(REQUEST_URL);
      if (response.status === 200) {
        // let responseData = await response.json();
        responseData = await response.json();

        try {
          await AsyncStorage.setItem(
            'iTourData_' + params.BAND_NAME,
            JSON.stringify(responseData)
          );
          //          console.log('iTourData saved!');
        } catch (error) {
          // Error saving data
          GoogleAnalytics.trackException(error.message, false);
        }

        this.setState({
          //        dataSource: this.state.dataSource.cloneWithRows(responseData),
          isLoading: false,
          isRefreshing: false,
          isError: false,
        });
      } else {
        // get dataSource stored on the device
        try {
          AsyncStorage.getItem(
            'iTourData_' + params.BAND_NAME,
            (error, responseData) => {
              //          console.log('iTourData retrieved!');
              this.setState({
                dataSource: this.state.dataSource.cloneWithRows(
                  JSON.parse(responseData)
                ),
                isLoading: false,
                isRefreshing: false,
                isError: false,
              });
            }
          );
        } catch (error) {
          // Error retrieving data from device
          this.setState({
            isLoading: false,
            isRefreshing: false,
            isError: true,
          });
        }
      }
    } catch (error) {
      console.log(error.message);
      GoogleAnalytics.trackException(error.message, false);
      this.setState({ isLoading: false, isRefreshing: false, isError: true });
    }
  }
  _onRefresh() {
    setTimeout(() => {
      this.fetchData();
    }, 5000);
  }

  _renderItem = ({ item }) => (
    <MyListItem
      id={item.showID}
      onPressItem={this._onPressItem}
      // selected={!!this.state.selected.get(item.id)}
      navigation={this.props.navigation}
      event={item}
      title={item.venue}
      containerStyle={{ borderBottomWidth: 0 }}
    />
  );

  render() {
    if (this.state.isLoading) {
      return this.renderLoadingView();
    }

    if (this.state.isError) {
      return this.renderLoadingError();
    }
    console.log(
      'SCREEN PROPS LIST ' + JSON.stringify(this.props.screenProps.bingo)
    );
    return (
      <View
        style={styles.listView}
        // backgroundColor={colors.SECONDARY_BG_COLOR}
        // style={{ paddingTop: 50 }}
      >
        <StatusBar
          backgroundColor={colors.STATUS_BAR_COLOR}
          // backgroundColor="rgba(0, 0, 0, 0.20)"
          barStyle="light-content"
          // translucent={true}
        />

        <FlatList
          data={responseData}
          // data={this.props.screenProps.bingo}
          extraData={this.state}
          keyExtractor={this._keyExtractor}
          renderItem={this._renderItem}
          refreshControl={
            <RefreshControl
              refreshing={this.state.isRefreshing}
              onRefresh={this._onRefresh.bind(this)}
              tintColor={colors.SPINNER_COLOR}
              title="Updating shows..."
              color={colors.APP_TEXT_COLOR}
              titleColor={colors.APP_TEXT_COLOR}
              colors={[
                colors.SPINNER_COLOR,
                colors.SPINNER_COLOR,
                colors.SPINNER_COLOR,
              ]}
              progressBackgroundColor={colors.SECONDARY_BG_COLOR}
              backgroundColor={colors.SECONDARY_BG_COLOR}
            />
          }
        />
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
        <Text style={styles.loading}>Loading shows...</Text>
      </View>
    );
  }

  renderLoadingError() {
    return (
      <View style={(styles.appContainer, styles.loadingContainer)}>
        <TouchableHighlight
          onPress={() => this.fetchData()}
          underlayColor={colors.PRIMARY_COLOR}
        >
          <View style={styles.directionColumnContainer}>
            <Text
              style={[styles.appTextColor, styles.fontSize4, styles.centerText]}
            >
              Data Not
            </Text>
            <Text
              style={[styles.appTextColor, styles.fontSize4, styles.centerText]}
            >
              Available
            </Text>
          </View>
        </TouchableHighlight>
      </View>
    );
  }
}

module.exports = EventList;
