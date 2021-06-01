import * as PIXI from 'pixi.js';

class SpinButton extends PIXI.Container {
  constructor() {
    super();
    const buttonBackground = new PIXI.Graphics()
      .lineStyle(4, 0xffffff, 1)
      .beginFill(0x650a5a, 0.25)
      .drawRoundedRect(0, 0, 200, 50, 20)
      .endFill();

    const style = new PIXI.TextStyle({
      align: 'center',
      fontFamily: 'Arial',
      fontSize: 36,
      fontWeight: 'bold',
      letterSpacing: 5,
      fill: '#ffffff',
      stroke: '#4a1850',
      strokeThickness: 5,
    });

    const textSpin = new PIXI.Text('SPIN !', style);
    textSpin.x = textSpin.width / 4;

    this.addChild(buttonBackground, textSpin);
  }
}

export default SpinButton;
