'use strict';

import React, { Component } from 'react';
import { ActivityIndicator, Alert, Text, View } from 'react-native';
import styles from '../helpers/styles';
import moment from 'moment';

class CountdownWidget extends Component {
  constructor(props) {
    super(props);

    let countdownDisplay1;
    let countdownDisplay2;
    let countdown = moment(this.props.event.tzShow).diff(
      moment.now(),
      'days',
      true
    );
    let countdownToday = this.props.event.tzShow.fromNow(true);

    switch (true) {
      case countdown <= -1:
        countdownDisplay1 = 'Occurred';
        countdownDisplay2 = Math.round(countdown) * -1 + ' days ago';
        break;
      case countdown < 0 && countdown > -1:
        // show is in the past
        // if it is not yet midnight, display how long ago the show started
        if (moment(moment.now()).diff(this.props.event.momentMidnight) < 0) {
          countdownDisplay1 = 'Show started';
          countdownDisplay2 = countdownToday + ' ago';
        } else {
          // it is after midnight
          countdownDisplay1 = 'Occurred';
          countdownDisplay2 = 'Yesterday';
        }
        break;
      case countdown >= 0 && countdown < 1:
        /* show is today */
        countdownDisplay1 = 'Show starts in';
        countdownDisplay2 = countdownToday;
        break;
      case countdown >= 1 && countdown < 2:
        /* show is tomorrow */
        countdownDisplay1 = 'Show is';
        countdownDisplay2 = 'Tomorrow';
        break;
      case countdown > 2:
        /* show is in the future, after tomorrow */
        countdownDisplay1 = 'Occurs in';
        countdownDisplay2 = countdown - countdown % 1 + ' days';
        break;
      default:
        countdownDisplay1 = 'Countdown Not';
        countdownDisplay2 = 'Available';
        break;
    }

    this.state = {
      countdownDisplay1: countdownDisplay1,
      countdownDisplay2: countdownDisplay2
    };
  }

  componentDidMount() {
    //		console.log('CountdownWidget componentDidMount');
  }

  render() {
    return (
      <View
        style={[
          styles.widgetContainer,
          styles.directionColumnContainer,
          styles.justifySpaceAround
        ]}
      >
        <Text
          style={[styles.appTextColor, styles.fontSize3, styles.centerText]}
        >
          {this.state.countdownDisplay1}
        </Text>
        <Text
          style={[styles.appTextColor, styles.fontSize4, styles.centerText]}
        >
          {this.state.countdownDisplay2}
        </Text>
      </View>
    );
  }
}

module.exports = CountdownWidget;
