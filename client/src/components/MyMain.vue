<template>
  <div class="main">
    <ul class="flex-container">
      <div class="flex-item" v-bind:key="list.id" v-for="list in todos">
        <ToDoList v-on="$listeners" v-bind:list="list"/>
      </div>
      <div class="flex-item invisible"></div>
    </ul>
    <div class="icon">
      <i class="icon material-icons" @click="showModal = true">add_circle</i>
    </div>

    <div class="modal-overlay" v-if="showModal"></div>
    <div class="modal" v-if="showModal">
      <NewListModal v-bind:todos="todos" v-bind:userID="userID" v-on="$listeners" v-on:closeModal="showModal= false"/>
    </div>
  </div>
</template>

<script>
import ToDoList from './ToDoList';
import NewListModal from './NewListModal';

export default {
  name: 'MyMain',
  components: { NewListModal, ToDoList },
  props: [
    'todos',
    'userID'
  ],
  data () {
    return {
      showModal: false
    };
  }
};
</script>

<style scoped>
  .flex-container {
    display: flex;
    flex-flow: row wrap;
    align-items: flex-start;
    padding: 0px;
    list-style: none;
    position: relative;
    margin-bottom: 56px;
  }

  .flex-item {
    flex-grow: 1;
    flex-basis: auto;
    /*background: #659DBD;*/
    background: #0070BA;
    color: white;
    font-weight: bold;
    border-radius: 10px;
    margin: 10px;
    box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
    width: available;
    min-width: 300px;
    max-width: 500px;
    min-height: 150px;
  }

  .invisible {
    visibility: hidden;
  }

  .icon {
    position: fixed;
    z-index: 1;
    right: 10px;
    bottom: 60px;
    backround: #2fffce;
    background-color: white;
    border-radius: 100%;
    width: 50px;
    height: 50px;
  }

  .material-icons {
    color: #2fffce;
    font-size: 70px;
    background-color: rgba(0, 0, 0, 0);
    right: 20px;
    bottom: 70px;
  }

  .material-icons:hover {
    cursor: pointer;
    filter: brightness(80%);
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
