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
    const { data, error } = await supabase.rpc("get_all_posts_with_likes");
    if (error) {
      console.log("Can't get all posts: " + error.message);
      throw error;
    }
    return data;
  } catch (err) {
    console.error("Can't get all posts: " + err.message);
    throw err;
  }
}

async function getPostsByTitle(title) {
  try {
    const { data, error } = await supabase.rpc(
      "get_posts_with_upvotes", // name of the stored procedure
      { title } // parameter(s) to pass to the procedure
    );
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
  try {
    const { data, error } = await supabase.rpc("get_posts_by_community_name", {
      name,
    });
    if (error) {
      console.error("Can't get posts by community name: " + error.message);
      throw error;
    }
    return data;
  } catch (err) {
    console.error("Can't get posts by community name: " + err.message);
    throw err;
  }
}
async function getRecentPosts() {
  try {
    const { data, error } = await supabase.rpc("get_recent_posts");
    if (error) {
      console.error("Can't get recent posts: " + error.message);
      throw error;
    }
    console.log(data);
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
async function getPostsSortedByDate() {
  try {
    const { data, error } = await supabase.rpc("get_posts_sorted_by_date");
    if (error) {
      console.error("Can't get posts sorted by date: " + error.message);
      throw error;
    }
    return data;
  } catch (err) {
    console.error("Can't get posts sorted by date: " + err.message);
    throw err;
  }
}
async function getPostsSortedByUpvote() {
  try {
    const { data, error } = await supabase.rpc("get_posts_sorted_by_upvote");

    if (error) {
      console.error(error);
      console.error("Can't get posts by upvote: " + error.message);
      throw error;
    }

    console.log(data);
    return data;
  } catch (err) {
    console.error("Can't get posts by upvote: " + err.message);
    throw err;
  }
}

async function deletePost(postId) {
  try {
    const { data, error } = await supabase
      .from("Post")
      .delete()
      .eq("POST_ID", postId);

    if (error) {
      console.error("Can't delete post: " + error.message);
      throw error;
    }
  } catch (err) {
    console.error("Can't delete post: " + err.message);
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
  getPostsSortedByDate,
  getPostsSortedByUpvote,
  deletePost,
};
