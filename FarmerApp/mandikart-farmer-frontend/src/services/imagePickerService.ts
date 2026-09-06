/**
 * MandiKart — Image Picker Service
 *
 * Handles photo picking from library and camera capture for farmer profiles
 * using native expo-image-picker.
 */

import * as ImagePicker from 'expo-image-picker';
import { Alert, Platform } from 'react-native';

export interface ImagePickerResult {
  cancelled: boolean;
  uri?: string;
  error?: string;
}

export async function pickImageFromGallery(): Promise<ImagePickerResult> {
  try {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(
        'Permission Required',
        'Please grant access to your photo library to select a profile picture.'
      );
      return { cancelled: true, error: 'Permission not granted' };
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
      base64: true,
    });

    if (result.canceled || !result.assets || result.assets.length === 0) {
      return { cancelled: true };
    }

    const asset = result.assets[0];
    const resolvedUri = asset.base64
      ? `data:image/jpeg;base64,${asset.base64}`
      : asset.uri;

    return {
      cancelled: false,
      uri: resolvedUri,
    };
  } catch (err: any) {
    console.error('Error picking image from gallery:', err);
    return {
      cancelled: true,
      error: err?.message || 'Failed to select image',
    };
  }
}

export async function takePhotoWithCamera(): Promise<ImagePickerResult> {
  try {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(
        'Permission Required',
        'Please grant camera permission to take a profile picture.'
      );
      return { cancelled: true, error: 'Permission not granted' };
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
      base64: true,
    });

    if (result.canceled || !result.assets || result.assets.length === 0) {
      return { cancelled: true };
    }

    const asset = result.assets[0];
    const resolvedUri = asset.base64
      ? `data:image/jpeg;base64,${asset.base64}`
      : asset.uri;

    return {
      cancelled: false,
      uri: resolvedUri,
    };
  } catch (err: any) {
    console.error('Error taking photo:', err);
    return {
      cancelled: true,
      error: err?.message || 'Failed to take photo',
    };
  }
}
