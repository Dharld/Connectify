import supabase from "../utils/connectSupabase";
import getCommunityById from "./communityService";
import getUserById from "./authService";

async function createPost(postInfos) {
  const { title, content, userId, communityId } = postInfos;

  await getCommunityById(communityId);
  await getUserById(userId);

  try {
    const { data, error } = await supabase
      .from("Post")
      .insert({
        POST_TITLE: title,
        POST_CONTENT: content,
        USER_ID: userId,
        COMMUNITY_ID: communityId,
      })
      .select("*");

    if (error) {
      console.log("Can't create post: " + error.message);
      throw error;
    }

    return data[0];
  } catch (err) {
    console.error("Can't create post: " + err.message);
    throw err;
  }
}

export default { createPost };
