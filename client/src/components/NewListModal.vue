<template>
  <div class="modal">
    <h2 class="h2">Add new list</h2>
    <span class="alert">{{alertMsg}}</span>
      <input @keypress.enter="safe" @input="alertMsg = ''" class="input" maxlength="35" placeholder="list name" v-model="listName">
    <button class="button abort" @click="abort">
      <span>Abort</span>
    </button>
    <button class="button safe" @click="safe">
      <span>Safe</span>
    </button>
  </div>
</template>

<script>
export default {
  name: 'NewListModal',
  props: [
    'todos',
    'userID'
  ],
  data () {
    return {
      listName: '',
      alertMsg: '',
      allListNames: []
    };
  },
  created () {
    for (const list of this.todos) {
      this.allListNames.push(list.name);
    }
  },
  methods: {
    safe () {
      if (this.listName === '') this.alertMsg = 'Enter a name for your list';
      else if (this.allListNames.includes(this.listName)) this.alertMsg = 'A list with this name already exists';
      else {
        this.$emit('addList', this.listName);
        this.$emit('closeModal');
      }
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
    margin: 10px 0px;
  }
  .button {
    appearance: none;
    outline: none;
    border: none;
    background: none;
    cursor: pointer;
    display: inline-block;
    padding: 15px 25px;
    margin: 10px 10%;
    border-radius: 8px;
    color: #FFF;
    font-size: medium;
    font-weight: bolder;
    box-shadow: 2px 2px rgba(0, 0, 0, 0.2);
    transition: 0.2s ease-out;
  }

  .input{
    display: block;
    margin: auto;
    font-size: medium;
  }

  .safe {
    background-color: #369336;
  }

  .abort {
    background-color: orangered;
  }

  .button:hover {
    box-shadow: 3px 3px rgba(0, 0, 0, 0.3);
  }

  .alert {
    color: orangered;
  }
</style>
