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
import {
  HeartIcon,
  MessageCircleIcon,
  ShareIcon,
  TrashIcon
} from "lucide-react";
import dynamic from "next/dynamic";
import { api } from "../../../../convex/_generated/api";
import { Image } from "@nextui-org/image";
import { Skeleton } from "@/components/ui/skeleton";
import { Id } from "../../../../convex/_generated/dataModel";

// Dynamically load the PostModal component
const PostModal = dynamic(() => import("./post-modal"), { ssr: false });

// Expandable text component to handle long posts
const ExpandableText = ({ content }: { content: string }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const maxLength = 100; // Max characters before truncating

  if (!content) return null;

  if (content.length <= maxLength) {
    return <p className="mb-4">{content}</p>;
  }

  return (
    <p className="mb-4">
      {isExpanded ? content : `${content.substring(0, maxLength)}...`}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="text-blue-500 ml-1"
      >
        {isExpanded ? "Show less" : "Read more"}
      </button>
    </p>
  );
};

export default function PostPage() {
  // Fetch posts using the Convex API
  const posts = useQuery(api.posts.get);
  const deletePost = useMutation(api.post.deletePost); // Mutation to delete post

  // Handle deleting a post
  const handleDelete = async (postId: Id<"posts">) => {
    try {
      await deletePost({ postId });
    } catch (error) {
      console.error("Failed to delete post:", error);
    }
  };

  // Loading state with skeleton placeholders
  if (!posts) {
    return (
      <div className="container mx-auto max-w-screen-md space-y-4">
        {[...Array(3)].map((_, idx) => (
          <Skeleton key={idx} className="h-32 w-full max-w-md" />
        ))}
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
      <header className="flex flex-col sm:flex-row justify-between items-center mb-6">
        <PostModal />
      </header>

      <div className="space-y-6 w-full">
        {posts.map((post: any) => (
          <Card
            key={post.post._id}
            className="w-full max-w-full sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl mx-auto py-4"
          >
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <Avatar>
                    <AvatarImage src={post.authorImage} alt={post.authorName} />
                    <AvatarFallback>{post.authorName?.[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold text-md">{post.authorName}</p>
                    <p className="text-sm text-gray-600">
                      {new Date(post.post._creationTime).toLocaleDateString(
                        "en-US",
                        {
                          day: "numeric",
                          month: "short",
                          year: "numeric"
                        }
                      )}
                    </p>
                  </div>
                </div>

                {post.isCurrentUser && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(post.post._id)}
                  >
                    <TrashIcon className="mr-2 h-4 w-4 text-red-500" />
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <ExpandableText content={post.post.content || ""} />
              {post.post.imageUrl && (
                <Image
                  src={post.post.imageUrl}
                  alt="Post content"
                  className="rounded-lg max-w-[500] h-auto max-h-[50vh] sm:max-h-[60vh] md:max-h-[70vh] lg:max-h-[80vh] xl:max-h-[90vh] z-0"
                  loading="lazy"
                />
              )}
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="ghost" size="sm">
                <HeartIcon className="mr-2 h-4 w-4" />
                {post.post.likesCount || 0}
              </Button>
              <Button variant="ghost" size="sm">
                <MessageCircleIcon className="mr-2 h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm">
                <ShareIcon className="mr-2 h-4 w-4" />
                Share
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
