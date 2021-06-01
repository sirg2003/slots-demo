import * as PIXI from 'pixi.js';
import reelSettings from '../config';

class PayTableSymbolsLine extends PIXI.Container {
  constructor(texture) {
    super();
    const SYMBOL_SIZE = reelSettings.symbol.half;

    for (let index = 0; index < 3; index++) {
      const symbol = new PIXI.Sprite.from(texture);
      symbol.x = SYMBOL_SIZE * index;
      this.addChild(symbol);
    }
  }
}

export default PayTableSymbolsLine;
