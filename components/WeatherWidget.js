'use strict';

import React, { Component } from 'react';
import {
  ActivityIndicator,
  Alert,
  Text,
  TouchableHighlight,
  View,
} from 'react-native';
import colors from '../helpers/colors';
import { showWebBrowser } from '../helpers/common';
import params from '../helpers/params';
import styles from '../helpers/styles';
import { Actions } from 'react-native-router-flux';
import Config from 'react-native-config';
import { createIconSetFromIcoMoon } from 'react-native-vector-icons';
import icoMoonConfig from './WeatherIcons.json';
import GoogleAnalytics from 'react-native-google-analytics-bridge';
const Meteocon = createIconSetFromIcoMoon(icoMoonConfig);

class WeatherWidget extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoadingCurrent: true,
      isError: false,
      weatherCurrentData: null,
      colorBackground: colors.PRIMARY_BG_COLOR,
      colorFont: colors.APP_TEXT_COLOR,
      colorFontMax: colors.APP_TEXT_COLOR,
      colorFontMin: colors.APP_TEXT_COLOR,
      iconName: 'iconmonstr-weather-2',
      unitType: 'F',
      currentTemp: 0,
      currentMax: 0,
      currentMin: 0,
      lastPress: 0,
    };
  }

  componentDidMount() {
    this.fetchData();
  }

  async fetchData() {
    this.setState({ isLoadingCurrent: true });

    const WEATHER_CURRENT_URL =
      'https://api.darksky.net/forecast/' +
      Config.DARKSKY_API_KEY +
      '/' +
      this.props.event.lat +
      ',' +
      this.props.event.lng +
      '?units=auto';

    try {
      let response = await fetch(WEATHER_CURRENT_URL);

      if (response.status === 200) {
        let responseJson = await response.json();
        this.setState({
          isLoadingCurrent: false,
          weatherCurrentData: responseJson,
        });
        this.doWeatherStyling();
      } else {
        this.setState({
          isLoadingCurrent: false,
          isError: true,
        });
      }
    } catch (error) {
      console.log(error.message);
      GoogleAnalytics.trackException(error.message, false);
      this.setState({
        isLoadingCurrent: false,
        isError: true,
      });
    }
  }

  componentWillUnmount() {
    //    console.log('WeatherWidget componentWillUnmount');
  }

  render() {
    if (this.state.isLoadingCurrent) {
      return this.renderLoadingView();
    } else {
      if (this.state.isError) {
        return this.renderLoadingError();
      } else {
        return (
          <TouchableHighlight
            delayLongPress={1000}
            onPress={() => this.openWeatherURL()}
            onLongPress={() => this.switchUnits()}
            underlayColor={colors.PRIMARY_COLOR}
          >
            <View style={styles.weatherWidgetContainer}>
              <View style={styles.directionColumnContainer}>
                <View style={[styles.directionRowContainer]}>
                  <View>
                    <Meteocon
                      name={this.state.iconName}
                      style={[
                        { color: colors.APP_TEXT_COLOR },
                        styles.weatherIcon,
                      ]}
                      allowFontScaling={false}
                    />
                  </View>
                  <View>
                    <Text
                      style={[
                        { color: this.state.colorFont },
                        styles.weatherDetails,
                      ]}
                      allowFontScaling={false}
                    >
                      {Math.round(this.state.currentTemp)}°{this.state.unitType}
                    </Text>
                  </View>
                  <View style={styles.weatherMaxMin}>
                    <View style={styles.directionColumnContainer}>
                      <Text
                        style={[
                          { color: this.state.colorFontMax },
                          styles.fontSize4,
                        ]}
                        allowFontScaling={false}
                      >
                        {Math.round(this.state.currentMax)}°
                      </Text>
                      <Text
                        style={[
                          {
                            color: this.state.colorFontMin,
                          },
                          styles.fontSize4,
                        ]}
                        allowFontScaling={false}
                      >
                        {Math.round(this.state.currentMin)}°
                      </Text>
                    </View>
                  </View>
                </View>
                <View>
                  <Text
                    style={[
                      {
                        color: colors.APP_TEXT_COLOR,
                        paddingTop: 1,
                      },
                      styles.fontSize2,
                      styles.centerText,
                    ]}
                  >
                    Powered by Dark Sky
                  </Text>
                </View>
              </View>
            </View>
          </TouchableHighlight>
        );
      }
    }
  }
  renderLoadingView() {
    return (
      <View>
        <ActivityIndicator
          animating={this.state.isLoadingCurrent}
          size="small"
          color={colors.SPINNER_COLOR}
        />
        <Text style={[styles.appTextColor, styles.fontSize2]}>
          Powered by Dark Sky
        </Text>
      </View>
    );
  }
  renderLoadingError() {
    return (
      <View style={[styles.widgetContainer, styles.directionRowContainer]}>
        <View style={styles.directionColumnContainer}>
          <Text
            style={[styles.appTextColor, styles.fontSize3, styles.centerText]}
          >
            Weather:
          </Text>
          <Text
            style={[styles.appTextColor, styles.fontSize4, styles.centerText]}
          >
            Not Available
          </Text>
        </View>
      </View>
    );
  }
  openWeatherURL() {
    let targetURL =
      params.WEATHER_URL + this.props.event.lat + ',' + this.props.event.lng;
    let targetTitle = params.WEATHER_TITLE;
    GoogleAnalytics.trackEvent('WebView', 'weather', {
      label: this.props.event.YYYYMMDD + ' ' + this.props.event.altName,
      value: 0,
    });

    showWebBrowser(this.props.navigation, targetURL, targetTitle);
  }
  switchUnits() {
    /* method called when user Long Presses the widget.  Switches from F to C, and vice-versa */ if (
      this.state.unitType === 'F'
    ) {
      this.setState({
        unitType: 'C',
        currentTemp: (this.state.currentTemp - 32) / 1.8,
        currentMax: (this.state.currentMax - 32) / 1.8,
        currentMin: (this.state.currentMin - 32) / 1.8,
      });
    } else {
      this.setState({
        unitType: 'F',
        currentTemp: this.state.currentTemp * 1.8 + 32,
        currentMax: this.state.currentMax * 1.8 + 32,
        currentMin: this.state.currentMin * 1.8 + 32,
      });
    }
  }
  getTemperatureColor(temperature) {
    if (this.state.weatherCurrentData.flags.units != 'us') {
      temperature = temperature * 1.8 + 32;
      console.log('temp: ' + temperature);
    }

    switch (true) {
      case temperature <= -10:
        return '#ffffff';
        break;
      case temperature >= -10 && temperature < 0:
        return '#D1C9DF';
        break;
      case temperature >= 0 && temperature < 10:
        return '#A496C0';
        break;
      case temperature >= 10 && temperature < 20:
        // return '#3993CE';
        return '#89c4f4';
        break;
      case temperature >= 20 && temperature < 30:
        //    return '#0772B8';
        return '#19b5fe';
        break;
      case temperature >= 30 && temperature < 40:
        // return '#03902B';
        return '#03A678';
        break;
      case temperature >= 40 && temperature < 50:
        return '#2DC558';
        break;
      case temperature >= 50 && temperature < 60:
        return '#FECF3B';
        break;
      case temperature >= 60 && temperature < 70:
        return '#EC9800';
        break;
      case temperature >= 70 && temperature < 80:
        return '#DD531E';
        break;
      case temperature >= 80 && temperature < 90:
        return '#FF4500';
        break;
      case temperature >= 90 && temperature < 100:
        return '#FF0000';

        break;
      case temperature >= 100:
        // return '#6F0015';
        return '#D91E18';
        break;
      default:
        return colors.APP_TEXT_COLOR;
    }
  }

  doWeatherStyling() {
    /* get font and background colors based on Temperature */

    //let temperatureCurrent = this.state.weatherCurrentData.currently;
    //  .temperature;
    let units = this.state.weatherCurrentData.flags.units;
    let colorBackground = colors.PRIMARY_BG_COLOR;
    let { colorFont, colorFontMax, colorFontMin } = colors.APP_TEXT_COLOR;
    let currentConditionCode = this.state.weatherCurrentData.currently.icon;
    let iconName = 'iconmonstr-weather-2';

    switch (currentConditionCode) {
      case 'clear-day':
        iconName = 'iconmonstr-weather-2';
        break;
      case 'clear-night':
        iconName = 'iconmonstr-weather-115';
        break;
      case 'rain':
        iconName = 'iconmonstr-weather-14';
        break;
      case 'snow':
        iconName = 'iconmonstr-weather-50';
        break;
      case 'sleet':
        iconName = 'iconmonstr-weather-24';
        break;
      case 'wind':
        iconName = 'iconmonstr-weather-64';
        break;
      case 'fog':
        iconName = 'iconmonstr-weather-41';
        break;
      case 'cloudy':
        iconName = 'iconmonstr-weather-12';
        break;
      case 'partly-cloudy-day':
        iconName = 'iconmonstr-weather-8';
        break;
      case 'partly-cloudy-night':
        iconName = 'iconmonstr-weather-10';
        break;
      case 'hail':
        iconName = 'iconmonstr-weather-30';
        break;
      case 'thunderstorm':
        iconName = 'iconmonstr-weather-79';
        break;
      case 'tornado':
        iconName = 'iconmonstr-weather-88';
        break;
        g;
      default:
        iconName = 'iconmonstr-weather-2';
        break;
    } /* assign to state */
    this.setState({
      colorBackground: colorBackground,
      colorFont: this.getTemperatureColor(
        this.state.weatherCurrentData.currently.temperature
      ),
      colorFontMax: this.getTemperatureColor(
        this.state.weatherCurrentData.daily.data[0].temperatureMax
      ),
      colorFontMin: this.getTemperatureColor(
        this.state.weatherCurrentData.daily.data[0].temperatureMin
      ),
      iconName: iconName,
      unitType: units !== 'us' ? 'C' : 'F',
      currentTemp: this.state.weatherCurrentData.currently.temperature,
      currentMax: this.state.weatherCurrentData.daily.data[0].temperatureMax,
      currentMin: this.state.weatherCurrentData.daily.data[0].temperatureMin,
    });
  }
}
module.exports = WeatherWidget;
