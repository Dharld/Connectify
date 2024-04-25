import supabase from "./connectSupabase";

export const addImage = async (path, file) => {
  try {
    const { data, error } = await supabase.storage
      .from("bucket")
      .upload(path, file);
    if (error) {
      console.error("Error uploading image: ", error.message);
      throw error;
    }
    console.log("Image uploaded successfully: ", data);
    return data.fullPath;
  } catch (e) {
    console.error(e);
    throw e;
  }
};
