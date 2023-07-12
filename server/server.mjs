import express from 'express';
import cors from 'cors';
import baseFs from 'fs';

const fs = baseFs.promises;
const app = express();

app.use('/', express.static('../client/dist'));

app.use(express.static('public'));
app.use(express.json());
app.use(cors());
const PORT = 3000;

let todos = [];
const init = initialize();
console.log(init);

// start listening
app.listen(PORT, () => {
  console.log('App listening on port ' + PORT);
});

// reads json data in ./data/database.json and safes in var todos
async function initialize () {
  try {
    const todosStr = await fs.readFile('./data/database.json');
    todos = JSON.parse(await todosStr);
  } catch (err) {
    console.log(err);
  }
}

// wirtes data as json in ./data/database.json
async function saveData () {
  try {
    await fs.writeFile('./data/database.json', JSON.stringify(todos, null, 1));
  } catch (err) {
    console.log(err);
  }
}

// returns array with all users in database
function getUserNames () {
  const userNames = [];
  for (const entry of todos) {
    userNames.push(entry.user);
  }
  return userNames;
}

// returns array with all list of given user
function getListNames (user) {
  const listNames = [];
  for (const entry of todos) {
    if (entry.user === user) {
      for (const list of entry.lists) {
        listNames.push(list.name);
      }
    }
  }
  return listNames;
}

// returns array with all items of given list of given user
function getItemNames (user, listName) {
  const itemNames = [];
  for (const entry of todos) {
    if (entry.user === user) {
      for (const list of entry.lists) {
        if (list.name === listName) {
          for (const item of list.items) {
            itemNames.push(item.name);
          }
        }
      }
    }
  }
  return itemNames;
}

/* Endpunkt GET /api/list/{username}
    Liefert alle Todo-Listen des angegebenen Benutzers als Array von list-Objekten. */
app.get('/api/list/:username', (req, res) => {
  let msg;
  let userFound = false;

  // search for list
  for (const i of todos) {
    if (i.user === req.params.username) {
      userFound = true;
      res.status(200);
      msg = i.lists;
    }
  }

  // if user is not in database send 404 error
  if (userFound === false) {
    res.status(404);
    msg = { error: 'no matching user' };
  }

  // send response
  res.send(JSON.stringify(msg));
});

/* Endpunkt POST /api/list/{username}
    Legt eine neue leere Todo-Liste für den Benutzer an. Im Request wird ein list-Objekt
    erwartet, das nur die Property name enthält. */
app.post('/api/list/:username', async (req, res) => {
  let msg;
  let listName;
  let userFound = false;
  const listNames = getListNames(req.params.username);

  // check for correct JSON in body
  try {
    listName = await req.body.name;
    if (listName === undefined) throw new Error('listname is undefined');
  } catch (err) {
    console.log(err);
    res.status(400);
    msg = { error: 'missing or malformed JSON in body' };
    res.send(JSON.stringify(msg));
    return;
  }

  // check if list name is a not empty string
  if (typeof listName !== 'string' || listName === '') {
    res.status(400);
    msg = { Error: 'name has to be a not empty string' };
    res.send(JSON.stringify(msg));
    return;
  }

  // check if a list with this name already exists
  else if (listNames.includes(listName)) {
    res.status(400);
    msg = { error: 'a list with this name already exists' };
    res.send(JSON.stringify(msg));
    return;
  }

  //create new list and push in correct place
  else {
    const newList = {
      name: listName,
      items: []
    };
    for (const i of todos) {
      if (i.user === req.params.username) {
        userFound = true;
        i.lists.push(newList);
        await saveData();
        res.status(201);
        msg = { response: 'list created' };
      }
    }
  }

  // if given user is not in database send 404 error
  if (userFound === false) {
    res.status(404);
    msg = { error: 'no matching user' };
  }

  // send response
  res.send(JSON.stringify(msg));
});

/* Endpunkt PATCH /api/list/{username}/{listname}
    Benennt die Todo-Liste des Benutzers um. Im Request wird ein list-Objekt erwartet,
    das nur die Property name enthält.
    Endpunkt wird nicht benötigt da ich dazugehörige Zusatzaufgabe nicht bearbeitet habe */
app.patch('/api/list/:username/:listname', async (req, res) => {
  let msg;
  let listName;
  const listNames = getListNames(req.params.username);
  let userFound = false;
  let listFound = false;

  // check for correct JSON in body
  try {
    listName = await req.body.name;
  } catch (err) {
    console.log(err);
    res.status(400);
    msg = { error: 'missing or malformed JSON in body' };
    res.send(JSON.stringify(msg));
    return;
  }

  // check if name is a not empty string
  if (typeof listName !== 'string' || listName === '') {
    res.status(400);
    msg = { error: 'name has to be a not empty string' };
    res.send(JSON.stringify(msg));
    return;
  }

  // check if a list with this name already exists
  else if (listNames.includes(listName)) {
    res.status(400);
    msg = { error: 'a list with this name already exists' };
    res.send(JSON.stringify(msg));
    return;
  }

  // search list and change name
  for (const entry of todos) {
    if (entry.user === req.params.username) {
      userFound = true;
      for (const list of entry.lists) {
        if (list.name === req.params.listname) {
          listFound = true;
          list.name = listName;
          await saveData();
          res.status(200);
          msg = { response: 'changed name' };
        }
      }
    }
  }

  // if user is not in database send 404 error
  if (userFound === false) {
    res.status(404);
    msg = { error: 'no matching user' };
  }

  // if list is not in database send 404 error
  else if (listFound === false) {
    res.status(404);
    msg = { error: 'no matching list' };
  }

  //send response
  res.send(JSON.stringify(msg));
});

/* Endpunkt DELETE /api/list/{username}/{listname}
    Löscht die Todo-Liste des Benutzers. */
app.delete('/api/list/:username/:listname', async (req, res) => {
  let msg;
  let userFound = false;
  let listFound = false;

  // search and delete list
  for (const entry of todos) {
    if (entry.user === req.params.username) {
      userFound = true;
      for (const i in entry.lists) {
        if (entry.lists[i].name === req.params.listname) {
          listFound = true;
          entry.lists.splice(i, 1);
          await saveData();
          res.status(200);
          msg = { response: 'list deleted' };
        }
      }
    }
  }

  // if user is not in database send 404 error
  if (userFound === false) {
    res.status(404);
    msg = { error: 'no matching user' };
  }

  // if list is not in database send 404 error
  else if (listFound === false) {
    res.status(404);
    msg = { error: 'no matching list' };
  }

  // send response
  res.send(JSON.stringify(msg));
});

/* Endpunkt POST /api/item/{username}/{listname}
    Fügt der Todo-Liste des Benutzers einen Eintrag hinzu. Im Request wird ein item-Objekt
    erwartet, das mindestens die Properties name und done enthält. */
app.post('/api/item/:username/:listname', async (req, res) => {
  let msg;
  let itemName;
  let done;
  let userFound = false;
  let listFound = false;
  const itemNames = getItemNames(req.params.username, req.params.listname);

  // check for correct JSON in body
  try {
    itemName = await req.body.name;
    done = await req.body.done;
    if (itemName === undefined) throw new Error('itemname is undefined');
    if (done === undefined) throw new Error('done is undefined');
  } catch (err) {
    console.log(err);
    res.status(400);
    msg = { error: 'missing or malformed JSON in body' };
    res.send(JSON.stringify(msg));
    return;
  }

  // check if list name is a not empty string
  if (typeof itemName !== 'string' || itemName === '') {
    res.status(400);
    msg = { Error: 'name has to be a not empty string' };
    res.send(JSON.stringify(msg));
    return;
  }

  // check if done is a boolean
  else if (typeof done !== 'boolean') {
    res.status(400);
    msg = { Error: 'done has to be a boolean' };
    res.send(JSON.stringify(msg));
    return;
  }

  // check if a item with this name already exists
  else if (itemNames.includes(itemName)) {
    res.status(400);
    msg = { error: 'a item with this name already exists' };
    res.send(JSON.stringify(msg));
    return;
  }

  // create new item
  const newItem = {
    name: itemName,
    done: done
  };
  // push item in correct place
  for (const entry of todos) {
    if (entry.user === req.params.username) {
      userFound = true;
      for (const list of entry.lists) {
        if (list.name === req.params.listname) {
          listFound = true;
          list.items.push(newItem);
          await saveData();
          res.status(201);
          msg = { response: 'item created' };
        }
      }
    }
  }

  // if user is not in database send 404 error
  if (userFound === false) {
    res.status(404);
    msg = { error: 'no matching user' };
  }

  // if list is not in database send 404 error
  else if (listFound === false) {
    res.status(404);
    msg = { error: 'no matching list' };
  }

  // send response
  res.send(JSON.stringify(msg));
});

/* Endpunkt PUT /api/item/{username}/{listname}/{itemname}
    Überschreibt den Eintrag in der Todo-Liste des Benutzers. Im Request wird ein itemObjekt erwartet,
    das mindestens die Properties name und done enthält. */
app.put('/api/item/:username/:listname/:itemname', async (req, res) => {
  let msg;
  let itemName;
  let done;
  const itemNames = getItemNames(req.params.username, req.params.listname);
  let userFound = false;
  let listFound = false;
  let itemFound = false;

  // check for correct JSON in body
  try {
    itemName = await req.body.name;
    done = await req.body.done;
    if (itemName === undefined) throw new Error('itemname is undefined');
    if (done === undefined) throw new Error('done is undefined');
  } catch (err) {
    console.log(err);
    res.status(400);
    msg = { error: 'missing or malformed JSON in body' };
    res.send(JSON.stringify(msg));
    return;
  }

  // check if list name is a not empty string
  if (typeof itemName !== 'string' || itemName === '') {
    res.status(400);
    msg = { Error: 'name has to be a not empty string' };
    res.send(JSON.stringify(msg));
    return;
  }

  // check if done is a boolean
  else if (typeof done !== 'boolean') {
    res.status(400);
    msg = { Error: 'done has to be a boolean' };
    res.send(JSON.stringify(msg));
    return;
  }

  // check if item gets renamed
  else if (itemName !== req.params.itemname) {
    // check if a item with this name already exists
    if (itemNames.includes(itemName)) {
      res.status(400);
      msg = { error: 'a item with this name already exists' };
      res.send(JSON.stringify(msg));
      return;
    }
  }

  // search and update item
  for (const entry of todos) {
    if (entry.user === req.params.username) {
      userFound = true;
      for (const list of entry.lists) {
        if (list.name === req.params.listname) {
          listFound = true;
          for (const item of list.items) {
            if (item.name === req.params.itemname) {
              itemFound = true;
              item.name = itemName;
              item.done = done;
              await saveData();
              res.status(200);
              msg = { response: 'item updated' };
            }
          }
        }
      }
    }
  }

  // if user is not in database send 404 error
  if (userFound === false) {
    res.status(404);
    msg = { error: 'no matching user' };
  }

  // if list is not in database send 404 error
  else if (listFound === false) {
    res.status(404);
    msg = { error: 'no matching list' };
  }

  // if item is not in database send 404 error
  else if (itemFound === false) {
    res.status(404);
    msg = { error: 'no matching item' };
  }

  // send response
  res.send(JSON.stringify(msg));
});

/* Endpunkt DELETE /api/item/{username}/{listname}/{itemname}
    Löscht den Eintrag in der Todo-Liste des Benutzers. */
app.delete('/api/item/:username/:listname/:itemname', async (req, res) => {
  let msg;
  let userFound = false;
  let listFound = false;
  let itemFound = false;

  // search and delete item
  for (const entry of todos) {
    if (entry.user === req.params.username) {
      userFound = true;
      for (const list of entry.lists) {
        if (list.name === req.params.listname) {
          listFound = true;
          for (const i in list.items) {
            if (list.items[i].name === req.params.itemname) {
              itemFound = true;
              list.items.splice(i, 1);
              await saveData();
              res.status(200);
              msg = { response: 'item deleted' };
            }
          }
        }
      }
    }
  }

  // if user is not in database send 404 error
  if (userFound === false) {
    res.status(404);
    msg = { error: 'no matching user' };
  }

  // if list is not in database send 404 error
  else if (listFound === false) {
    res.status(404);
    msg = { error: 'no matching list' };
  }

  // if item is not in database send 404 error
  else if (itemFound === false) {
    res.status(404);
    msg = { error: 'no matching item' };
  }

  // send response
  res.send(JSON.stringify(msg));
});

/* Endpunkt GET /api/user
    Liefert eine Liste aller vorhandenen Benutzer als Array von userObjekten,
    die jeweils nur nur die Property user enthalten. */
app.get('/api/user', async (req, res) => {
  let msg;
  const userList = [];

  // iterate over data and save every user in array
  for (const entry of todos) {
    userList.push({ user: entry.user });
  }
  res.status(200);
  msg = userList;

  // send user list as response
  res.send(JSON.stringify(msg));
});

/* Endpunkt POST /api/user
    Legt einen neuen Benutzer an. Im Request wird ein user-Objekt erwartet, das nur die
    Property user enthält. */
app.post('/api/user', async (req, res) => {
  let msg;
  let userName;
  const userNames = getUserNames();

  // check for correct JSON in body
  try {
    userName = await req.body.user;
    if (userName === undefined) throw new Error('username is undefined');
  } catch (err) {
    console.log(err);
    res.status(400);
    msg = { error: 'missing or malformed JSON in body' };
    res.send(JSON.stringify(msg));
    return;
  }

  // check if user name is a not empty string
  if (typeof userName !== 'string' || userName === '') {
    res.status(400);
    msg = { Error: 'user has to be a not empty string' };
    res.send(JSON.stringify(msg));
    return;
  }

  // check if a user with this name already exists
  else if (userNames.includes(userName)) {
    res.status(400);
    msg = { error: 'a user with this name already exists' };
    res.send(JSON.stringify(msg));
    return;
  }

  // create new user object
  const newUser = {
    user: userName,
    lists: []
  };

  // push new user to data
  todos.push(newUser);
  await saveData();
  res.status(201);
  msg = { response: 'user created' };

  // send response
  res.send(JSON.stringify(msg));
});

/* Endpunkt PATCH /api/user/{username}
    Ändert den Namen des Benutzers. Im Request wird ein user-Objekt erwartet, das nur die
    Property user enthält.

    Endpunkt wird vom clienten nicht benötigt (nicht in der Aufgabenstellung gefordert) */
app.patch('/api/user/:username', async (req, res) => {
  let msg;
  let userName;
  const userNames = getUserNames();
  let userFound = false;

  // check for correct JSON in body
  try {
    userName = await req.body.user;
  } catch (err) {
    console.log(err);
    res.status(400);
    msg = { error: 'missing or malformed JSON in body' };
    res.send(JSON.stringify(msg));
    return;
  }

  // check if user name is a not empty string
  if (typeof userName !== 'string' || userName === '') {
    res.status(400);
    msg = { Error: 'user has to be a not empty string' };
    res.send(JSON.stringify(msg));
    return;
  }

  // check if a user with this name already exists
  else if (userNames.includes(userName)) {
    res.status(400);
    msg = { error: 'a user with this name already exists' };
    res.send(JSON.stringify(msg));
    return;
  }

  // search and update user
  for (const entry of todos) {
    if (entry.user === req.params.username) {
      userFound = true;
      entry.user = userName;
      await saveData();
      res.status(200);
      msg = { response: 'user updated' };
    }
  }

  // if user is not in database send 404 error
  if (userFound === false) {
    res.status(404);
    msg = { error: 'no matching user' };
  }

  // send response
  res.send(JSON.stringify(msg));
});

/* Endpunkt DELETE /api/user/{username}
    Löscht den Benutzer.

    Endpunkt wird vom clienten nicht benötigt (nicht in der Aufgabenstellung gefordert) */
app.delete('/api/user/:username', async (req, res) => {
  let msg;
  let userFound = false;

  // search and delete user
  for (const i in todos) {
    if (todos[i].user === req.params.username) {
      userFound = true;
      todos.splice(i, 1);
      await saveData();
      res.status(200);
      msg = { response: 'user deleted' };
    }
  }

  // if user is not in databse send 404 error
  if (userFound === false) {
    res.status(404);
    msg = { error: 'no matching user' };
  }

  // send response
  res.send(JSON.stringify(msg));
});

// incorrect URL
app.all('*', (req, res) => {
  const msg = { error: req.method + ' ' + req.url + ' is no valid endpoint' };
  res.status(404);
  res.send(JSON.stringify(msg));
});

