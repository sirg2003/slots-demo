import * as PIXI from 'pixi.js';
import PayTableSymbolsLine from './PayTableSymbolsLine';

import reelSettings from '../config';

class PayTableBlock extends PIXI.Container {
  constructor(params) {
    super();
    const BACKGROUND_WIDTH = 200;
    const BACKGROUND_HEIGHT = 60;
    const BACKGROUND_BORDER_RADIUS = 20;
    const SYMBOL_SIZE = reelSettings.symbol.half;
    const textStyle = {
      fontFamily: 'Arial',
      fontSize: 16,
      fontWeight: 'bold',
      fill: '#ffffff',
    };

    const backgroundInactive = new PIXI.Graphics()
      .lineStyle(4, 0xffffff, 1)
      .beginFill(0x650a5a, 0.25)
      .drawRoundedRect(0, 0, BACKGROUND_WIDTH, BACKGROUND_HEIGHT, BACKGROUND_BORDER_RADIUS)
      .endFill();

    const backgroundActive = new PIXI.Graphics()
      .lineStyle(4, 0xff0000, 1)
      .drawRoundedRect(0, 0, BACKGROUND_WIDTH, BACKGROUND_HEIGHT, BACKGROUND_BORDER_RADIUS);

    backgroundActive.alpha = 0;

    this.addChild(backgroundInactive);

    if (params.type === 'line') {
      const symbols = new PayTableSymbolsLine(PIXI.Texture.from(params.symbol));
      symbols.scale.set(0.3);
      symbols.x = 10;
      symbols.y = 10;
      this.addChild(symbols);
    } else if (params.type === 'combo') {
      const symbolsContainer = new PIXI.Container();
      params.symbols.forEach((symbol, index) => {
        const texture = PIXI.Texture.from(symbol);
        const symbolSprite = new PIXI.Sprite.from(texture);
        symbolSprite.x = 10 + SYMBOL_SIZE * index;
        symbolSprite.y = 10 - 40 * index;
        symbolsContainer.addChild(symbolSprite);
      });
      symbolsContainer.scale.set(0.3);
      symbolsContainer.x = 10;
      symbolsContainer.y = 20;
      this.addChild(symbolsContainer);
    }

    const textLine = new PIXI.Text(params.textLine, textStyle).setTransform(100, 10);
    const textPoints = new PIXI.Text('Win: ' + params.points, textStyle).setTransform(100, 30);

    this.addChild(backgroundActive, textLine, textPoints);
    this.backgroundActive = backgroundActive;
    this.animationSpeed = 300;
  }
  startAnimate() {
    const onAnimate = () => {
      this.backgroundActive.alpha = this.backgroundActive.alpha === 0 ? 1 : 0;
    };
    this.timer = setInterval(onAnimate, this.animationSpeed);
  }
  stopAnimate() {
    clearInterval(this.timer);
    this.backgroundActive.alpha = 0;
  }
}

export default PayTableBlock;
