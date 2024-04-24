import supabase from "../utils/connectSupabase";

async function getCommunity(name) {
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
    await getCommunity(name);
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

export default { getCommunity, createCommunity };
