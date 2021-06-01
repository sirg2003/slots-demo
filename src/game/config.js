const SYMBOL_SIZE = 140;
const COUNT_REELS = 3;
const COUNT_ROWS = 2; // visible rows
const reelMargin = 6;

const reelSettings = {
  rowsCount: COUNT_ROWS,
  reelsCount: COUNT_REELS,
  width: SYMBOL_SIZE + reelMargin * 2,
  height: SYMBOL_SIZE * COUNT_ROWS,
  radius: 6,
  reelBorderRadius: 3,
  lineHeight: 6,
  symbol: {
    size: SYMBOL_SIZE,
    half: SYMBOL_SIZE / 2,
  },
  position: {
    x: 40,
    y: 120,
    offset: 24,
    margin: reelMargin,
  },
  spin: {
    duration: 2000,
    speed: 30,
    // speed: 1,
    delay: 500,
  },
};

export default reelSettings;
