/* eslint-disable prettier/prettier */
import { enablePromise, openDatabase, SQLiteDatabase } from 'react-native-sqlite-storage';
import { ToDoItem } from './models';

const tableName = 'todoData'; // имя таблицы со списком дел в БД

enablePromise(true); // разрешаем работать с БД асинхронно

// функция подключения к БД todo-data.db
export const getDBConnection = async () => {
  return openDatabase({ name: 'todo-data.db', location: 'default' });
};

// функция создания таблицы в БД, если ее не существует
// параметры - объект БД
export const createTable = async (db: SQLiteDatabase) => {
  // создаем таблицу в БД, если ее не существует
  const query = `CREATE TABLE IF NOT EXISTS ${tableName}(
        value TEXT NOT NULL
    );`;

  await db.executeSql(query); // запуск запроса
};


// получение списка дел
// входные параметры - объект БД
// выходные - промис, возвращающий список дел
export const getTodoItems = async (db: SQLiteDatabase): Promise<ToDoItem[]> => {
  try {
    const todoItems: ToDoItem[] = []; // массив списка дел, пока пустой
    const results = await db.executeSql(`SELECT rowid as id,value FROM ${tableName}`); // готовим запрос, получаем обьекты-записи из БД
    results.forEach(result => { // обрабатываем записи и преобразовываем их в массив списка дел
      for (let index = 0; index < result.rows.length; index++) {
        todoItems.push(result.rows.item(index)); //result.rows.item(index) - функция, возвращающая запись из результата запроса по индексу
      }
    });
    return todoItems; // возвращаем список дел
  } catch (error) {
    console.error(error);
    throw Error('Ошибка при получении списка дел!!!');
  }
};

// добавление или обновление списка дел
// входные параметры - объект БД, массив списка дел
export const saveTodoItems = async (db: SQLiteDatabase, todoItems: ToDoItem[]) => {
  const insertQuery =
    `INSERT OR REPLACE INTO ${tableName}(rowid, value) values` + // готовим запрос
    todoItems.map(i => `(${i.id}, '${i.value}')`).join(',');

  return db.executeSql(insertQuery); // запускаем запрос
};

// удаление элемента из БД по его ключу
export const deleteTodoItem = async (db: SQLiteDatabase, id: number) => {
  const deleteQuery = `DELETE from ${tableName} where rowid = ${id}`;
  await db.executeSql(deleteQuery);
};

// удаление таблицы (не используется в данном примере)
export const deleteTable = async (db: SQLiteDatabase) => {
  const query = `drop table ${tableName}`;

  await db.executeSql(query);
};
