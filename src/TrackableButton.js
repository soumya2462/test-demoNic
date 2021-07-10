import React from 'react';
import { TouchableHighlight, TouchableOpacity, Text } from 'react-native';
import PropTypes from 'prop-types';
import { logEvent } from './AnalyticsEvents';

const TrackableButton = ({ onPress, feedback = false, title, buttonStyle, titleStyle, logEventName, logEventData }) => {
  handleOnPress = () => {
    if (onPress) {
      onPress();
      if (logEventName) {
        logEvent(logEventName, logEventData);
      }
    }
  }

    return (feedback
    ? (
      <TouchableHighlight style={buttonStyle} onPress={handleOnPress}>
        <Text style={titleStyle}>{title}</Text>
      </TouchableHighlight>
    )
    : (
      <TouchableOpacity style={buttonStyle} onPress={handleOnPress}>
        <Text style={titleStyle}>{title}</Text>
      </TouchableOpacity>
    ))
}

TrackableButton.propTypes = {
  onPress: PropTypes.func,
}

export { TrackableButton };
