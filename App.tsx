import React, { useState, useEffect, useRef } from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  FlatList,
  TouchableOpacity,
  Animated,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function App() {
  const [task, setTask] = useState('');
  const [tasks, setTasks] = useState([]);
  const animations = useRef({}); // Using useRef for task animations
  const buttonAnimations = useRef({}); // Using useRef for button animations

  // Function to load tasks from AsyncStorage
  const loadTasks = async () => {
    try {
      const storedTasks = await AsyncStorage.getItem('tasks');
      if (storedTasks) {
        setTasks(JSON.parse(storedTasks)); // Parse and set the tasks if available
      }
    } catch (error) {
      console.error('Failed to load tasks from AsyncStorage:', error);
    }
  };

  // Function to save tasks to AsyncStorage
  const saveTasks = async (newTasks) => {
    try {
      await AsyncStorage.setItem('tasks', JSON.stringify(newTasks));
    } catch (error) {
      console.error('Failed to save tasks to AsyncStorage:', error);
    }
  };

  // Load tasks from AsyncStorage when the component mounts
  useEffect(() => {
    loadTasks();
  }, []);

  // Function to add a new task
  const addTask = () => {
    if (task.trim()) {
      const newTask = {
        id: Date.now().toString(),
        text: task,
        completed: false,
        scaleAnim: new Animated.Value(0),
      };

      // Initialize animation reference for this task
      animations.current[newTask.id] = newTask.scaleAnim;

      Animated.timing(newTask.scaleAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }).start();

      const updatedTasks = [...tasks, newTask];
      setTasks(updatedTasks);
      saveTasks(updatedTasks); // Save tasks to AsyncStorage
      setTask('');
    }
  };

  // Function to delete a task
  const deleteTask = (taskId) => {
    Animated.timing(animations.current[taskId], {
      toValue: 0,
      duration: 500,
      useNativeDriver: true,
    }).start(() => {
      const updatedTasks = tasks.filter((task) => task.id !== taskId);
      setTasks(updatedTasks);
      saveTasks(updatedTasks); // Save updated tasks to AsyncStorage
    });
  };

  // Function to toggle task completion
  const toggleTaskCompletion = (taskId) => {
    const updatedTasks = tasks.map((item) =>
      item.id === taskId ? { ...item, completed: !item.completed } : item
    );
    setTasks(updatedTasks);
    saveTasks(updatedTasks); // Save updated tasks to AsyncStorage
  };

  // Function to start editing a task
  const startEditing = (taskId, currentText) => {
    setTask(currentText);
  };

  // Function to animate edit/delete button
  const animateButton = (taskId, buttonType) => {
    const buttonAnim = new Animated.Value(1);
    buttonAnimations.current[taskId] = buttonAnim;

    Animated.sequence([
      Animated.timing(buttonAnim, {
        toValue: 1.2,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(buttonAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Simple To-Do List</Text>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Add a task"
          value={task}
          onChangeText={(text) => setTask(text)}
        />
        <TouchableOpacity style={styles.addButton} onPress={addTask}>
          <Text style={styles.addButtonText}>+</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={tasks}
        renderItem={({ item }) => (
          <Animated.View
            style={[styles.taskContainer, { transform: [{ scale: animations.current[item.id] || 1 }] }]}
          >
            <Text
              style={[
                styles.taskText,
                item.completed && styles.completedTaskText,
              ]}
              onPress={() => toggleTaskCompletion(item.id)}
            >
              {item.text}
            </Text>

            <Animated.View
              style={{
                transform: [{ scale: buttonAnimations.current[item.id] || 1 }],
                marginLeft: 10,
              }}
            >
              <TouchableOpacity
                onPress={() => {
                  animateButton(item.id, 'delete');
                  deleteTask(item.id);
                }}
                style={styles.buttonContainer}
              >
                <Text style={styles.deleteButton}>Delete</Text>
              </TouchableOpacity>
            </Animated.View>

            <Animated.View
              style={{
                transform: [{ scale: buttonAnimations.current[item.id] || 1 }],
                marginLeft: 10,
              }}
            >
              <TouchableOpacity
                onPress={() => {
                  animateButton(item.id, 'edit');
                  startEditing(item.id, item.text);
                }}
                style={styles.buttonContainer}
              >
                <Text style={styles.editButton}>Edit</Text>
              </TouchableOpacity>
            </Animated.View>
          </Animated.View>
        )}
        keyExtractor={(item) => item.id.toString()} // Ensuring ID is converted to string
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 50,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  input: {
    flex: 1,
    height: 40,
    borderColor: '#ddd',
    borderWidth: 1,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  addButton: {
    backgroundColor: '#5C5CFF',
    height: 40,
    width: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
    marginLeft: 10,
  },
  addButtonText: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
  taskContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    borderBottomColor: '#ddd',
    borderBottomWidth: 1,
  },
  taskText: {
    fontSize: 16,
    color: '#333',
  },
  completedTaskText: {
    textDecorationLine: 'line-through',
    color: '#999',
    fontStyle: 'italic',
  },
  buttonContainer: {
    backgroundColor: '#f0f0f0',
    paddingVertical: 5,
    paddingHorizontal: 15,
    borderRadius: 5,
  },
  deleteButton: {
    color: '#FF5C5C',
    fontWeight: 'bold',
    fontSize: 16,
  },
  editButton: {
    color: '#FFA500',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
