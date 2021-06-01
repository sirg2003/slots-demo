import * as PIXI from 'pixi.js';

import { lerp, backout, getIsCenterSymbol, getTimestamp } from '../helpers';
import reelSettings from '../config';

const SPIN_MODE = {
  random: 1,
  fixed: 2,
};
const SYMBOLS_FRAME = {
  BAR: 0,
  '2xBAR': 1,
  '3xBAR': 2,
  '7': 3,
  CHERRY: 4,
};
const emptySymbolId = -1;
const rowIndexSymbolCenter = 1;
const rowIndexSymbolTop = 1;
const rowIndexSymbolBottom = 2;
const totalSymbolsCount = Object.keys(SYMBOLS_FRAME).length;
const getRandomSymbol = () => Math.floor(Math.random() * totalSymbolsCount);

class ReelContainer extends PIXI.Container {
  constructor(params) {
    const { reelId, delay, x, y, onSpinComplete, slotTextures } = params;
    super();
    this.reelId = reelId;
    this.spinDelay = delay;
    this.onSpinComplete = onSpinComplete;
    this.x = x;
    this.y = y;
    this.slotTextures = slotTextures;
    this.reel = [];
    this.result = {};
    this.isSpinning = false;
    this.isCenterSymbol = false;
    this.isFixedMode = false;
    this.currentSpinMode = SPIN_MODE.RANDOM;
    this.fixedModeParams = {
      symbol: 'BAR',
      position: 'top',
    };
    this.tween = null;
    this.createBottomBorder();
    this.addSlots();
    this.createTopBorder();
  }
  getReelResult() {
    const { result } = this;
    return result;
  }
  updateReelResult() {
    const { isCenterSymbol, reel } = this;
    const COUNT_ROWS = reelSettings.rowsCount + 1;
    const reelSymbols = reel.symbols;
    const lineResult = new Array(COUNT_ROWS).fill(emptySymbolId);
    if (isCenterSymbol) {
      lineResult[1] = reelSymbols[rowIndexSymbolCenter].frameIndex;
    } else {
      lineResult[0] = reelSymbols[rowIndexSymbolTop].frameIndex;
      lineResult[2] = reelSymbols[rowIndexSymbolBottom].frameIndex;
    }
    this.result = lineResult;
  }
  updateSymbols() {
    const { slotTextures, reel, isFixedMode } = this;
    const reelSymbolsCount = reelSettings.reelsCount;
    const SYMBOL_SIZE = reelSettings.width;
    // Update blur filter y amount based on speed.
    // This would be better if calculated with time in mind also. Now blur depends on frame rate.
    reel.blur.blurY = (reel.position - reel.previousPosition) * 16;
    reel.previousPosition = reel.position;
    const symbolsLength = reelSymbolsCount;

    // Update symbol positions on reel.
    reel.symbols.forEach((symbol, symbolIndex) => {
      const prevy = symbol.y;
      const posModifier = reel.position + symbolIndex;
      const posModifierLength = posModifier % symbolsLength;
      const newY = posModifierLength * SYMBOL_SIZE - SYMBOL_SIZE;
      symbol.y = newY;
      // Detect going over and swap a texture.
      if (newY < 0 && prevy > SYMBOL_SIZE) {
        const currentRow = parseInt(reel.position);
        const overrideSymbol = isFixedMode && currentRow === reel.targetRow;
        const frameIndex = overrideSymbol ? SYMBOLS_FRAME[reel.targetSymbol] : getRandomSymbol();
        symbol.frameIndex = frameIndex;
        symbol.texture = slotTextures[frameIndex];
      }
    });
  }
  updateTween() {
    const { tween } = this;
    if (tween) {
      const now = getTimestamp();
      const { timeStart } = tween;
      const isTweening = now > timeStart;
      if (!isTweening) {
        return;
      }
      const { duration, target, easing } = tween;
      const tweenProgress = Math.min(1, (now - timeStart) / duration);
      if (tweenProgress === 1) {
        this.reel.position = this.tween.target;
        this.updateReelResult();
        this.tween = null;
        this.isSpinning = false;
        this.onSpinComplete();
      } else {
        this.reel.position = lerp(0, target, easing(tweenProgress));
      }
    }
  }
  spinReel(spinParams) {
    const { spinDelay, reelId } = this;
    const { spinMode, fixedParams } = spinParams;

    const isFixedMode = spinMode === 'fixed';
    const fixedModeParams = fixedParams[reelId];
    const overridePosition = fixedModeParams.position;
    const isCenterSymbol = isFixedMode ? overridePosition === 'center' : getIsCenterSymbol();

    const rowShift = isCenterSymbol ? 0.5 : 0;

    this.currentSpinMode = spinMode;
    this.fixedModeParams = fixedModeParams;
    this.isCenterSymbol = isCenterSymbol;
    this.isFixedMode = isFixedMode;

    const targetRowIndex = reelSettings.spin.speed;

    if (isFixedMode) {
      if (overridePosition === 'top') {
        this.reel.targetRow = targetRowIndex - 1;
      }
      if (overridePosition === 'center') {
        this.reel.targetRow = targetRowIndex - 1;
      }
      if (overridePosition === 'bottom') {
        this.reel.targetRow = targetRowIndex - 2;
      }
      this.reel.targetSymbol = fixedModeParams.symbol;
    }

    const targetRow = reelSettings.spin.speed + rowShift;
    const duration = reelSettings.spin.duration + spinDelay;
    // const timeStart = getTimestamp() + spinDelay; // if we need to delay start
    const timeStart = getTimestamp();
    const tweenParams = {
      target: targetRow,
      easing: backout(0.5),
      duration,
      timeStart,
    };
    this.tween = tweenParams;
    this.reel.previousPosition = 0;
    this.reel.position = 0;
    this.isSpinning = true;
  }
  addSlots() {
    // Create different slot symbols.
    const { slotTextures } = this;

    // Build the reels
    const symbolsContainer = new PIXI.Container();
    const symbolsCount = slotTextures.length;
    const reelMargin = reelSettings.position.margin;

    const reel = {
      symbols: [],
      position: 0,
      previousPosition: 0,
      blur: new PIXI.filters.BlurFilter(),
    };
    reel.blur.blurX = 0;
    reel.blur.blurY = 0;
    symbolsContainer.name = 'reel';
    symbolsContainer.filters = [reel.blur];

    const symbolSize = reelSettings.symbol.size;
    const rowsCount = reelSettings.rowsCount + 1; // add one row above reel

    // Build the symbols
    for (let j = 0; j < rowsCount; j++) {
      const frameIndex = Math.floor(Math.random() * symbolsCount);
      const symbol = new PIXI.Sprite(slotTextures[frameIndex]);
      // Scale the symbol to fit symbol area.
      symbol.name = 'symbol-' + j;
      symbol.rowId = 'ROW-' + j;
      symbol.countChanges = 0;
      symbol.frameIndex = frameIndex;
      symbol.x = reelMargin;
      symbol.y = -symbolSize + j * symbolSize;
      reel.symbols.push(symbol);
      symbolsContainer.addChild(symbol);
    }
    // cache reel
    this.reel = reel;
    this.symbolsContainer = symbolsContainer;
    this.symbolsContainer.mask = this.reelBackground;
    this.addChild(symbolsContainer);
  }
  createBottomBorder() {
    const graphics = new PIXI.Graphics();
    // draw a rounded rectangle
    graphics.lineStyle(reelSettings.reelBorderRadius, 0xffffff, 1);
    graphics.beginFill(0x000000);
    graphics.drawRoundedRect(0, 0, reelSettings.width, reelSettings.height, reelSettings.radius);
    graphics.endFill();
    graphics.name = 'reelBorder';

    // create a new Sprite using the texture
    const reelBackgroundX = reelSettings.position.margin;
    const reelBackground = new PIXI.Sprite.from('reelBg');
    const reelMask = new PIXI.Sprite.from('reelBg');
    reelBackground.x = reelBackgroundX;
    reelMask.x = reelBackgroundX;
    this.reelBackground = reelBackground;
    this.reelMask = reelMask;

    this.addChild(graphics, reelBackground, reelMask);
  }
  createTopBorder() {
    const graphics = new PIXI.Graphics();
    const textureForeground = PIXI.Texture.from('reelFg');
    // draw a rounded rectangle
    graphics.lineStyle(reelSettings.reelBorderRadius, 0xffffff, 1);
    graphics.drawRoundedRect(0, 0, reelSettings.width, reelSettings.height, reelSettings.radius);
    graphics.endFill();
    graphics.name = 'reelBorder';

    // create a new Sprite using the texture
    const reelForeground = new PIXI.Sprite(textureForeground);
    reelForeground.alpha = 0.5;
    reelForeground.x = reelSettings.position.margin;

    this.addChild(reelForeground, graphics);
  }
  update() {
    const { isSpinning } = this;
    if (isSpinning) {
      this.updateTween();
      this.updateSymbols();
    }
  }
  onSpinReelComplete() {
    this.isSpinning = false;
    this.onSpinComplete();
  }
}

export default ReelContainer;
