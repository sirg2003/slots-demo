<template>
  <b-container class="h-100">
    <b-row>
      <b-card header="Game" class="text-center">
        <div ref="canvas" class="canvas-wrapper"></div>
      </b-card>
    </b-row>
    <b-row>
      <b-card header="Debugger" class="text-center">
        <b-card-text>
          <b-row>
            <b-col>
              <debug-mode @setSpinMode="setSpinMode" />
            </b-col>
            <b-col>
              <debug-balance :points="points" @onChangeBalance="onChangeBalance" />
            </b-col>
            <b-col>
              <debug-reel :reelId="1" @changeReel="changeReel" />
            </b-col>
            <b-col>
              <debug-reel :reelId="2" @changeReel="changeReel" />
            </b-col>
            <b-col>
              <debug-reel :reelId="3" @changeReel="changeReel" />
            </b-col>
          </b-row>
        </b-card-text>
      </b-card>
    </b-row>
  </b-container>
</template>

<script>
import DebugMode from './components/debug.mode.vue';
import DebugReel from './components/debug.reel.vue';
import DebugBalance from './components/debug.balance.vue';
import GameApp from './game';

export default {
  name: 'app',
  components: { DebugMode, DebugReel, DebugBalance },
  data() {
    return {
      game: null,
      points: 5000,
    };
  },
  created() {
    this.$bus.on('balance:set', this.onSetBalance);
  },
  mounted() {
    this.game = new GameApp(this.$refs.canvas);
    this.setGameDefaults();
  },
  beforeDestroy() {
    this.game.app.destroy(true);
    this.game = null;
    this.$bus.off('balance:set', this.onSetBalance);
  },
  methods: {
    setGameDefaults() {
      this.setSpinMode('random');
      this.changeReel(1, 'BAR', 'top');
      this.changeReel(2, 'BAR', 'top');
      this.changeReel(3, 'BAR', 'top');
      this.onSetBalance(5000);
    },
    // balance
    onSetBalance(points) {
      this.points = points;
      this.onChangeBalance(points);
    },
    onChangeBalance(points) {
      // send new balance to game
      this.game.setBalance(points);
    },
    // balance
    setSpinMode(selectedMode) {
      this.game.setSpinMode(selectedMode);
    },
    changeReel(reelId, selectedSymbol, selectedPosition) {
      this.game.setReelParams(reelId, selectedSymbol, selectedPosition);
    },
  },
};
</script>

<style>
html,
body {
  padding: 0;
  margin: 0;
  height: 100%;
}

.wrapper {
  border: 1px solid #000;
}
.game {
  border: 1px solid #000;
}
.debugger {
  border: 1px solid #000;
}
.canvas-wrapper {
  position: relative;
  margin: 0 auto;
  max-width: 800px;
  width: 100%;
}
canvas {
  display: block;
  width: 100%;
  height: 100%;
}
</style>
