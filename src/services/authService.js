import supabase from "../utils/connectSupabase";
import { decrypt, encrypt } from "../utils/crypto";
import { addImage as addImageHelper } from "../utils/supabaseImages";

const defaultImage = import.meta.env.VITE_DEFAULT_IMG;

const addImage = async (userEmail, avatarFile) => {
  const type = avatarFile.type.split("/")[1];
  console.log(type);
  const path = `images/${userEmail}/avatar.${type}`;
  return addImageHelper(path, avatarFile);
};

const getUserById = async (userId) => {
  try {
    const { data, error } = await supabase
      .from("User")
      .select("*")
      .eq("USER_ID", userId);

    if (error) {
      console.error("Can't get the user: " + error);
      throw error;
    }

    return data[0];
  } catch (err) {
    console.error("Can't get the user: " + err);
    throw err;
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
  const { data, error } = await supabase.from("User").insert(user).select();

  if (error) {
    console.error("Can't create a user: " + error);
    throw error;
  }

  return data[0];
};

const login = async (credentials) => {
  const { email, password } = credentials;

  if (!email || !password) {
    throw new Error("Email and password are required");
  }

  const { data, error } = await supabase
    .from("User")
    .select(
      "USER_ID, USER_EMAIL, USER_PASSWORD, USER_ABOUT, USER_PROFILE_SRC, USER_BIRTH_DATE"
    )
    .eq("USER_EMAIL", email);

  if (error) {
    console.error(error);
    throw error;
  }

  if (data && data.length > 0) {
    const userPassword = data[0].USER_PASSWORD;
    const decyptedPassword = decrypt(userPassword);

    if (password != decyptedPassword) {
      throw new Error("Passwords don't match.");
    }

    // Update the last login time
    await supabase
      .from("User")
      .update({ USER_LAST_LOGIN: new Date() })
      .eq("USER_EMAIL", email);

    return data[0];
  } else {
    throw new Error("Invalid email or password");
  }
};

export default { signup, login, getUserById };
