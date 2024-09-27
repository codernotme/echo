import { ConvexError, v } from "convex/values";
import { mutation } from "./_generated/server";
import { getUserByClerkId } from "./_utils";

// Mutation to create a new post
export const create = mutation({
  // Expected arguments for creating a post
  args: {
    type: v.string(),                // Required: Type of the post (e.g., text, image, video)
    content: v.optional(v.string()), // Optional: Text content
    imageUrl: v.optional(v.string()),// Optional: Image URL
    videoUrl: v.optional(v.string()),// Optional: Video URL
  },
  handler: async (ctx, { type, content, imageUrl, videoUrl }) => {
    // Get the current user identity
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new ConvexError("Unauthorized access. Please log in.");
    }

    // Retrieve user details from the database using Clerk ID
    const currentUser = await getUserByClerkId({
      ctx,
      clerkId: identity.subject,
    });
    
    if (!currentUser) {
      throw new ConvexError("User not found. Please check your account.");
    }

    // Construct the new post data
    const postData = {
      userId: currentUser._id,   // Current user ID
      likesCount: 0,             // Initial likes count
      type,                      // Post type (required)
      content: content || "",    // Optional content (empty string if undefined)
      imageUrl: imageUrl || undefined, // Optional image URL (undefined if not provided)
      videoUrl: videoUrl || undefined  // Optional video URL (undefined if not provided)
    };

    // Insert the new post into the "posts" collection
    const newPost = await ctx.db.insert("posts", postData);

    return newPost;  // Return the newly created post
  },
});


export const deletePost = mutation({
  args: {
    postId: v.id("posts"),
  },
  handler: async (ctx, { postId }) => {
    await ctx.db.delete(postId);
  },
});

export const createComment = mutation({
  args: {
    postId: v.id("posts"),        // Required: Post ID the comment belongs to
    content: v.string(),          // Required: Content of the comment
  },
  handler: async (ctx, { postId, content }) => {
    // Get the current user identity
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new ConvexError("Unauthorized access. Please log in.");
    }

    // Retrieve user details using Clerk ID
    const currentUser = await getUserByClerkId({
      ctx,
      clerkId: identity.subject,
    });
    
    if (!currentUser) {
      throw new ConvexError("User not found. Please check your account.");
    }

    // Construct the new comment data
    const commentData = {
      postId,            // Post ID
      userId: currentUser._id,   // Current user ID
      content            // Comment content
    };

    // Insert the new comment into the "comments" collection
    const newComment = await ctx.db.insert("comments", commentData);

    return newComment;
  },
});

// Mutation to delete a comment
export const deleteComment = mutation({
  args: {
    commentId: v.id("comments"),
  },
  handler: async (ctx, { commentId }) => {
    await ctx.db.delete(commentId);
  },
});