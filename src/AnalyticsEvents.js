import analytics from '@react-native-firebase/analytics';
import PropTypes from 'prop-types';

export const logEvent = async ( eventName, data = {} ) => {
  try {
    await analytics().logEvent(eventName, data);
    console.log("Event logged");
  } catch (error) {
    console.log('Event log failed: ', error);
  }
}

logEvent.propTypes = {
  eventName: PropTypes.string,
  data: PropTypes.object,
};
