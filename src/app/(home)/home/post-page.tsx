"use client";

import React, { useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader
} from "@/components/ui/card";
import { Image } from "@nextui-org/image";
import dynamic from "next/dynamic";
import { api } from "../../../../convex/_generated/api";
import { Skeleton } from "@/components/ui/skeleton";
import { Id } from "../../../../convex/_generated/dataModel";
import CommentInput from "./_components/commentInput";
import { Heart, MessageCircle, Share2, Trash2 } from "lucide-react";

const PostModal = dynamic(() => import("./post-modal"), { ssr: false });

const ExpandableText = ({ content }: { content: string }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const maxLength = 100;

  if (!content) return null;

  return (
    <p className="text-sm text-gray-700 dark:text-gray-200">
      {isExpanded ? content : `${content.substring(0, maxLength)}...`}
      {content.length > maxLength && (
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300 text-sm ml-1 focus:outline-none"
        >
          {isExpanded ? "Show less" : "Read more"}
        </button>
      )}
    </p>
  );
};

const CommentSection = ({
  postId,
  isVisible,
  handleDeleteComment
}: {
  postId: Id<"posts">;
  isVisible: boolean;
  handleDeleteComment: (commentId: Id<"comments">) => void;
}) => {
  const comments = useQuery(api.posts.getComments, { postId });

  if (!comments) {
    return <Skeleton className="h-6 w-full" />;
  }

  return (
    <div className={`mt-4 ${isVisible ? "block" : "hidden"}`}>
      {comments.map((comment: any) => (
        <div
          key={comment.comment._id}
          className="flex items-start space-x-3 mb-3"
        >
          <Avatar className="w-8 h-8">
            <AvatarImage src={comment.authorImage} alt={comment.authorName} />
            <AvatarFallback>{comment.authorName?.[0]}</AvatarFallback>
          </Avatar>
          <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-2 flex-grow shadow-md">
            <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
              {comment.authorName}
            </p>
            <p className="text-xs text-gray-600 dark:text-gray-400">
              {comment.comment.content}
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => handleDeleteComment(comment.comment._id)}
            className="text-gray-400 hover:text-red-500 ml-2"
          >
            <Trash2 className="h-5 w-5" />
          </Button>
        </div>
      ))}
      <CommentInput postId={postId} />
    </div>
  );
};

export default function PostPage() {
  const posts = useQuery(api.posts.get);
  const deletePost = useMutation(api.post.deletePost);
  const deleteComment = useMutation(api.post.deleteComment);
  const [expandedPostId, setExpandedPostId] = useState<Id<"posts"> | null>(
    null
  );

  const handleDeleteComment = async (commentId: Id<"comments">) => {
    try {
      await deleteComment({ commentId });
    } catch (error) {
      console.error("Failed to delete comment:", error);
    }
  };

  const handleDelete = async (postId: Id<"posts">) => {
    try {
      await deletePost({ postId });
    } catch (error) {
      console.error("Failed to delete post:", error);
    }
  };

  const toggleComments = (postId: Id<"posts">) => {
    setExpandedPostId(expandedPostId === postId ? null : postId);
  };

  if (!posts) {
    return (
      <div className="container mx-auto max-w-lg space-y-4 p-4">
        {[...Array(3)].map((_, idx) => (
          <Skeleton key={idx} className="h-64 w-full rounded-xl" />
        ))}
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-lg p-4 space-y-6">
      <PostModal />
      {posts.map((post: any) => (
        <Card
          key={post.post._id}
          className="overflow-hidden p-4 items-center justify-between "
        >
          <CardHeader className="p-4 flex items-center space-x-4 flex-row">
            <Avatar className="w-10 h-10">
              <AvatarImage src={post.authorImage} alt={post.authorName} />
              <AvatarFallback>{post.authorName?.[0]}</AvatarFallback>
            </Avatar>
            <div className="flex-grow">
              <p className="font-semibold text-gray-800 dark:text-gray-200">
                {post.authorName}
              </p>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                {new Date(post.post._creationTime).toLocaleDateString("en-US", {
                  day: "numeric",
                  month: "short",
                  year: "numeric"
                })}
              </p>
            </div>
            {post.isCurrentUser && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleDelete(post.post._id)}
                className="text-gray-400 hover:text-red-500"
              >
                <Trash2 className="h-5 w-5" />
              </Button>
            )}
          </CardHeader>
          <CardContent className="p4 space-y-4 text-lg">
            <ExpandableText content={post.post.content || ""} />
          </CardContent>
          {post.post.imageUrl && (
            <Image
              src={post.post.imageUrl}
              alt="Post content"
              className="w-full h-auto max-h-96 object-cover"
            />
          )}
          <CardFooter className="p-4 flex justify-between items-center">
            <Button
              variant="ghost"
              size="sm"
              className="text-gray-400 hover:text-red-500"
            >
              <Heart className="h-5 w-5 mr-1" />
              <span className="text-xs">Like</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => toggleComments(post.post._id)}
              className="text-gray-400 hover:text-blue-500"
            >
              <MessageCircle className="h-5 w-5 mr-1" />
              <span className="text-xs">Comment</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="text-gray-400 hover:text-green-500"
            >
              <Share2 className="h-5 w-5 mr-1" />
              <span className="text-xs">Share</span>
            </Button>
          </CardFooter>
          <CommentSection
            postId={post.post._id}
            isVisible={expandedPostId === post.post._id}
            handleDeleteComment={handleDeleteComment}
          />
        </Card>
      ))}
    </div>
  );
}
