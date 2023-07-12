<template>
  <div id="app">
    <header>
      <MyHeader v-on:changeUser="changeUser" v-on:addUser="addUser" v-bind:todos="todos"
                v-bind:user="currentUser" v-bind:userList="userList"/>
    </header>
    <main>
      <div v-if="currentUser !== ''">
        <MyMain v-on:addList="addList" v-on:deleteList="deleteList" v-on:addItem="addItem" v-on:changeDone="changeDone"
                v-bind:todos="todos"/>
      </div>
    </main>
    <footer>
      <MyFooter/>
    </footer>
  </div>
</template>

<script>
import { serverURL } from './config.js';
import MyHeader from './components/MyHeader';
import MyMain from './components/MyMain';
import MyFooter from './components/MyFooter';

export default {
  name: 'App',
  components: {
    MyHeader,
    MyMain,
    MyFooter,
  },

  data () {
    return {
      currentUser: '',
      userList: [],
      todos: []
    };
  },

  async created () {
    await this.updateUserList();
    if (this.userList.length > 0) this.currentUser = this.userList[0].user;
    await this.updateTodos();
  },

  methods: {
    async updateTodos () {
      try {
        if (this.currentUser !== '') {
          const timeout = setTimeout(() => alert('No response from server'), 5000);
          const response = await fetch(serverURL + '/api/list/' + this.currentUser);
          clearTimeout(timeout);
          if (response.status === 200) {
            this.todos = await response.json();
          } else {
            alert(await response.text());
          }
        }
      } catch (err) {
        console.log(err);
      }
    },

    async updateUserList () {
      try {
        const timer = setTimeout(() => alert('No response from server'), 5000);
        const response = await fetch(serverURL + '/api/user');
        clearTimeout(timer);
        if (response.status === 200) {
          this.userList = await response.json();
        } else {
          alert(await response.text());
        }
      } catch (err) {
        console.log(err);
      }
    },

    changeUser (newUser) {
      this.currentUser = newUser;
      this.updateTodos();
    },

    async addUser (newUserName) {
      const newUser = {
        user: newUserName,
      };
      try {
        const timeout = setTimeout(() => alert('No response from server'), 5000);
        const response = await fetch(serverURL + '/api/user', {
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
          },
          method: 'POST',
          body: JSON.stringify(newUser)
        });
        clearTimeout(timeout);
        if (response.status !== 201) {
          alert(await response.text());
        }
        await this.updateUserList();
        await this.updateTodos();
      } catch (err) {
        console.log(err);
      }
    },

    async changeDone (listName, itemName, done) {
      const newItem = {
        name: itemName,
        done: !done
      };
      try {
        const timeout = setTimeout(() => alert('No response from server'), 5000);
        const response = await fetch(serverURL + '/api/item/' + this.currentUser + '/' + listName + '/' + itemName, {
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
          },
          method: 'PUT',
          body: JSON.stringify(newItem)
        });
        clearTimeout(timeout);
        if (response.status !== 200) {
          alert(await response.text());
        }
        await this.updateTodos();
      } catch (err) {
        console.log('Error: ' + err);
      }
    },

    async addItem (list, newItem) {
      const item = {
        name: newItem,
        done: false
      };
      try {
        const timeout = setTimeout(() => alert('No response from server'), 5000);
        const response = await fetch(serverURL + '/api/item/' + this.currentUser + '/' + list, {
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
          },
          method: 'POST',
          body: JSON.stringify(item)
        });
        clearTimeout(timeout);
        if (response.status !== 201) {
          alert(await response.text());
        }
        await this.updateTodos();
      } catch (err) {
        console.log(err);
      }
    },

    async addList (listName) {
      const newList = {
        name: listName,
      };
      try {
        const timeout = setTimeout(() => alert('No response from server'), 5000);
        const response = await fetch(serverURL + '/api/list/' + this.currentUser, {
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
          },
          method: 'POST',
          body: JSON.stringify(newList)
        });
        clearTimeout(timeout);
        if (response.status !== 201) {
          alert(await response.text());
        }
        await this.updateTodos();
      } catch (err) {
        console.log(err);
      }
    },

    async deleteList (listName) {
      try {
        const timeout = setTimeout(() => alert('No response from server'), 5000);
        const response = await fetch(serverURL + '/api/list/' + this.currentUser + '/' + listName, {
          method: 'Delete',
        });
        clearTimeout(timeout);
        if (response.status !== 200) {
          alert(await response.text());
        }
        await this.updateTodos();
      } catch (err) {
        console.log('Error: ' + err);
      }
    }
  }
};

</script>

<style scoped>
  #app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
  }
</style>
