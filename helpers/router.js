import React from 'react';
import { Alert, Platform, Text, TouchableOpacity } from 'react-native';
import { TabNavigator, StackNavigator, TabBarBottom } from 'react-navigation';
import { Icon } from 'react-native-elements';

import Feed from '../screens/Feed';
import Settings from '../screens/Settings';
import UserDetail from '../screens/UserDetail';
import Me from '../screens/Me';

import EventDetail from '../screens/EventDetail';
import EventList from '../screens/EventList';
import WebBrowser from '../screens/WebBrowser';

import colors from '../helpers/colors';
import { showWebBrowser } from '../helpers/common';
import params from '../helpers/params';
import styles from '../helpers/styles';

export const MainScreenNavigator = TabNavigator(
  {
    EventList: {
      screen: EventList,
      navigationOptions: {
        tabBarLabel: 'List',
        tabBarIcon: ({ tintColor }) => (
          <Icon name="list" size={35} color={tintColor} />
        )
      }
    },
    Me: {
      screen: Me,
      navigationOptions: {
        tabBarLabel: 'Me',
        tabBarIcon: ({ tintColor }) => (
          <Icon name="account-circle" size={35} color={tintColor} />
        )
      }
    }
  },
  {
    tabBarOptions: {
      activeTintColor: colors.APP_TEXT_COLOR,
      inactiveTintColor: colors.DISABLED_WASH,
      style: {
        backgroundColor: colors.PRIMARY_BG_COLOR
      },
      indicatorStyle: {
        backgroundColor: colors.APP_TEXT_COLOR
      },

      allowFontScaling: false
    }
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
        headerBackTitle: null,
        shadowColor: 'transparent',
        backgroundColor: 'transparent',
        borderBottomWidth: 0
      },

      headerTitleAllowFontScaling: false
    },
    EventDetail: {
      screen: EventDetail,
      navigationOptions: ({ navigation }) => ({
        title: `${navigation.state.params.event.title}`,
        headerTintColor: colors.APP_TEXT_COLOR,
        headerStyle: styles.navBar,
        headerTitleStyle: styles.navBarTextStyle,
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
        )
        //  headerBackTitleStyle: styles.navBarTextStyle
        // title: 'bingo'
      }),
      headerTitleAllowFontScaling: false
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
        headerStyle: styles.navBar,
        headerTitleStyle: styles.navBarTextStyle,
        headerTitleAllowFontScaling: false
      })
    }
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
    headerMode: 'screen'
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
      screen: EventStack
    }
    // Settings: {
    //   screen: SettingsStack
    // }
  },
  {
    //     mode: 'card',
    headerMode: 'none'
  }
);
