import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import HomeScreen from "./app/screens/HomeScreen";
import GroupGoalScreen from "./app/screens/GroupGoalScreen";
import AddGoalScreen from "./app/screens/AddGoalScreen";
import ExpensesScreen from "./app/screens/ExpensesScreen";
import ProfileScreen from "./app/screens/ProfileScreen";

const Tab = createBottomTabNavigator();
const HomeStack = createNativeStackNavigator();
const GroupGoalStack = createNativeStackNavigator();
const AddGoalStack = createNativeStackNavigator();
const ExpensesStack = createNativeStackNavigator();
const ProfileStack = createNativeStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;

            if (route.name === "Home") {
              iconName = focused ? "home" : "home-outline";
            } else if (route.name === "GroupGoal") {
              iconName = focused ? "people" : "people-outline";
            } else if (route.name === "AddGoal") {
              iconName = focused ? "add-circle" : "add-circle-outline";
            } else if (route.name === "Expenses") {
              iconName = focused ? "cash" : "cash-outline";
            } else if (route.name === "Profile") {
              iconName = focused ? "person" : "person-outline";
            }

            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: "black",
          tabBarInactiveTintColor: "gray",
          headerShown: false,
          tabBarShowLabel: false,
        })}
      >
        <Tab.Screen name="Home" component={HomeScreenStack} />
        <Tab.Screen name="GroupGoal" component={GroupGoalScreenStack} />
        <Tab.Screen name="AddGoal" component={AddGoalScreenStack} />
        <Tab.Screen name="Expenses" component={ExpensesScreenStack} />
        <Tab.Screen name="Profile" component={ProfileScreenStack} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

function HomeScreenStack() {
  return (
    <HomeStack.Navigator screenOptions={{ headerTitleAlign: "center" }}>
      <HomeStack.Screen
        name="Home"
        component={HomeScreen}
        options={{ title: "My Goals" }}
      />
    </HomeStack.Navigator>
  );
}

function GroupGoalScreenStack() {
  return (
    <GroupGoalStack.Navigator screenOptions={{ headerTitleAlign: "center" }}>
      <GroupGoalStack.Screen
        name="GroupGoal"
        component={GroupGoalScreen}
        options={{ title: "Group Goals" }}
      />
    </GroupGoalStack.Navigator>
  );
}

function AddGoalScreenStack() {
  return (
    <AddGoalStack.Navigator screenOptions={{ headerTitleAlign: "center" }}>
      <AddGoalStack.Screen
        name="AddGoal"
        component={AddGoalScreen}
        options={{ title: "New Milestone" }}
      />
    </AddGoalStack.Navigator>
  );
}

function ExpensesScreenStack() {
  return (
    <ExpensesStack.Navigator screenOptions={{ headerTitleAlign: "center" }}>
      <ExpensesStack.Screen
        name="Expenses"
        component={ExpensesScreen}
        options={{ title: "Spending Log" }}
      />
    </ExpensesStack.Navigator>
  );
}

function ProfileScreenStack() {
  return (
    <ProfileStack.Navigator screenOptions={{ headerTitleAlign: "center" }}>
      <ProfileStack.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ title: "username" }}
      />
    </ProfileStack.Navigator>
  );
}

export default App;
