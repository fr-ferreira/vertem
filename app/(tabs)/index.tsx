import React, { createContext, useContext, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import {
  FlatList,
  View,
  Text,
  TextInput,
  Button,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';

// Context API for managing tasks
const TaskContext = createContext();

const TaskProvider = ({ children }) => {
  const [tasks, setTasks] = useState([]);

  const addTask = (title) => {
    setTasks([...tasks, { id: Date.now(), title, completed: false }]);
  };

  const toggleTaskStatus = (id) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const clearCompletedTasks = () => {
    setTasks((prevTasks) => prevTasks.filter((task) => !task.completed));
  };

  return (
    <TaskContext.Provider
      value={{ tasks, addTask, toggleTaskStatus, clearCompletedTasks }}
    >
      {children}
    </TaskContext.Provider>
  );
};

const useTasks = () => useContext(TaskContext);

// Screens
const HomeScreen = ({ navigation }) => {
  const { tasks, toggleTaskStatus, clearCompletedTasks } = useTasks();

  return (
    <View style={styles.container}>
      <FlatList
        data={tasks}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.taskItem}
            onPress={() => toggleTaskStatus(item.id)}
          >
            <Text
              style={[
                styles.taskText,
                item.completed && { textDecorationLine: 'line-through' },
              ]}
            >
              {item.title}
            </Text>
          </TouchableOpacity>
        )}
      />
      <View style={styles.buttonContainer}>
        <Button title="Add Task" onPress={() => navigation.navigate('AddTask')} />
        <Button title="Clear Completed" onPress={clearCompletedTasks} />
      </View>
    </View>
  );
};

const AddTaskScreen = ({ navigation }) => {
  const [taskTitle, setTaskTitle] = useState('');
  const { addTask } = useTasks();

  const handleAddTask = () => {
    if (taskTitle.trim()) {
      addTask(taskTitle);
      setTaskTitle('');
      navigation.goBack();
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Enter task title"
        value={taskTitle}
        onChangeText={setTaskTitle}
      />
      <Button title="Add Task" onPress={handleAddTask} />
    </View>
  );
};

// React Navigation Setup
const Stack = createStackNavigator();

export default function App() {
  return (
    <TaskProvider>

        <Stack.Navigator>
          <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'Tasks' }} />
          <Stack.Screen name="AddTask" component={AddTaskScreen} options={{ title: 'Add Task' }} />
        </Stack.Navigator>

    </TaskProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  taskItem: {
    padding: 16,
    marginVertical: 8,
    borderWidth: 1,
    borderRadius: 8,
    borderColor: '#ccc',
  },
  taskText: {
    fontSize: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 12,
    marginBottom: 16,
    borderRadius: 8,
  },
  buttonContainer: {
    marginTop: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
