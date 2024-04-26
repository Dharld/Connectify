import supabase from "../utils/connectSupabase";
import communityService from "./communityService";
import authService from "./authService";

async function checkLike(userId, postId) {
  const { data: data1 } = await supabase
    .from("Upvote")
    .select("*")
    .eq("USER_ID", userId)
    .eq("POST_ID", postId);

  if (data1 && data1.length > 0) {
    return true;
  }
  return false;
}
async function likePost(userId, postId) {
  try {
    const exists = await checkLike(userId, postId);
    if (!exists) {
      const { data, error } = await supabase.from("Upvote").insert({
        USER_ID: userId,
        POST_ID: postId,
        UPV_COUNT: 1,
      });

      if (error) {
        console.error("Can't like post: " + error.message);
        throw error;
      }

      return data;
    }
  } catch (err) {
    console.error("Can't like post: " + err.message);
    throw err;
  }
}

async function unlikePost(userId, postId) {
  try {
    const exists = await checkLike(userId, postId);
    if (exists) {
      const { data, error } = await supabase
        .from("Upvote")
        .delete()
        .eq("USER_ID", userId)
        .eq("POST_ID", postId);
    }
  } catch (err) {
    console.error("Can't like post: " + err.message);
    throw err;
  }
}

async function getAllPosts() {
  try {
    const { data, error } = await supabase.from("Post").select(
      `POST_ID, POST_TITLE, POST_CONTENT, POST_IMAGE_SRC,POST_CREATED_AT, 
      User (USER_ID, USER_EMAIL,USER_PROFILE_SRC),
      Upvote (*)
      `
    );

    if (error) {
      console.log("Can't get all posts: " + error.message);
      throw error;
    }
    return data.map((d) => {
      return {
        ...d,
      };
    });
  } catch (err) {
    console.error("Can't get all posts: " + err.message);
    throw err;
  }
}

async function getPostById(postId) {
  try {
    const { data, error } = await supabase
      .from("Post")
      .select(
        "POST_ID, POST_TITLE, POST_CONTENT, POST_IMAGE_SRC, POST_CREATED_AT, User (USER_ID, USER_EMAIL, USER_PROFILE_SRC)"
      )
      .eq("POST_ID", postId);

    if (error) {
      console.log("Can't get post by id: " + error.message);
      throw error;
    }

    return data[0];
  } catch (err) {
    console.error("Can't get post by id: " + err.message);
    throw err;
  }
}
async function createPost(postInfos) {
  const { title, content, userId, communityId } = postInfos;

  await communityService.getCommunityById(communityId);
  await authService.getUserById(userId);

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

export default { createPost, getAllPosts, getPostById, likePost, unlikePost };
