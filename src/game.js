import * as PIXI from 'pixi.js';
import Vue from 'vue';
import imageReel_Bar from './assets/reel/BAR.png';
import imageReel_2xBar from './assets/reel/2xBAR.png';
import imageReel_3xBar from './assets/reel/3xBAR.png';
import imageReel_7 from './assets/reel/7.png';
import imageReel_Cherry from './assets/reel/Cherry.png';
import imageReelBackground from './assets/reel/reel-background.png';
import imageReelForeground from './assets/reel/reel-foreground.png';

import reelSettings from './game/config';
import ReelContainer from './game/elements/ReelContainer';
import WinLineContainer from './game/elements/WinLineContainer';
import SpinButton from './game/elements/SpinButton';
import PayTableBlock from './game/elements/PayTableBlock';
import { winLinesParams, calculateWin } from './game/win';

const SPIN_MODE = {
  RANDOM: 1,
  FIXED: 2,
};
const COUNT_REELS = reelSettings.reelsCount;
const SYMBOL_SIZE = reelSettings.symbol.size;
const SYMBOL_CENTER = reelSettings.symbol.half;
const REELS_CONTAINER_X = reelSettings.position.x;
const REELS_CONTAINER_Y = reelSettings.position.y;

const objectsList = {
  spinButton: { x: 180, y: 500 },
  textBalance: { x: 160, y: 430, style: { fill: '#ffffff' } },
  textWinAmount: { x: 210, y: 50, text: 'Win: 0 points', style: { fill: '#ffffff' } },
  payTableBlocks: [
    { id: 'cherry-0', type: 'line', symbol: 'Cherry', textLine: 'Top line', points: 2000 },
    { id: 'cherry-1', type: 'line', symbol: 'Cherry', textLine: 'Center line', points: 1000 },
    { id: 'cherry-2', type: 'line', symbol: 'Cherry', textLine: 'Bottom line', points: 4000 },
    { id: 'line-7', type: 'line', symbol: '7', textLine: 'Any line', points: 150 },
    { id: 'combo-7', type: 'combo', symbols: ['Cherry', '7'], textLine: 'Any line', points: 75 },
    { id: 'line-bar-3', type: 'line', symbol: '3xBAR', textLine: 'Any line', points: 50 },
    { id: 'line-bar-2', type: 'line', symbol: '2xBAR', textLine: 'Any line', points: 20 },
    { id: 'line-bar-1', type: 'line', symbol: 'BAR', textLine: 'Any line', points: 10 },
    {
      id: 'combo-bar',
      type: 'combo',
      symbols: ['BAR', '2xBAR', '3xBAR'],
      textLine: 'Any line',
      points: 5,
    },
  ],
};
const appSettings = {
  antialias: true,
  backgroundColor: 0x1099bb,
  autoResize: true,
  width: 800,
  height: 600,
};

class GameApp {
  constructor(parent) {
    this.app = new PIXI.Application(appSettings);
    this.fixedModeParams = {};
    this.spinMode = SPIN_MODE.FIXED;
    this.reels = [];
    this.winLines = {};
    this.animatedWinLines = [];
    this.payTableBlocks = {};
    this.animatedPayTableBlocks = [];
    this.spinnedReels = 0;
    this.points = 0;
    //
    this.init(parent);
    this.addEvents();
    this.addObjects();
    this.addReelLines();
  }
  init(parent) {
    parent.appendChild(this.app.view);
  }
  addObjects() {
    this.createBalanceText();
    this.createWinAmountText();
    // SPIN BUTTON
    const spinButtonClass = new SpinButton();
    spinButtonClass.pivot.set(0.5);
    spinButtonClass.x = objectsList.spinButton.x;
    spinButtonClass.y = objectsList.spinButton.y;
    spinButtonClass.interactive = true;
    spinButtonClass.buttonMode = true;
    spinButtonClass.addListener('pointerdown', () => this.startSpin());
    this.app.stage.addChild(spinButtonClass);
  }
  onAssetsLoaded() {
    console.log('[game][onAssetsLoaded] this:>> ', this);
    // Create different slot symbols.
    const slotTextures = [
      PIXI.Texture.from('BAR'),
      PIXI.Texture.from('2xBAR'),
      PIXI.Texture.from('3xBAR'),
      PIXI.Texture.from('7'),
      PIXI.Texture.from('Cherry'),
    ];

    this.slotTextures = slotTextures;
    window.isAssetsLoaded = true;
    this.addReelsContainer();
    this.addWinLines();
    this.addPaytable();
  }
  addPaytable() {
    objectsList.payTableBlocks.forEach((tableData, index) => {
      const block = new PayTableBlock(tableData);
      block.x = 560;
      block.y = 10 + 60 * index + 5 * index;
      this.payTableBlocks[tableData.id] = block;
      this.app.stage.addChild(block);
    });
  }
  addWinLines() {
    const addWinLine = ({ id, position, index }) => {
      const lineContainer = new WinLineContainer(id, position, index);
      this.winLines[id] = lineContainer;
      this.app.stage.addChild(lineContainer);
    };
    winLinesParams.forEach(addWinLine);
  }
  addReelLines() {
    const lines = ['top', 'center', 'bottom'];
    const lineX = REELS_CONTAINER_X + SYMBOL_CENTER;
    const lineY = REELS_CONTAINER_Y + SYMBOL_CENTER;
    const lineWidth = SYMBOL_SIZE * 2.5;
    const lineHeight = 6;
    lines.forEach((line, lineIndex) => {
      const lineContainer = new PIXI.Container();
      const rowLine = new PIXI.Graphics();

      rowLine.lineStyle(lineHeight, 0xffffff, 1);
      rowLine.moveTo(0, 0);
      rowLine.lineTo(lineWidth, 0);
      rowLine.name = 'rowLine';
      // rowLine.beginFill(0, 1);
      // rowLine.drawRect(0, 0, lineWidth, lineHeight);
      //
      lineContainer.x = lineX;
      lineContainer.y = lineY + SYMBOL_CENTER * lineIndex;
      lineContainer.name = 'lineContainer';
      lineContainer.addChild(rowLine);
      //
      this.app.stage.addChild(lineContainer);
    });
  }
  // balance
  setBalance(points) {
    const text = `Balance: ${points} points`;
    this.points = points;
    this.textBalance.text = text;
    // console.log('[game][setBalance] points:>> ', points);
  }
  updateBalance(points) {
    const text = `Balance: ${points} points`;
    this.points = points;
    this.textBalance.text = text;
    // console.log('[game][setBalance] points:>> ', points);
    Vue.bus.emit('balance:set', points);
  }
  createBalanceText() {
    const { points } = this;
    const text = `Balance: ${points} points`;

    const textBalance = new PIXI.Text(text, objectsList.textBalance.style);
    textBalance.x = objectsList.textBalance.x;
    textBalance.y = objectsList.textBalance.y;
    textBalance.s;
    this.textBalance = textBalance;
    this.app.stage.addChild(textBalance);
  }
  createWinAmountText() {
    const textWinAmount = new PIXI.Text(
      objectsList.textWinAmount.text,
      objectsList.textWinAmount.style,
    );
    textWinAmount.x = objectsList.textWinAmount.x;
    textWinAmount.y = objectsList.textWinAmount.y;
    this.textWinAmount = textWinAmount;
    this.app.stage.addChild(textWinAmount);
  }
  updateWinAmountText(winAmount) {
    this.textWinAmount.text = `Win: ${winAmount} points`;
  }
  // balance
  startSpin() {
    const { isSpinning, points } = this;
    if (isSpinning || !points) {
      return;
    }
    const { spinMode, fixedModeParams } = this;
    const spinParams = {
      spinMode: spinMode,
      fixedParams: fixedModeParams,
    };
    this.isSpinning = true;
    this.spinnedReels = 0;
    // this.points--;
    this.updateBalance(points - 1);
    this.updateWinAmountText(0);
    this.stopAnimationWinLines();
    this.stopAnimationPaytable();
    this.reels.forEach((reel) => reel.spinReel(spinParams));
  }
  // animation: win lines
  startAnimationWinLines(winLines) {
    this.animatedWinLines = winLines;
    winLines.forEach((winLine) => {
      this.winLines[winLine].startAnimate();
    });
  }
  stopAnimationWinLines() {
    const { animatedWinLines } = this;
    if (animatedWinLines.length) {
      animatedWinLines.forEach((winLine) => {
        this.winLines[winLine].stopAnimate();
      });
    }
    this.animatedWinLines = [];
  }
  // animation: win lines
  // animation: pay table
  startAnimationPaytable(payTableLines) {
    this.animatedPayTableBlocks = payTableLines;
    payTableLines.forEach((winLine) => {
      console.log('[game][startAnimationPaytable] winLine:>> ', winLine);
      this.payTableBlocks[winLine].startAnimate();
    });
  }
  stopAnimationPaytable() {
    const { animatedPayTableBlocks } = this;
    if (animatedPayTableBlocks.length) {
      animatedPayTableBlocks.forEach((winLine) => {
        this.payTableBlocks[winLine].stopAnimate();
      });
    }
    this.animatedPayTableBlocks = [];
  }
  // animation: pay table
  calculateSpinResult(reelSymbolsArray) {
    //
    // console.log('[game][calculateSpinResult] reelSymbolsArray:>> ', reelSymbolsArray);
    const rows = {};
    reelSymbolsArray.forEach((reelRow, reelIndex) => {
      // console.log('[reelSymbolsArray] reelRow:>> ', reelRow);
      // console.log('[reelSymbolsArray] reelIndex:>> ', reelIndex);
      reelRow.forEach((symbol, rowIndex) => {
        if (!rows[rowIndex]) {
          rows[rowIndex] = [];
        }
        rows[rowIndex].push(symbol);
      });
    });
    // console.log('[game][calculateSpinResult] rows:>> ', rows);
    // const { hasWin, winAmount, winLines } = calculateWin(rows);
    const winResult = calculateWin(rows);
    const { hasWin, winAmount, winLines, payTableLines } = winResult;
    // console.log('[game][calculateSpinResult] winResult:>> ', winResult);
    if (hasWin) {
      const { points } = this;
      this.updateBalance(points + winAmount);
      this.updateWinAmountText(winAmount);
      this.startAnimationWinLines(winLines);
      this.startAnimationPaytable(payTableLines);
    }

    this.isSpinning = false;
  }
  onReelSpinComplete() {
    const countSpinnedReels = this.spinnedReels++;
    // if all reels spinned - do calculations
    if (countSpinnedReels === COUNT_REELS - 1) {
      const reelSymbolsArray = [];
      this.reels.forEach((reel) => {
        const reelResult = reel.getReelResult();
        // console.log('[game][onReelSpinComplete] reelResult:>> ', reelResult);
        reelSymbolsArray.push(reelResult);
      });
      this.calculateSpinResult(reelSymbolsArray);
    }
  }
  addReelsContainer() {
    const { slotTextures } = this;
    const offsetBetweenReels = reelSettings.position.offset;
    const spinDelay = reelSettings.spin.delay;
    const onSpinComplete = () => this.onReelSpinComplete();
    //
    for (let reelIndex = 0; reelIndex < COUNT_REELS; reelIndex++) {
      const offsetBetween = reelIndex * offsetBetweenReels;
      const offsetReel = SYMBOL_SIZE * reelIndex;
      const positionX = REELS_CONTAINER_X + offsetReel + offsetBetween;
      const reelParams = {
        reelId: reelIndex + 1,
        delay: spinDelay * reelIndex,
        x: positionX,
        y: REELS_CONTAINER_Y,
        onSpinComplete: onSpinComplete,
        slotTextures: slotTextures,
      };
      const reelClass = new ReelContainer(reelParams);
      this.reels.push(reelClass);
      this.app.stage.addChild(reelClass);
    }
    this.app.ticker.add(() => {
      this.reels.forEach((reel) => reel.update());
    });
  }
  addEvents() {
    // console.log('[game][addEvents] loader:>> ', this.app.loader);
    // console.log('[game][addEvents] resources :>> ', this.app.loader.resources);
    // console.warn('[game][addEvents] isAssetsLoaded :>> ', this.isAssetsLoaded);

    // dev mode: hot reload fix
    if (!window.isAssetsLoaded) {
      const onGraphicsLoaded = () => this.onAssetsLoaded();
      this.app.loader
        // .add('examples/assets/eggHead.png', 'examples/assets/eggHead.png')
        .add('BAR', imageReel_Bar)
        .add('2xBAR', imageReel_2xBar)
        .add('3xBAR', imageReel_3xBar)
        .add('7', imageReel_7)
        .add('Cherry', imageReel_Cherry)
        .add('reelBg', imageReelBackground)
        .add('reelFg', imageReelForeground)
        .load(onGraphicsLoaded);
    } else {
      this.onAssetsLoaded();
    }
    // dev mode: hot reload fix
  }
  setSpinMode(selectedMode) {
    this.spinMode = selectedMode;
  }
  setReelParams(reelId, selectedSymbol, selectedPosition) {
    if (!this.fixedModeParams[reelId]) {
      this.fixedModeParams[reelId] = {};
    }
    this.fixedModeParams[reelId].symbol = selectedSymbol;
    this.fixedModeParams[reelId].position = selectedPosition;
  }
}

window.PIXI = PIXI;

export default GameApp;
