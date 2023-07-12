<template>
  <div class="modal">
    <h2 class="h2">Add new user</h2>
    <span class="alert">{{alertMsg}}</span>
      <input @keypress.enter="safe" @input="alertMsg = ''" class="input" maxlength="9" placeholder="user name" v-model="userName">
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
  name: 'NewUserModal',
  props: [
    'todos',
    'userList'
  ],
  data () {
    return {
      userName: '',
      alertMsg: '',
      userNames: []
    };
  },
  created () {
    for (const entry of this.userList) {
      this.userNames.push(entry.user);
    }
  },
  methods: {
    safe () {
      if (this.userName === '') this.alertMsg = 'Enter a user name';
      else if (this.userNames.includes(this.userName)) this.alertMsg = 'A user with this name already exists';
      else {
        this.$emit('addUser', this.userName);
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
    color: black;
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
