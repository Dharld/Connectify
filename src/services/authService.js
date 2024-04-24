import supabase from "../utils/connectSupabase";
import { encrypt } from "../utils/crypto";

const defaultImage = import.meta.env.VITE_DEFAULT_IMG;

const addImage = async (userEmail, avatarFile) => {
  const type = avatarFile.type ? avatarFile.type.split("/")[1] : "png";
  try {
    const { data, error } = await supabase.storage
      .from("bucket")
      .upload(`images/${userEmail}/avatar.${type}`, avatarFile);
    if (error) {
      console.error("Error uploading image:", error.message);
      throw error;
    }
    console.log("Image uploaded successfully:", data);
    return data.fullPath;
  } catch (e) {
    console.error(e);
    throw e;
  }
};

const signup = async (credentials, profileImg) => {
  const { email, password, birthDate } = credentials;

  if (!email || !password || !birthDate) {
    throw new Error("All fields are required");
  }

  // Check for email;
  const { res } = await supabase
    .from("User")
    .select("*")
    .eq("USER_EMAIL", email);

  if (res && res.length > 0) {
    throw new Error("User already exists");
  }

  const encryptedPassword = encrypt(password);

  let imageSrc = null;
  // Add image to the storage
  if (profileImg) {
    imageSrc = await addImage(email, profileImg);
  }

  const user = {
    USER_EMAIL: email,
    USER_PASSWORD: encryptedPassword,
    USER_BIRTH_DATE: new Date(birthDate),
    USER_PROFILE_SRC: defaultImage,
  };

  if (imageSrc) {
    user.USER_PROFILE_SRC = imageSrc;
  }

  // Add user to the database
  const { data, error } = await supabase.from("User").insert(user);

  if (error) {
    console.error(error);
    throw error;
  }

  return data;
};

export default { signup, addImage };
