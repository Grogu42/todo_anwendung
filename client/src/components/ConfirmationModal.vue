<template>
  <div class="modal">
    <h2 class="h2">{{msg}}</h2>
    <button class="button abort" @click="abort">
      <span>Abort</span>
    </button>
    <button class="button confirm" @click="confirm">
      <span>Confirm</span>
    </button>
  </div>
</template>

<script>
export default {
  name: 'ConfirmationModal',
  props: ['msg'],
  methods: {
    confirm () {
      this.$emit('deleteList');
      this.$emit('closeModal');
    },
    abort () {
      this.$emit('closeModal');
    }
  }
};
</script>

<style scoped>
  .modal {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 100%;
    max-width: 400px;
    background-color: white;
    border-radius: 16px;
    padding: 10px;
  }

  .h2 {
    color: black;
    margin: 10px 0px;
    width: 100%;
  }
  .button {
    appearance: none;
    outline: none;
    border: none;
    background: none;
    cursor: pointer;
    display: inline-block;
    padding: 15px 25px;
    margin: 10px 5%;
    border-radius: 8px;
    color: #FFF;
    font-size: medium;
    font-weight: bolder;
    box-shadow: 2px 2px rgba(0, 0, 0, 0.2);
    transition: 0.2s ease-out;
  }

  .button:hover {
    box-shadow: 3px 3px rgba(0, 0, 0, 0.3);
  }

  .confirm {
    background-color: #369336;
  }

  .abort {
    background-color: orangered;
  }
</style>
