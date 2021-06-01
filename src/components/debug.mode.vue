<template>
  <b-card header="Select mode" class="text-center">
    <b-card-text>
      <b-form-group label="Select mode:" v-slot="{ ariaDescribedby }">
        <b-form-radio-group
          id="btn-radios-2"
          v-model="selectedMode"
          :options="optionsMode"
          :aria-describedby="ariaDescribedby"
          button-variant="outline-primary"
          name="radio-btn-outline"
          buttons
          @change="emitChange"
        ></b-form-radio-group>
      </b-form-group>
    </b-card-text>
  </b-card>
</template>

<script>
export default {
  name: 'DebugMode',
  data() {
    return {
      selectedMode: 'random',
      optionsMode: [
        { item: 'random', name: 'Random', text: 'Random', value: 'random' },
        { item: 'fixed', name: 'Fixed', text: 'Fixed', value: 'fixed' },
      ],
    };
  },
  methods: {
    emitChange() {
      const { selectedMode } = this;
      this.$emit('setSpinMode', selectedMode);
    },
  },
};
</script>
