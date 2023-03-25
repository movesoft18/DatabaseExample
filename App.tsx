/* eslint-disable prettier/prettier */

import React, {useCallback, useEffect, useState} from 'react';
import {
  Button,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import {ToDoItemComponent } from './src/components/ToDoItem';
import {ToDoItem} from './src/models';
import {
  getDBConnection,
  getTodoItems,
  saveTodoItems,
  createTable,
  clearTable,
  deleteTodoItem,
} from './src/db-service';

const App = () => {
  const [todos, setTodos] = useState<ToDoItem[]>([]);
  const [newTodo, setNewTodo] = useState('');

  const loadDataCallback = useCallback(async () => { // функция загрузки списка дел, обернутая в UseCallback, чтобы запускалась только при запуске приложения
    try {
      const initTodos = [  // список дел по умолчанию (удалить в реальном приложении)
        {id: 0, value: 'Установить Android Studio, SDK, JDK'},
        {id: 1, value: 'Установить Node.js'},
        {id: 2, value: 'Установить эмулятор Android'},
      ];
      const db = await getDBConnection(); // получаем объект БД
      await createTable(db); // создаем таблицу со списком дел (если ее нет)
      const storedTodoItems = await getTodoItems(db); // читаем сохраненные дела
      if (storedTodoItems.length) { // если список не пуст - заполняем массив списка дел
        setTodos(storedTodoItems); // обновляем состояние
      } else {
        await saveTodoItems(db, initTodos);  // если список пуст, записываем в БД список дел по умолчанию (удалить в реальном приложении)
        setTodos(initTodos); // обновляем состояние
      }
    } catch (error) {
      console.error(error);
    }
  }, []);

  useEffect(() => { // эффект загрузки данных при запуске приложения
    loadDataCallback();
  }, [loadDataCallback]);

  const addTodo = async () => { // функция добавления нового дела
    if (!newTodo.trim()) return;  // если пустая строка - игнорируем
    try {
      const newTodos = [ // добавляем новое дело в конец массива
        ...todos,
        {
        // eslint-disable-next-line prettier/prettier
        id: todos.length ? todos.reduce((acc, cur) => { // вычисляем уникальный индекс дела, так, чтобы он был больше любого существующего индекса
          if (cur.id > acc.id) return cur;
          return acc;
        }).id + 1 : 0, value: newTodo,
      }];
      setTodos(newTodos);  // обновляем состояние
      const db = await getDBConnection(); // получаем объект БД
      await saveTodoItems(db, newTodos); // сохраняем новое дело в БД
      setNewTodo(''); // очищем текст нового дела
    } catch (error) {
      console.error(error);
    }
  };

  // удаление дела по его id
  const deleteItem = async (id: number) => {
    try {
      const db = await getDBConnection(); // получаем объект БД
      const deleteIndex = todos.findIndex((item: ToDoItem) => item.id === id); // ищем индекс удаляемого дела в массиве дел по id
      await deleteTodoItem(db, id); // удаляем из БД
      todos.splice(deleteIndex, 1); // удаляем из массива дел
      setTodos(todos.slice(0)); // обновляем состояние
    } catch (error) {
      console.error(error);
    }
  };
  // внешной вид компонента
  return (
    <SafeAreaView>
      <ScrollView
        contentInsetAdjustmentBehavior="automatic">
        <View style={[styles.appTitleView]}>
          <Text style={styles.appTitleText}>Мой список дел на сегодня</Text>
        </View>
        <View>
          {todos.map((todo) => (
            <ToDoItemComponent key={todo.id} todo={todo} deleteItem={deleteItem} />
          ))}
        </View>
        <View style={styles.textInputContainer}>
          <TextInput
            style={styles.textInput}
            value={newTodo}
            onChangeText={text => setNewTodo(text)} />
          <Button
            onPress={addTodo}
            title="Добавить"
            color="#841584"
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  appTitleView: {
    marginTop: 20,
    justifyContent: 'center',
    flexDirection: 'row',
  },
  appTitleText: {
    fontSize: 24,
    fontWeight: '800',
  },
  textInputContainer: {
    marginTop: 30,
    marginLeft: 20,
    marginRight: 20,
    borderRadius: 10,
    borderColor: 'black',
    borderWidth: 1,
    justifyContent: 'flex-end',
  },
  textInput: {
    borderWidth: 1,
    borderRadius: 5,
    height: 40,
    margin: 10,
    backgroundColor: 'pink',
  },
});
export default App;
