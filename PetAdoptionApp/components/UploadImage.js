// Import required modules
import { useState } from "react";
import { Button, View } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { createClient } from "@supabase/supabase-js";
import * as FileSystem from "expo-file-system";
import { decode } from "base64-arraybuffer";

// Initialize Supabase client
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabasePrivateKey = process.env.EXPO_PUBLIC_SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

const UploadImage = () => {
  const [uploading, setUploading] = useState(false);

  // Function to pick an image or a PDF
  const pickImageOrPDF = async () => {
    // Let the user pick an image or PDF
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsMultipleSelection: false, // Set to true if you want to allow multiple selection
    });

    if (!result.canceled) {
      uploadFileToSupabase(result.assets[0].uri);
    }
  };

  // Function to upload the file to Supabase
  const uploadFileToSupabase = async (uri) => {
    setUploading(true);
    try {
      // Extract file name and type from URI
      let uriParts = uri.split("/");
      let fileName = uriParts[uriParts.length - 1];
      let fileType = fileName.split(".")[1];

      // Read the file into base64 format
      const base64 = await FileSystem.readAsStringAsync(uri, {
        encoding: FileSystem.EncodingType.Base64,
      });

      // Upload file to Supabase Storage
      const { data, error } = await supabase.storage
        .from("pet-bucket")
        .upload(`folder/${fileName}`, decode(base64), {
          contentType: `image/${fileType}`,
          upsert: false,
        });

      if (error) {
        throw error;
      }

      alert("Upload successful");
    } catch (error) {
      alert(`Error uploading file: ${error.message}`);
    } finally {
      setUploading(false);
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Button
        title={uploading ? "Uploading..." : "Pick an Image or PDF"}
        onPress={pickImageOrPDF}
      />
    </View>
  );
};

export default UploadImage;
