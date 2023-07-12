<template>
  <div>
    <div class="header">
      <span class="text">{{list.name}}</span>
      <button class="deleteBtn" @click="showModal = true">
        <i class="material-icons deleteIcon">delete</i>
      </button>
    </div>
    <div class="main">
      <ul class="list">
        <div v-bind:key="item.id" v-for="item in list.items">
          <li class="item">
            <input type="checkbox" class="checkbox" v-on:change="changeDone(item.name, item.done)" v-bind:checked="item.done"/>
            <span class="text" v-bind:class="{'isDone':item.done}">{{item.name}}</span>
          </li>
        </div>
      </ul>
    </div>
    <div class="footer">
      <div style="display: block">
        <span class="alert">{{alertMsg}}</span>
        <div style="display: inline-flex">
          <input @keypress.enter="addItem(list.name)" @input="alertMsg = ''" type="text" v-model="text" placeholder="Add new item" class="input">
          <button class="sendBtn" type="button" v-on:click="addItem(list.name)">
            <i class="material-icons sendIcon">send</i>
          </button>
        </div>
      </div>
    </div>

    <div class="modal-overlay" v-if="showModal"></div>
    <div class="modal" v-if="showModal">
      <ConfirmationModal v-bind:msg="'Are you sure you want to delete ' + list.name" v-on:deleteList="deleteList(list.name)" v-on:closeModal="showModal= false"/>
    </div>
  </div>
</template>

<script>
import ConfirmationModal from './ConfirmationModal';
export default {
  name: 'ToDoList',
  components: { ConfirmationModal },
  props: [
    'list'
  ],
  data () {
    return {
      text: '',
      alertMsg: '',
      allItemNames: [],
      showModal: false
    };
  },
  created () {
    for (const item of this.list.items) {
      this.allItemNames.push(item.name);
    }
  },
  methods: {
    changeDone (itemName, done) {
      this.$emit('changeDone', this.list.name, itemName, done);
    },
    addItem (list) {
      if (this.allItemNames.includes(this.text)) this.alertMsg = 'item with this name already exists';
      else if (this.text !== '') {
        this.allItemNames.push(this.text);
        this.$emit('addItem', list, this.text);
        this.text = '';
      }
    },
    deleteList (listName) {
      this.$emit('deleteList', listName);
    }
  }
};
</script>

<style scoped>
  .header {
    font-size: x-large;
    height: 50px;
    line-height: 50px;
  }

  .main {
    padding: 10px;
    padding-left: 20px;
    border-bottom: 1px solid white;
    border-top: 1px solid white;
    min-height: 30px;
  }

  .footer {
    margin: 10px;
    margin-left: 20px;
    margin-right: 20px;
    display: inline-flex;
  }

  .list {
    list-style-type: none;
    text-align: left;
    padding: 0px;
    font-size: large;
  }

  .listItem {
    max-width: 470px;
    word-break: break-all;
  }

  .item {
    display: flex;
    max-width: 470px;
    word-break: break-all;
  }

  .isDone {
    text-decoration: line-through;
  }

  .sendBtn {
    padding: 0px;
    margin: 0px 0px 0px 3px;
    height: 40px;
    width: 40px;
    border: none;
    appearance: none;
    outline: none;
    background: #0070BA;
  }

  .sendIcon {
    color: #2fffce;
    font-size: 40px;
  }

  .sendIcon:hover {
    filter: brightness(80%);
    cursor: pointer;
  }

  .deleteIcon {
    color: red;
    font-size: x-large;
    transition: 0.2s ease-out;
  }

  .deleteIcon:hover {
    font-size: xx-large;
  }

  .deleteBtn {
    display: inline-block;
    float: right;
    width: 30px;
    height: 30px;
    padding: 0px;
    appearance: none;
    outline: none;
    border: none;
    background: none;
    cursor: pointer;
  }

  .input {
    width: 100%;
    font-size: medium;
    padding-left: 10px;
    min-width: 200px;
    max-width: 400px;
  }

  .checkbox {
    min-height: 25px;
    min-width: 25px;
  }

  .text {
    margin: auto 0px;
    vertical-align: middle;
  }

  .modal-overlay {
    position: absolute;
    top: -20px;
    left: 0;
    bottom: 0;
    right: 0;
    height: 100vh;
    width: 100vw;
    background-color: rgba(0, 0, 0, 0.3);
  }

  .alert {
    display: block;
    color: orangered;
  }
</style>
