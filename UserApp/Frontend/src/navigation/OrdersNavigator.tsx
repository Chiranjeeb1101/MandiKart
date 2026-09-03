import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import OrderListScreen from '../screens/orders/OrderListScreen';
import OrderDetailsScreen from '../screens/orders/OrderDetailsScreen';
import OrderTrackingScreen from '../screens/orders/OrderTrackingScreen';
import { OrdersStackParamList } from './types';

const Stack = createNativeStackNavigator<OrdersStackParamList>();

export default function OrdersNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="MyOrders" component={OrderListScreen as any} />
      <Stack.Screen name="OrderDetails" component={OrderDetailsScreen as any} />
      <Stack.Screen name="OrderTracking" component={OrderTrackingScreen as any} />
    </Stack.Navigator>
  );
}
