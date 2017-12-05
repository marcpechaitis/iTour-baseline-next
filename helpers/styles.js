import React, {
  StyleSheet,
  Dimensions,
  PixelRatio,
  Platform
} from 'react-native';
import colors from './colors';
const { width, height, scale } = Dimensions.get('window'),
  vw = width / 100,
  vh = height / 100,
  vmin = Math.min(vw, vh),
  vmax = Math.max(vw, vh);
const iPhoneNavBarHeight = isIphoneX() ? 88 : 64;
const iPhonePaddingTop = isIphoneX() ? 24 : 0;
function isIphoneX() {
  if (Platform.OS === 'ios' && height === 812) {
    console.log('iPhone X');
    return true;
  } else {
    console.log('NOT iPhone X');
    return false;
  }
}

console.log(iPhoneNavBarHeight);

function randomColor() {
  return '#' + Math.floor(Math.random() * 16777215).toString(16);
}

// TODO - organize the styles better

const styles = StyleSheet.create({
  appContainer: {
    height: 100 * vh,
    backgroundColor: colors.PRIMARY_COLOR
  },
  headerContainer: {
    // height: Platform.OS === 'ios' ? iPhoneNavBarHeight : 54
    //    paddingLeft: (Platform.OS === 'ios') ? 0 : 4*vw,
    //    alignSelf: (Platform.OS === 'ios' ) ? 'center' : 'flex-start'
  },
  /* Navigation Bar */
  navBar: {
    backgroundColor: colors.PRIMARY_COLOR,
    height: Platform.OS === 'ios' ? iPhoneNavBarHeight : 54,
    paddingTop: Platform.OS === 'ios' ? iPhonePaddingTop : 54
    //  alignSelf: (Platform.OS === 'ios' ) ? 'center' : 'flex-start'
    //  paddingLeft: (Platform.OS === 'ios') ? 0 : 4*vw
  },
  navBarTitleStyle: {
    //    width: 100*vw,
    //    fontSize: 5
  },
  navBarTextStyle: {
    color: colors.APP_TEXT_COLOR,
    textAlign: Platform.OS === 'ios' ? 'center' : 'left',
    width: 100 * vw,
    fontSize: 6 * vw,
    paddingLeft: Platform.OS === 'ios' ? 0 : 30,
    paddingTop: Platform.OS === 'ios' ? -3 : -4
    //    textAlign: (Platform.OS === 'ios') ? 'center' : 'left',
  },
  appTextColor: {
    color: colors.APP_TEXT_COLOR
  },
  barButtonTextStyle: {
    color: colors.APP_TEXT_COLOR
  },
  barButtonIconStyle: {
    tintColor: colors.APP_TEXT_COLOR
  },
  /* Loading Page */
  loadingContainer: {
    flex: 1,
    width: 100 * vw,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.SECONDARY_BG_COLOR
  },
  loading: {
    marginTop: 1 * vw,
    color: colors.APP_TEXT_COLOR
  },
  /* Event List */
  listContentContainer: {
    //        paddingTop: 50,
    //        paddingTop: 1*vw,
    //        paddingTop: (Platform.OS === 'ios' ? 64 : 50),
    //        backgroundColor: '#006bb1'
    backgroundColor: colors.SECONDARY_BG_COLOR
    //        backgroundColor: colors.SECONDARY_COLOR
    //        backgroundColor: randomColor()
    //        shadowColor: colors.PRIMARY_BG_COLOR
  },
  listView: {
    // flex: 1,
    backgroundColor: colors.SECONDARY_BG_COLOR,
    //   marginTop: Platform.OS === 'ios' ? iPhoneNavBarHeight : 54,
    paddingTop: Platform.OS === 'ios' ? 0.5 * vh : 1 * vh
  },
  rowContainer: {
    flexDirection: 'column',
    flexWrap: 'wrap',
    // flex: 1,
    width: 96 * vw,
    marginTop: 1 * vw,
    marginLeft: 2 * vw,
    marginRight: 2 * vw,
    marginBottom: 1 * vw,
    padding: 2 * vw,
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.PRIMARY_BG_COLOR
    /*    shadowColor: 'rgba(255,255,255,0.2)',
    shadowOpacity: .6,
    shadowOffset: {height: 2, width: 2},
    shadowRadius: 2,
  */
    //backgroundColor: 'rgba(255, 255, 255, 0.7)'
    //        backgroundColor: 'rgba(0, 107, 177, 0.3)'
    //        backgroundColor: 'rgba(204, 63, 0, 0.3)'

    //        backgroundColor: rgba(255,0,0,0.1)
    //        shadowColor: colors.PRIMARY_BG_COLOR,
    //        shadowOpacity: 0.8,
    //        shadowRadius: 5,
    //        shadowOffset: {
    //            height: 0,
    //            width: 2
    //        }
  },
  theRow1: {
    //        backgroundColor: 'black',
    //        width: Dimensions.get('window').width
    width: 92 * vw
    //    flex:1
  },
  theRow2: {
    flexDirection: 'row',
    //        backgroundColor: 'yellow',
    alignItems: 'center',
    //        width: Dimensions.get('window').width
    width: 92 * vw
    // flex: 1
  },
  venueContainer: {
    flexWrap: 'wrap',
    width: 92 * vw
  },
  venue: {
    fontSize: 5.5 * vw,
    //    marginBottom: 1*vh,
    //    fontWeight: 'bold',
    textAlign: 'left',
    color: colors.PRIMARY_COLOR === '#000000' ? '#FFFFFF' : colors.PRIMARY_COLOR
  },
  dateContainer: {
    flexDirection: 'row',
    width: 27 * vw,
    justifyContent: 'flex-start'
    // flex: 1
  },
  date: {
    fontSize: 12 * vw,
    marginTop: Platform.OS === 'ios' ? 0 * vh : -1.5 * vh,
    textAlign: 'left',
    color: colors.APP_TEXT_COLOR
  },
  detailsContainer: {
    // flex: 1,
    flexWrap: 'wrap',
    alignItems: 'flex-end',
    width: 62 * vw
  },
  locationContainer: {
    paddingLeft: 2 * vw,
    paddingRight: 2 * vw,
    width: 62 * vw
    // flex: 1
  },
  location: {
    fontSize: 5 * vw,
    textAlign: 'right',
    color: colors.PRIMARY_COLOR
  },
  street: {
    marginTop: Platform.OS === 'ios' ? 1 * vh : 0 * vh,
    fontSize: 4 * vw,
    textAlign: 'right',
    color: colors.APP_TEXT_COLOR
  },
  cityState: {
    fontSize: 4 * vw,
    textAlign: 'right',
    color: colors.APP_TEXT_COLOR
  },
  separator: {
    backgroundColor: colors.SECONDARY_BG_COLOR
  },
  /* Event Detail */
  contentContainer: {
    //    paddingTop: 1*vw + 64,
    // marginTop: Platform.OS === 'ios' ? iPhoneNavBarHeight : 54,
    paddingTop: Platform.OS === 'ios' ? 0.5 * vh : 1 * vh,
    position: 'relative',
    backgroundColor: colors.SECONDARY_BG_COLOR
  },
  container: {
    marginTop: 1.5 * vw,
    backgroundColor: colors.SECONDARY_BG_COLOR,
    height: 100 * vh
  },
  infoContainer: {
    width: 96 * vw,
    marginTop: 1 * vw,
    marginLeft: 2 * vw,
    marginRight: 2 * vw,
    marginBottom: 1 * vw,
    justifyContent: 'space-around',
    alignItems: 'center'
    /*    shadowColor: 'rgba(255,255,255,0.2)',
    shadowOpacity: .6,
    shadowOffset: {height: 2, width: 2},
    shadowRadius: 2,
*/
  },
  eventInfoContainer: {
    // flex: 1,
    height: 32 * vh,
    backgroundColor: colors.PRIMARY_BG_COLOR,
    paddingTop: 1 * vw,
    paddingBottom: 1 * vw
  },
  extraInfoContainer: {
    // flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    height: 10 * vh,
    paddingLeft: 1 * vw,
    paddingRight: 1 * vw,
    //    paddingBottom: 1*vw,
    marginBottom: Platform.OS === 'ios' ? 4 * vw : 2 * vw,
    backgroundColor: colors.PRIMARY_BG_COLOR
  },
  mapInfoContainer: {
    // flex: 1,
    height: 46 * vh,
    width: 100 * vw,
    marginTop: Platform.OS === 'ios' ? 4 * vw : 0 * vw,
    marginLeft: 0,
    marginRight: 0,
    marginBottom: 0,
    alignItems: 'flex-start'
  },
  placePictureInfoContainer: {
    position: 'relative',
    // flex: 1,
    height: 20 * vw,
    width: 30 * vw,
    left: 4 * vw,
    bottom: isIphoneX() ? 22.5 * vw : 16 * vw
  },
  placePictureModal: {
    backgroundColor: colors.MODAL_BACKGROUND,
    alignItems: 'center',
    height: 100 * vh,
    width: 100 * vw,
    paddingTop: 20 * vh
  },
  /* WebBrowser */
  webViewContentController: {
    // marginTop: Platform.OS === 'ios' ? iPhoneNavBarHeight : 54
    // flex: 1
  },
  webViewFooterContainer: {
    position: 'absolute',
    flex: 0.5,
    left: 0,
    right: 0,
    bottom: 0,
    paddingBottom: isIphoneX() ? 2 * vh : 0,
    backgroundColor: colors.PRIMARY_COLOR,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center'
  },
  navButton: {
    color: colors.APP_TEXT_COLOR,
    fontSize: 8 * vw
  },
  disabledButton: {
    color: colors.DISABLED_WASH,
    fontSize: 8 * vw
  },
  fullScreenWidth: {
    width: 100 * vw
  },
  placePhotoHeight: {
    height: 46 * vh
  },
  //  text: {
  //    color: colors.APP_TEXT_COLOR
  //  },
  altName: {
    fontSize: 12 * vw,
    textAlign: 'center'
  },
  notes: {
    fontSize: 4 * vw
    //  paddingTop: 1*vh,
    //  backgroundColor: 'red'
  },
  eventTimes: {
    fontSize: 4 * vw
    //  paddingTop: 1*vh,
    //  backgroundColor: 'blue'
  },
  locationContainerDetail: {
    marginTop: 1 * vh,
    alignItems: 'flex-end',
    width: 96 * vw,
    paddingLeft: 2 * vw,
    paddingRight: 2 * vw
  },
  venueDetail: {
    fontSize: 5 * vw,
    //    fontWeight: 'bold',
    textAlign: 'right',
    color: colors.PRIMARY_COLOR === '#000000' ? '#FFFFFF' : colors.PRIMARY_COLOR
  },
  address: {
    fontSize: 4 * vw,
    //  marginTop: .5*vw,
    textAlign: 'right'
  },
  phoneContainer: {
    paddingLeft: 10,
    paddingRight: 10,
    width: 96 * vw,
    alignItems: 'flex-end'
  },
  phone: {
    fontSize: 3 * vw,
    marginTop: 0.5 * vw,
    textAlign: 'right'
  },
  /*  mapContainer: {
    width: 96*vw,
    height: 90*vw,
  marginTop: 1.5*vw,
  marginLeft: 2*vw,
  marginRight: 2*vw,
  marginBottom: 1.5*vw,
  padding: 2*vw,
  paddingBottom: 4*vw,
  justifyContent: 'space-between',
  alignItems: 'center',
  backgroundColor: '#999999',
  shadowColor: colors.PRIMARY_BG_COLOR,
  shadowOpacity: 0.8,
  shadowRadius: 2,
  shadowOffset: {
    height: 0,
    width: 2
  }
}, */
  icon: {
    width: 290,
    height: 163
  },
  map: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0
  },
  actionButtonIcon: {
    fontSize: 30,
    height: 30,
    color: colors.PRIMARY_COLOR
  },
  actionButtonImage: {
    width: 5 * vh,
    height: 5 * vh
  },
  barButtonTextStyle: {
    color: colors.APP_TEXT_COLOR
  },
  actionButtonBackground: {
    width: width,
    height: height,
    backgroundColor: colors.MODAL_BACKGROUND
  },

  /* WeatherWidget */
  widgetContainer: {
    maxWidth: 30 * vw,
    // flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    padding: 1 * vw
  },
  weatherIcon: {
    fontSize: 7.5 * vw,
    paddingRight: 2 * vw,
    paddingTop: 3
  },
  weatherDetails: {
    fontSize: 7.5 * vw,
    paddingRight: 0.5 * vw,
    marginRight: 0.5 * vw
    //    paddingRight: 1 * vw
  },
  directionColumnContainer: {
    flexDirection: 'column'
  },
  directionRowContainer: {
    flexDirection: 'row'
  },
  fontSize1: {
    fontSize: 1 * vw
  },
  fontSize2: {
    fontSize: 2 * vw
  },
  fontSize3: {
    fontSize: 3 * vw
  },
  fontSize4: {
    fontSize: 4 * vw
  },
  fontSize4: {
    fontSize: 4 * vw
  },
  centerText: {
    textAlign: 'center'
  },
  alignItemsCenter: {
    alignItems: 'center'
  },
  justifySpaceAround: {
    justifyContent: 'space-around'
  },
  flexOne: {
    // flex: 1
  }
});

module.exports = styles;
