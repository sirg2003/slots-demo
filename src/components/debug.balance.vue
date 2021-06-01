<template>
  <b-card header="Balance" class="text-center">
    <b-card-text>
      <b-form-group>
        <b-form-input v-model="balance" type="number" :formatter="validateBalance"></b-form-input>
        <b-button block variant="primary" @click="emitChange">Set</b-button>
      </b-form-group>
    </b-card-text>
  </b-card>
</template>

<script>
export default {
  name: 'DebugBalance',
  props: ['points'],
  data() {
    return {
      balance: 5000,
    };
  },
  watch: {
    points: function(val) {
      this.balance = val;
    },
  },
  methods: {
    validateBalance(value) {
      const balance = parseInt(value);
      return balance >= 0 && balance <= 5000 ? balance : 0;
    },
    emitChange() {
      const { balance } = this;
      this.$emit('onChangeBalance', balance);
    },
  },
};
</script>
