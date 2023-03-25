/* eslint-disable prettier/prettier */
import React from 'react';
import {
  TouchableOpacity,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { ToDoItem } from '../models';


// компонент, отображающий элемент списка дел
// принимает в качестве параметров элемент ToDoItem и функцию удаления элемента
export const ToDoItemComponent: React.FC<{
  todo: ToDoItem;
  deleteItem: Function;
    }> = ({ todo: {id, value}, deleteItem }) => {
  return (
    <View style={styles.todoContainer}>
        <View style={styles.todoTextContainer}>
          <Text
            style={styles.sectionTitle}>
            id:{id}, {value}
          </Text>
        </View>
        <View style={styles.todoButtonContainer}>
          <TouchableOpacity
          style = {styles.deleteButtonStyle}
            onPress={() => deleteItem(id)}
          >
            <Text style={styles.deleteButtoncaption}>×</Text>
          </TouchableOpacity>
        </View>
    </View>
  );
};
const styles = StyleSheet.create({
  todoContainer: {
    marginTop: 10,
    paddingHorizontal: 15,
    paddingVertical: 5,
    backgroundColor: 'lightskyblue',
    marginLeft: 10,
    marginRight: 10,
    borderRadius: 10,
    borderColor: 'black',
    borderWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  todoTextContainer: {
    flex: 10,
    justifyContent: 'center',
  },
  todoButtonContainer: {
    flex:1,
    justifyContent:'center',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '400',
  },
  deleteButtonStyle: {
    borderRadius: 15,
    borderColor: 'gray',
    borderWidth: 1,
    backgroundColor: '#FFA07A',
    justifyContent:'center',
    alignItems: 'center',
    width: '100%',
  },
  deleteButtoncaption:{
    fontSize: 16,
  },
});