# To-Do-List

This is a simple to-do list app built with React Native that uses animations when adding or deleting tasks. It also utilizes AsyncStorage to persist tasks between app sessions.

## Features
- Add tasks with animation.
- Delete tasks with animation.
- Edit tasks.
- Toggle task completion.
- Tasks are saved in `AsyncStorage`, so they persist even when the app is closed.

## Prerequisites

Make sure to have the following tools installed:

1. **Node.js**: You can download it from [here](https://nodejs.org/).
2. **React Native CLI**: Install React Native CLI by running the following command:
   npm install -g react-native-cli
3. **Xcode** for iOS (for emulators and device testing).
4. **AsyncStorage:** This app uses @react-native-async-storage/async-storage. It will be automatically installed when you run npm install.

## Getting Started

- Clone the repository:
- git clone https://github.com/serodula/To-Do-List.git
- Navigate to the project directory:
- cd To-Do-List
- Install the dependencies:
- npm install
- Start the app:
- npx react-native run-ios

## How It Works

- Add a Task:
- Enter text in the input field and click the "+" button to add a new task.
- Tasks are added with a scale animation to make the addition smooth and visually engaging.
- Delete a Task:
- Click the "Delete" button next to any task to remove it.
- A scale animation is applied when the task is deleted.
- Edit a Task:
- Click the "Edit" button next to any task to start editing.
- The task text will appear in the input field for editing.
- Toggle Task Completion:
- Tap the task text to mark it as completed or uncompleted.
- Completed tasks are styled with a strikethrough.

## Dependencies

- react-native: The core framework for building the mobile app.
- @react-native-async-storage/async-storage: A package to store data locally on the device.
- react: React is the JavaScript library used to build the user interface.
- react-native-animated: For task and button animations.

## Troubleshooting

- Ensure you have set up the iOS emulator properly.
- Make sure AsyncStorage is correctly configured for data persistence.
- If you encounter errors, check the logs using npx react-native log-ios.



