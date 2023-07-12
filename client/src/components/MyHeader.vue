<template>
  <div class="header">
    <div class="title">ToDo List</div>
    <ul class="flex-container">
      <li class="flex-item left">
        <i class="material-icons">account_circle</i>
      </li>
      <li class="flex-item middle">
        <div class="select-wrapper">
          <select @change="changeUser" v-model="selectedUser" class="select">
            <option value="" selected disabled hidden>{{user}}</option>
            <option class="option" v-bind:key="entry.id" v-bind:value="entry.user" v-for="entry in userList">{{entry.user}}</option>
          </select>
        </div>
      </li>
      <li class="flex-item right">
        <button @click="showModal = true" class="button">
          <i class="material-icons addIcon">add_circle</i>
        </button>
      </li>
    </ul>

    <div class="modal-overlay" v-if="showModal"></div>
    <div class="modal" v-if="showModal">
      <NewUserModal v-bind:todos="todos" v-bind:userList="userList" v-on="$listeners" v-on:closeModal="showModal= false"/>
    </div>
  </div>
</template>

<script>
import NewUserModal from './NewUserModal';

export default {
  name: 'MyHeader',
  components: { NewUserModal },
  props: [
    'todos',
    'user',
    'userList'
  ],
  data () {
    return {
      selectedUser: this.user,
      showModal: false
    };
  },
  methods: {
    changeUser () {
      this.$emit('changeUser', this.selectedUser);
    }
  }
};
</script>

<style scoped>
  .header {
    background: #323232;
    color: white;
    text-align: center;
    margin-top: 0px;
    display: flex;
    z-index: 1;
    position: sticky;
    top: 0px;
  }

  .flex-container {
    display: flex;
    flex-flow: row nowrap;
    justify-content: space-evenly;
    align-items: center;
    padding: 0px;
    margin: 0px;
    margin-left: auto;
    margin-right: 10px;
    list-style: none;
    float: right;
  }

  .flex-item {
    flex-grow: 1;
    flex-basis: auto;
    background: #0070BA;
    color: white;
    font-weight: bold;
    height: 50px;
  }

  .left {
    border-radius: 100% 0 0 100%
  }

  .middle {
    border-radius: 0 5px 5px 0;
  }

  .right {
    border-radius: 5px;
    margin-left: 5px;
  }

  .button {
    appearance: none;
    outline: none;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    padding: 0px;
    border-width: 0px;
    color: #2fffce;
    background: #0070BA;
    height: 50px;
  }

  .material-icons {
    font-size: 50px;
  }

  .addIcon:hover {
    filter: brightness(80%);
  }

  .title {
    text-align: left;
    padding: 10px;
    font-size: xx-large;
    margin-left: 10px;
  }

  .select-wrapper {
    margin: auto 5%;
    -moz-appearance: none;
    -webkit-appearance: none;
    appearance: none;
    border: none;
  }

  .select {
    outline: none;
    background-color: rgba(0, 0, 0, 0);
    height: 50px;
    border: 0px;
    font-size: large;
    color: black;
    margin-left: -10px;
    margin-right: 5px;
    min-width: 100px;
  }

  .select option {
    color: black;
  }

  .select:hover {
    cursor: pointer;
  }

  .modal-overlay {
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    height: 100vh;
    width: 100vw;
    background-color: rgba(0, 0, 0, 0.3);
  }
</style>
