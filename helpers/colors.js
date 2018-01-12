import Color from 'color';
import params from './params';

const colors = {
  PRIMARY_COLOR: '#' + params.BAND_COLOR,
  SECONDARY_COLOR: '#ff9600',
  PRIMARY_BG_COLOR: '#222',
  SECONDARY_BG_COLOR: '#333',
  BG_WASH: 'rgba(255,255,255,0.8)',
  DISABLED_WASH: 'rgba(255,255,255,0.25)',
  MODAL_BACKGROUND: 'rgba(0, 0, 0, 0.75)',
  APP_TEXT_COLOR: '#fff',
  MAP_MARKER_COLOR: '0x' + params.BAND_COLOR,
  SPINNER_COLOR: '#fff',
  STATUS_BAR_COLOR: Color('#' + params.BAND_COLOR).darken(0.2),
};

// DEAD #FF0000
// DMB #C7A720
// PEARLJAM #000000
// PHISH #228AE6
// RADIOHEAD #65A665
// SCI #9370db
// UMPHREYS #95a5a6
// WSP #ff4500
module.exports = colors;
