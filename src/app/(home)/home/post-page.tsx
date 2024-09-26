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

const PostModal = dynamic(() => import("./post-modal"), { ssr: false });

const ExpandableText = ({ content }: { content: string }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const maxLength = 100;

  if (!content) return null;

  if (content.length <= maxLength) {
    return <p className="mb-4">{content}</p>;
  }

  return (
    <p className="mb-4">
      {isExpanded ? content : `${content.substring(0, maxLength)}...`}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="text-blue-500 dark:text-blue-400 transition-colors duration-300 hover:text-blue-700 dark:hover:text-blue-300 ml-1"
      >
        {isExpanded ? "Show less" : "Read more"}
      </button>
    </p>
  );
};

export default function PostPage() {
  const posts = useQuery(api.posts.get);
  const deletePost = useMutation(api.post.deletePost);

  const handleDelete = async (postId: Id<"posts">) => {
    try {
      await deletePost({ postId });
    } catch (error) {
      console.error("Failed to delete post:", error);
    }
  };

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
    <div className="py-6">
      <div className="space-y-6 py-6">
        <PostModal />
      </div>
      <div className="space-y-6 w-full">
        {posts.map((post: any) => (
          <Card
            key={post.post._id}
            className="w-full max-w-full sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl mx-auto py-4"
            style={{
              boxShadow: "0 8px 16px rgba(0, 0, 0, 0.1)",
              borderRadius: "12px"
            }}
          >
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <Avatar>
                    <AvatarImage src={post.authorImage} alt={post.authorName} />
                    <AvatarFallback>{post.authorName?.[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold text-md ">{post.authorName}</p>
                    <p className="text-sm">
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
                    size="icon"
                    onClick={() => handleDelete(post.post._id)}
                    className="transition-colors duration-300 hover:bg-red-100"
                  >
                    <Image
                      src="/assets/trash.png"
                      width="md"
                      height="md"
                      alt="Delete"
                    />
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <p className="mb-4 text-base">
                <ExpandableText content={post.post.content || ""} />
              </p>
              {post.post.imageUrl && (
                <Image
                  src={post.post.imageUrl}
                  alt="Post content"
                  className="rounded-lg max-w-full h-auto max-h-[50vh] sm:max-h-[60vh]"
                  loading="lazy"
                />
              )}
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button
                variant="ghost"
                size="icon"
                className="transition-colors duration-300 hover:text-red-500"
              >
                <Image
                  src="/assets/heart-icon.png"
                  width="20"
                  height="20"
                  alt="Like"
                />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="transition-colors duration-300 hover:text-blue-500"
              >
                <Image
                  src="/assets/comment.png"
                  width="20"
                  height="20"
                  alt="Comment"
                />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="transition-colors duration-300 hover:text-green-500"
              >
                <Image
                  src="/assets/share.png"
                  width="20"
                  height="20"
                  alt="Share"
                />
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
