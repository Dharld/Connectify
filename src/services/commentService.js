import supabase from "../utils/connectSupabase";
import authService from "./authService";
import postService from "./postService";

async function getAllPostComments(postId) {
  try {
    await supabase
      .from("Comment")
      .select(
        `
        COMMENT_TEXT
        COMMENT_CREATED_AT
        User: (USER_ID, USER_EMAIL, USER_PROFILE_SRC)
      `
      )
      .eq("POST_ID", postId);
  } catch (e) {
    console.error("Can't get comments for post " + e.message);
    throw e;
  }
}
async function commentPost(userId, postId, content) {
  try {
    await authService.getUserById(userId);
    await postService.getPostById(postId);
    await supabase.from("Comment").insert({
      POST_ID: postId,
      USER_ID: userId,
      COMMENT_TEXT: content,
    });
  } catch (e) {
    console.error("Can't comment post: ", e.message);
    throw e;
  }
}

export default {
  commentPost,
  getAllPostComments,
};
