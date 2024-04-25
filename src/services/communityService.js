import supabase from "../utils/connectSupabase";
import { addImage } from "../utils/supabaseImages";

export const addBannerImage = async (communityName, file) => {
  await getCommunity(communityName);
  console.log(file);
  const type = file.type.split("/")[1];
  const path = `images/${communityName}/banner.${type}`;
  const fullPath = await addImage(path, file);
  // If everything is successful, add modify the community record
  console.log(fullPath);
  try {
    await supabase
      .from("Community")
      .update({ COMMUNITY_BANNER_SRC: fullPath })
      .eq("COMMUNITY_NAME", communityName);
  } catch (err) {
    console.error("Can't add the banner image: " + err);
    throw err;
  }
};

export const addAvatarImage = async (communityName, file) => {
  await getCommunity(communityName);
  const type = file.type.split("/")[1];
  const path = `images/${communityName}/avatar.${type}`;
  const fullPath = await addImage(path, file);
  // If everything is successful, add modify the community record
  try {
    await supabase
      .from("Community")
      .update({ COMMUNITY_AVATAR_SRC: fullPath })
      .eq("COMMUNITY_NAME", communityName);
  } catch (err) {
    console.error("Can't add the avatar image: " + err);
    throw err;
  }
};

async function getCommunityById(id) {
  try {
    const { data, error } = await supabase
      .from("Community")
      .select("*")
      .eq("COMMUNITY_ID", id);
    if (error) {
      throw new Error(error.message);
    }
    if (data && data.length > 0) {
      return data[0];
    }
  } catch (err) {
    console.error("Error getting community:", err);
    throw err;
  }
}
async function getCommunity(name) {
  try {
    const { data, error } = await supabase
      .from("Community")
      .select("*")
      .eq("COMMUNITY_NAME", name);
    if (error) {
      throw new Error(error.message);
    }
    if (data && data.length > 0) {
      return data[0];
    }
  } catch (err) {
    console.error("Error getting community:", err);
    throw err;
  }
}

async function checkCommunity(name) {
  try {
    const { data, error } = await supabase
      .from("Community")
      .select("")
      .eq("COMMUNITY_NAME", name);
    if (error) {
      throw new Error(error.message);
    }
    if (data.length > 0) {
      throw new Error("Community name already exists");
    }
  } catch (err) {
    console.error("Error getting community:", err);
    throw err;
  }
}

async function createCommunity(name, adminId) {
  if (!adminId) {
    throw new Error("Admin ID is required to create a community");
  }
  try {
    // Check if the community name already exists
    await checkCommunity(name);
    const { data, error } = await supabase
      .from("Community")
      .insert({
        COMMUNITY_NAME: name,
        COMMUNITY_ADMIN: adminId,
      })
      .select();
    if (error) {
      throw new Error(error.message);
    }
    return data[0];
  } catch (error) {
    console.error("Error creating community:", error);
    throw error;
  }
}

export default { getCommunity, createCommunity, getCommunityById };
