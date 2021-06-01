import * as PIXI from 'pixi.js';
import reelSettings from '../config';

class WinLineContainer extends PIXI.Container {
  constructor(id, position, index) {
    super();
    const rowLine = new PIXI.Graphics();

    const SYMBOL_SIZE = reelSettings.symbol.size;
    const SYMBOL_CENTER = reelSettings.symbol.half;
    const WIN_LINE_HEIGHT = reelSettings.lineHeight;
    const REELS_CONTAINER_X = reelSettings.position.x;
    const REELS_CONTAINER_Y = reelSettings.position.y;
    const linePositionX = REELS_CONTAINER_X + SYMBOL_CENTER;
    const linePositionY = REELS_CONTAINER_Y + SYMBOL_CENTER;

    let offsetX = 0;
    let offsetY = 0;
    let offsetHeight = SYMBOL_CENTER * index;
    let lineColor = 0xff0000;
    let lineWidth = SYMBOL_SIZE;

    if (position === 'left') {
      // left combo line
      offsetY = offsetHeight + 10;
    } else if (position === 'right') {
      // right combo line
      offsetX = SYMBOL_CENTER * 3; // margin left: 3 symbols size
      offsetY = offsetHeight - 10;
    } else if (position === 'center') {
      // full-size win line
      lineColor = 0x0602ff;
      lineWidth = SYMBOL_SIZE * 2.5;
      offsetY = offsetHeight;
    }

    rowLine
      .lineStyle(WIN_LINE_HEIGHT, lineColor, 1)
      .moveTo(0, 0)
      .lineTo(lineWidth, 0);

    this.name = id;
    this.x = linePositionX + offsetX;
    this.y = linePositionY + offsetY;
    this.alpha = 0;
    this.animationSpeed = 400 + 200 * index;
    this.addChild(rowLine);
  }
  startAnimate() {
    const onAnimate = () => {
      this.alpha = this.alpha === 0 ? 1 : 0;
    };
    this.timer = setInterval(onAnimate, this.animationSpeed);
  }
  stopAnimate() {
    clearInterval(this.timer);
    this.alpha = 0;
  }
}

export default WinLineContainer;
