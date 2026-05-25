import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "../theme";

import DashboardScreen from "../screens/DashboardScreen";
import LeadsScreen from "../screens/LeadsScreen";
import EscalationsScreen from "../screens/EscalationsScreen";
import FollowUpsScreen from "../screens/FollowUpsScreen";
import ConversationScreen from "../screens/ConversationScreen";

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// Stack navigator wrapping Leads tab — allows pushing ConversationScreen
function LeadsStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="LeadsList" component={LeadsScreen} />
      <Stack.Screen name="Conversation" component={ConversationScreen} />
    </Stack.Navigator>
  );
}

// Stack navigator wrapping Escalations tab
function EscalationsStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="EscalationsList" component={EscalationsScreen} />
      <Stack.Screen name="Conversation" component={ConversationScreen} />
    </Stack.Navigator>
  );
}

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarActiveTintColor: COLORS.tabActive,
          tabBarInactiveTintColor: COLORS.tabInactive,
          tabBarStyle: {
            backgroundColor: "#FFFFFF",
            borderTopColor: "#E5E7EB",
            borderTopWidth: 1,
            paddingBottom: 6,
            paddingTop: 6,
            height: 60,
          },
          tabBarLabelStyle: {
            fontSize: 11,
            fontWeight: "600",
          },
          tabBarIcon: ({ focused, color, size }) => {
            const icons = {
              Home: focused ? "home" : "home-outline",
              Leads: focused ? "people" : "people-outline",
              Escalations: focused ? "alert-circle" : "alert-circle-outline",
              FollowUps: focused ? "time" : "time-outline",
            };
            return <Ionicons name={icons[route.name]} size={22} color={color} />;
          },
        })}
      >
        <Tab.Screen name="Home" component={DashboardScreen} options={{ tabBarLabel: "Home" }} />
        <Tab.Screen name="Leads" component={LeadsStack} options={{ tabBarLabel: "Leads" }} />
        <Tab.Screen name="Escalations" component={EscalationsStack} options={{ tabBarLabel: "Escalations" }} />
        <Tab.Screen name="FollowUps" component={FollowUpsScreen} options={{ tabBarLabel: "Follow-ups" }} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}