import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList, ProductStackParamList, CheckoutStackParamList, ChatStackParamList } from './types';
import AuthNavigator from './AuthNavigator';
import MainTabNavigator from './MainTabNavigator';
import { useAuth } from '../context/AuthContext';

// Stacks
import ProductListingScreen from '../screens/product/ProductListingScreen';
import ProductDetailsScreen from '../screens/product/ProductDetailsScreen';
import FarmerProfileScreen from '../screens/product/FarmerProfileScreen';
import SearchScreen from '../screens/product/SearchScreen';
import AllCategoriesScreen from '../screens/main/CategoriesScreen';

import DeliveryAddressScreen from '../screens/checkout/DeliveryAddressScreen';
import CheckoutReviewScreen from '../screens/checkout/CheckoutReviewScreen';
import PaymentScreen from '../screens/checkout/PaymentScreen';
import OrderConfirmationScreen from '../screens/checkout/OrderConfirmationScreen';

import OrderDetailsScreen from '../screens/orders/OrderDetailsScreen';
import OrderTrackingScreen from '../screens/orders/OrderTrackingScreen';

import ChatListScreen from '../screens/chat/ChatListScreen';
import ChatScreen from '../screens/chat/ChatScreen';

import WishlistScreen from '../screens/main/WishlistScreen';
import NotificationsScreen from '../screens/profile/NotificationScreen';
import EditProfileScreen from '../screens/profile/EditProfileScreen';
import SettingsScreen from '../screens/profile/SettingsScreen';
import AddAddressScreen from '../screens/checkout/AddAddressScreen';

const RootStack = createNativeStackNavigator<RootStackParamList>();
const ProductStack = createNativeStackNavigator<ProductStackParamList>();
const CheckoutStack = createNativeStackNavigator<CheckoutStackParamList>();
const ChatStack = createNativeStackNavigator<ChatStackParamList>();

export default function RootNavigator() {
  const { isAuthenticated } = useAuth();

  return (
    <RootStack.Navigator screenOptions={{ headerShown: false }}>
      {!isAuthenticated ? (
        <RootStack.Screen name="Auth" component={AuthNavigator} />
      ) : (
        <RootStack.Screen name="Main" component={MainTabNavigator} />
      )}
      {/* These screens are accessible from anywhere in the app */}
      <RootStack.Screen name="ProductStack" options={{ presentation: 'card' }}>
        {() => (
          <ProductStack.Navigator screenOptions={{ headerShown: false }}>
            <ProductStack.Screen name="Search" component={SearchScreen as any} />
            <ProductStack.Screen name="ProductListing" component={ProductListingScreen as any} />
            <ProductStack.Screen name="ProductDetails" component={ProductDetailsScreen as any} />
            <ProductStack.Screen name="FarmerProfile" component={FarmerProfileScreen as any} />
            <ProductStack.Screen name="AllCategories" component={AllCategoriesScreen as any} />
          </ProductStack.Navigator>
        )}
      </RootStack.Screen>
      <RootStack.Screen name="CheckoutStack" options={{ presentation: 'card' }}>
        {() => (
          <CheckoutStack.Navigator screenOptions={{ headerShown: false }}>
            <CheckoutStack.Screen name="DeliveryAddress" component={DeliveryAddressScreen as any} />
            <CheckoutStack.Screen name="CheckoutReview" component={CheckoutReviewScreen as any} />
            <CheckoutStack.Screen name="Payment" component={PaymentScreen as any} />
            <CheckoutStack.Screen name="OrderConfirmation" component={OrderConfirmationScreen as any} />
          </CheckoutStack.Navigator>
        )}
      </RootStack.Screen>
      <RootStack.Screen name="ChatStack" options={{ presentation: 'card' }}>
        {() => (
          <ChatStack.Navigator screenOptions={{ headerShown: false }}>
            <ChatStack.Screen name="ChatList" component={ChatListScreen as any} />
            <ChatStack.Screen name="Chat" component={ChatScreen as any} />
          </ChatStack.Navigator>
        )}
      </RootStack.Screen>
      <RootStack.Screen name="Wishlist" component={WishlistScreen} />
      <RootStack.Screen name="Notifications" component={NotificationsScreen} />
      <RootStack.Screen name="EditProfile" component={EditProfileScreen} />
      <RootStack.Screen name="Settings" component={SettingsScreen} />
      <RootStack.Screen name="AddAddress" component={AddAddressScreen as any} />
      <RootStack.Screen name="OrderDetails" component={OrderDetailsScreen as any} />
      <RootStack.Screen name="OrderTracking" component={OrderTrackingScreen as any} />
      <RootStack.Screen name="OrderConfirmation" component={OrderConfirmationScreen as any} />
    </RootStack.Navigator>
  );
}
