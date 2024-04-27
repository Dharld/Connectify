import supabase from "../utils/connectSupabase";
import communityService from "./communityService";
import authService from "./authService";
import { addImage } from "../utils/supabaseImages";

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

async function getPostsByTitle(title) {
  try {
    const { data, error } = await supabase
      .from("Post")
      .select(
        `POST_ID, POST_TITLE, POST_CONTENT, POST_IMAGE_SRC,POST_CREATED_AT, 
      User (USER_ID, USER_EMAIL,USER_PROFILE_SRC),
      Upvote (*)
      `
      )
      .ilike("POST_TITLE", `%${title}%`);
    if (error) {
      console.error("Can't get post by title: " + error.message);
      throw error;
    }
    return data;
  } catch (err) {
    console.error("Can't get post by title: " + err.message);
    throw err;
  }
}

async function getPostsByCommunityName(name) {
  console.log(name);
  try {
    const { data, error } = await supabase
      .from("Community")
      .select("*")
      .eq("COMMUNITY_NAME", name);
    if (error) {
      console.error("Can't get community: " + error.message);
      throw error;
    }
    const communityId = data[0].COMMUNITY_ID;
    const { data: data2, error: error2 } = await supabase
      .from("Post")
      .select(
        `
        POST_ID, POST_TITLE, POST_CONTENT, POST_IMAGE_SRC,POST_CREATED_AT, 
        User (USER_ID, USER_EMAIL,USER_PROFILE_SRC),
        Upvote (*)
      `
      )
      .eq("COMMUNITY_ID", communityId);
    if (error2) {
      console.error("Can't get posts by community name: " + error2.message);
      throw error2;
    }
    return data2;
  } catch (err) {
    console.error("Can't get posts by community name: " + err.message);
    throw err;
  }
}
async function getRecentPosts() {
  try {
    const { data, error } = await supabase
      .from("Post")
      .select(
        `POST_ID, POST_TITLE, POST_CONTENT, POST_IMAGE_SRC,POST_CREATED_AT, 
        User (USER_ID, USER_EMAIL,USER_PROFILE_SRC),
        Upvote (*),
        Community (*)
        `
      )
      .order("POST_CREATED_AT", { ascending: false })
      .limit(5);
    if (error) {
      console.error("Can't get recent posts: " + error.message);
      throw error;
    }
    return data;
  } catch (err) {
    console.error("Can't get recent posts: " + err.message);
    throw err;
  }
}

async function getPostById(postId) {
  try {
    const { data, error } = await supabase
      .from("Post")
      .select(
        `POST_ID, POST_TITLE, POST_CONTENT, POST_IMAGE_SRC, POST_CREATED_AT, 
         User (USER_ID, USER_EMAIL, USER_PROFILE_SRC),
         Upvote (*)
        `
      )
      .eq("POST_ID", postId);

    // Fetch comments
    const { data: comments, error2 } = await supabase
      .from("Comment")
      .select(
        `COMMENT_ID, COMMENT_TEXT, COMMENT_CREATED_AT, User(USER_ID, USER_EMAIL, USER_PROFILE_SRC)`
      )
      .eq("POST_ID", postId);

    if (error2) {
      console.error("Error fetching comment: " + error2.message);
      console.error(error2);
      throw error2;
    }
    if (error) {
      console.error("Can't get post by id: " + error.message);
      throw error;
    }

    const post = data[0];
    post.Comment = comments ?? [];

    console.log(post);

    return post;
  } catch (err) {
    console.error("Can't get post by id: " + err.message);
    throw err;
  }
}

async function createPost(postInfos) {
  const { title, content, userId, communityId, file } = postInfos;

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
    const createdPost = data[0];

    if (file) {
      const postId = createdPost.POST_ID;
      const type = file.type.split("/")[1];
      const path = `images/posts/${postId}.${type}`;
      try {
        const fullpath = await addImage(path, file);
        await supabase
          .from("Post")
          .update({
            POST_IMAGE_SRC: fullpath,
          })
          .eq("POST_ID", postId);
      } catch (err) {
        console.error("Can't add image: " + err.message);
        throw err;
      }
    }
  } catch (err) {
    console.error("Can't create post: " + err.message);
    throw err;
  }
}

export default {
  createPost,
  getPostsByTitle,
  getAllPosts,
  getPostById,
  likePost,
  unlikePost,
  getRecentPosts,
  getPostsByCommunityName,
};
