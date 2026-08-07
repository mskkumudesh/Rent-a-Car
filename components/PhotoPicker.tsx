import React, { useState } from "react";
import { View, Text, TouchableOpacity, TextInput, ActivityIndicator, StyleSheet } from "react-native";
import { Image } from "expo-image";
import * as ImagePicker from "expo-image-picker";
import { Ionicons } from "@expo/vector-icons";
import { uploadCarPhoto } from "../service/uploadService";
import { Colors } from "../constants/theme";
import { showAlert } from "../lib/alert";

type Props = {
  value: string;
  onChange: (url: string) => void;
  disabled?: boolean;
};

export default function PhotoPicker({ value, onChange, disabled }: Props) {
  const [uploading, setUploading] = useState(false);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [urlDraft, setUrlDraft] = useState(value);

  const handlePicked = async (uri: string) => {
    setUploading(true);
    try {
      const url = await uploadCarPhoto(uri);
      onChange(url);
      setUrlDraft(url);
    } catch (err: any) {
      showAlert("Upload failed", err.message);
    } finally {
      setUploading(false);
    }
  };

  const pickFromGallery = async () => {
    const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!perm.granted) {
      showAlert("Permission needed", "Allow photo library access to choose a photo.");
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.7,
    });
    if (!result.canceled && result.assets?.[0]?.uri) {
      handlePicked(result.assets[0].uri);
    }
  };

  const pickFromCamera = async () => {
    const perm = await ImagePicker.requestCameraPermissionsAsync();
    if (!perm.granted) {
      showAlert("Permission needed", "Allow camera access to take a photo.");
      return;
    }
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.7,
    });
    if (!result.canceled && result.assets?.[0]?.uri) {
      handlePicked(result.assets[0].uri);
    }
  };

  return (
    <View style={{ marginBottom: 14 }}>
      <Text style={styles.label}>Photo</Text>

      <View style={styles.preview}>
        {value ? (
          <Image source={{ uri: value }} style={styles.previewImage} contentFit="cover" />
        ) : (
          <View style={styles.placeholder}>
            <Ionicons name="image-outline" size={32} color={Colors.textMuted} />
            <Text style={styles.placeholderText}>No photo yet</Text>
          </View>
        )}
        {uploading && (
          <View style={styles.uploadingOverlay}>
            <ActivityIndicator color="#fff" />
            <Text style={styles.uploadingText}>Uploading…</Text>
          </View>
        )}
      </View>

      <View style={styles.buttonRow}>
        <TouchableOpacity
          activeOpacity={0.75}
          style={[styles.pickBtn, (disabled || uploading) && styles.pickBtnDisabled]}
          onPress={pickFromCamera}
          disabled={disabled || uploading}
        >
          <Ionicons name="camera" size={16} color={Colors.ink} />
          <Text style={styles.pickBtnText}>Camera</Text>
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={0.75}
          style={[styles.pickBtn, (disabled || uploading) && styles.pickBtnDisabled]}
          onPress={pickFromGallery}
          disabled={disabled || uploading}
        >
          <Ionicons name="images" size={16} color={Colors.ink} />
          <Text style={styles.pickBtnText}>Gallery</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={styles.urlToggle}
        onPress={() => setShowUrlInput((s) => !s)}
        disabled={disabled || uploading}
      >
        <Text style={styles.urlToggleText}>
          {showUrlInput ? "Hide URL field" : "or paste an image URL instead"}
        </Text>
      </TouchableOpacity>

      {showUrlInput && (
        <TextInput
          style={styles.urlInput}
          value={urlDraft}
          onChangeText={(text) => {
            setUrlDraft(text);
            onChange(text.trim());
          }}
          placeholder="https://example.com/car.jpg"
          autoCapitalize="none"
          autoCorrect={false}
          editable={!disabled && !uploading}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  label: { fontSize: 12.5, color: Colors.textMuted, marginBottom: 6, fontWeight: "700" },
  preview: {
    width: "100%",
    height: 160,
    borderRadius: 12,
    backgroundColor: Colors.background,
    borderWidth: 1,
    borderColor: Colors.border,
    overflow: "hidden",
    justifyContent: "center",
    alignItems: "center",
  },
  previewImage: { width: "100%", height: "100%" },
  placeholder: { alignItems: "center" },
  placeholderText: { color: Colors.textMuted, fontSize: 12, marginTop: 6 },
  uploadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  uploadingText: { color: "#fff", fontSize: 12, marginTop: 6, fontWeight: "600" },
  buttonRow: { flexDirection: "row", marginTop: 10, gap: 8 },
  pickBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.divider,
    paddingVertical: 11,
    borderRadius: 10,
    flex: 1,
  },
  pickBtnDisabled: { opacity: 0.5 },
  pickBtnText: { color: Colors.ink, fontWeight: "700", marginLeft: 6, fontSize: 13 },
  urlToggle: { marginTop: 10 },
  urlToggleText: { color: Colors.textMuted, fontSize: 12, textDecorationLine: "underline" },
  urlInput: {
    marginTop: 8,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 10,
    padding: 12,
    fontSize: 14,
    backgroundColor: Colors.background,
    color: Colors.ink,
  },
});
