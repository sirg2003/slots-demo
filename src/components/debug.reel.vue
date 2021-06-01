<template>
  <b-card :header="`Reel ${reelId}`" class="text-center">
    <b-card-text>
      <b-form-group label="Symbol:">
        <b-form-select
          v-model="selectedSymbol"
          :options="optionsSymbol"
          @change="emitChange"
        ></b-form-select>
      </b-form-group>
      <b-form-group label="Position:">
        <b-form-select
          v-model="selectedPosition"
          :options="optionsPosition"
          @change="emitChange"
        ></b-form-select>
      </b-form-group>
    </b-card-text>
  </b-card>
</template>

<script>
export default {
  name: 'DebugReel',
  props: ['reelId'],
  data() {
    return {
      selectedSymbol: 'BAR',
      selectedPosition: 'top',
      optionsSymbol: [
        { text: 'BAR', value: 'BAR' },
        { text: '2xBAR', value: '2xBAR' },
        { text: '3xBAR', value: '3xBAR' },
        { text: '7', value: '7' },
        { text: 'CHERRY', value: 'CHERRY' },
      ],
      optionsPosition: [
        { text: 'Top', value: 'top' },
        { text: 'Center', value: 'center' },
        { text: 'Bottom', value: 'bottom' },
      ],
    };
  },
  methods: {
    emitChange() {
      const { reelId, selectedSymbol, selectedPosition } = this;
      this.$emit('changeReel', reelId, selectedSymbol, selectedPosition);
    },
  },
};
</script>
