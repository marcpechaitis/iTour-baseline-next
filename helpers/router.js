/**
 * @flow
 */
import React from 'react';
import { Platform, Text, TouchableOpacity, View } from 'react-native';
import { TabNavigator, StackNavigator, TabBarBottom } from 'react-navigation';
//import { Icon } from 'react-native-elements';

import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

// import Feed from '../screens/Feed';
// import Settings from '../screens/Settings';
// import UserDetail from '../screens/UserDetail';
// import Me from '../screens/Me';

import EventDetail from '../screens/EventDetail';
import EventList from '../screens/EventList';
import EventMap from '../screens/EventMap';
import WebBrowser from '../screens/WebBrowser';

import colors from '../helpers/colors';
import { showWebBrowser } from '../helpers/common';
import params from '../helpers/params';
import styles from '../helpers/styles';

console.log('yoyo');
//let  bingo = { foo: 'baro' };
let bingo = [
  {
    showID: 23,
    dateShow: '2017-12-29T20:00:00',
    dateDoors: '2017-12-29T19:00:00',
    dateLots: '',
    timeZone: 'America/New_York',
    venue: 'Fox Theatre',
    altName: 'Atlanta',
    notes: 'Capacity: 4,678',
    address: '660 Peachtree St NE',
    city: 'Atlanta',
    state: 'GA',
    postal: '30308',
    country: 'USA',
    phoneNbr: '404-881-2100',
    venueURL: 'http://foxtheatre.org/',
    setlistURL: 'http://www.everydaycompanion.com/setlists/20171229a.asp',
    seatingURL:
      'http://s1.ticketm.net/tm/en-us/tmimages/venue/maps/atl/3732s.gif',
    lat: '33.7725845',
    lng: '-84.3856028',
    confidence: '1',
  },
];
export const MainScreenNavigator = TabNavigator(
  {
    EventList: {
      //      screen: EventList,
      screen: ({ screenProps }) => <EventList screenProps={{ bingo }} />,
      navigationOptions: {
        tabBarLabel: 'List',
        tabBarIcon: ({ tintColor }) => (
          <MaterialIcons name="list" size={25} color={tintColor} />
        ),
      },
    },
    EventMap: {
      screen: ({ screenProps }) => <EventMap screenProps={{ bingo }} />,
      navigationOptions: {
        tabBarLabel: 'Map',
        tabBarIcon: ({ tintColor }) => (
          // <Icon name="account-circle" size={35} color={tintColor} />
          <MaterialIcons name="map" size={25} color={tintColor} />
        ),
      },
    },
  },
  {
    tabBarOptions: {
      activeTintColor: colors.APP_TEXT_COLOR,
      inactiveTintColor: colors.DISABLED_WASH,
      style: {
        backgroundColor: colors.PRIMARY_BG_COLOR,
      },
      indicatorStyle: {
        backgroundColor: colors.APP_TEXT_COLOR,
      },
      showIcon: true,
      showLabel: false,
      // tabStyle: { padding: 0 },
      allowFontScaling: false,
      pressColor: colors.APP_TEXT_COLOR,
    },
    animationEnabled: true,
    //   tabBarComponent: TabBarBottom,
    //   tabBarPosition: 'bottom'
  }
);

export const EventStack = StackNavigator(
  {
    EventList: {
      screen: MainScreenNavigator,
      navigationOptions: {
        title: params.APP_NAME,
        headerTintColor: 'white',
        headerStyle: styles.navBar,
        headerTitleStyle: styles.navBarTextStyle,
        headerBackTitleStyle: styles.navBarTextStyle,
        headerTitleAllowFontScaling: false,
        headerBackTitle: null,
        shadowColor: 'transparent',
        backgroundColor: 'transparent',
        borderBottomWidth: 0,
      },

      headerTitleAllowFontScaling: false,
    },
    EventDetail: {
      screen: EventDetail,
      navigationOptions: ({ navigation }) => ({
        title: `${navigation.state.params.event.title}`,
        headerTintColor: colors.APP_TEXT_COLOR,
        headerBackTitle: null,
        headerStyle: styles.navBar,
        headerTitleStyle: styles.navBarTextStyle,
        headerTitleAllowFontScaling: false,
        headerRight: (
          <TouchableOpacity
            onPress={() =>
              showWebBrowser(
                navigation,
                navigation.state.params.event.setlistURL,
                params.SETLIST_TITLE
              )
            }
          >
            <Text style={{ color: 'white', paddingRight: 16 }}>Setlist</Text>
          </TouchableOpacity>
          // <Button
          //   title="Setlist"
          //   // color={colors.APP_TEXT_COLOR}
          //   color={
          //     Platform.OS === 'ios'
          //       ? colors.APP_TEXT_COLOR
          //       : colors.PRIMARY_COLOR
          //   }
          //   onPress={() => Alert.alert('Setlist')}
          // />
        ),
        //  headerBackTitleStyle: styles.navBarTextStyle
        // title: 'bingo'
      }),
    },
    WebBrowser: {
      //      screen: WebBrowser,
      screen: ({ navigation, props }) => (
        <WebBrowser {...props} target={`${navigation.state.params.target}`} />
      ),
      navigationOptions: ({ navigation }) => ({
        title: `${navigation.state.params.targetTitle}`,
        // title: `${this.props.targetTitle}`,
        headerTintColor: colors.APP_TEXT_COLOR,
        headerBackTitle: null,
        headerStyle: styles.navBar,
        headerTitleStyle: styles.navBarTextStyle,
        headerTitleAllowFontScaling: false,
        headerRight: null,
      }),
    },
    // WebBrowser: {
    //   screen: WebBrowser,
    //   navigationOptions: ({ navigation }) => ({
    //     // title: `${navigation.state.params.event.title}}`
    //     title: `${this.props.navigation.targetTitle}`,
    //     headerTintColor: colors.APP_TEXT_COLOR,
    //     headerStyle: styles.navBar,
    //     headerTitleStyle: styles.navBarTextStyle,
    //     headerTitleAllowFontScaling: false
    //   }),
    //   target: this.props.navigation.target
    // }
  },
  {
    headerMode: 'screen',
  }
);

// export const SettingsStack = StackNavigator({
//   Settings: {
//     screen: Settings,
//     navigationOptions: {
//       title: 'Settings'
//     }
//   }
// });

export const Root = StackNavigator(
  {
    EventStack: {
      screen: EventStack,
    },
    // Settings: {
    //   screen: SettingsStack
    // }
  },
  {
    //     mode: 'card',
    headerMode: 'none',
  }
);
