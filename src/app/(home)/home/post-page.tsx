"use client";
import React, { use, useState } from "react";
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
import { api } from "../../../../convex/_generated/api";
import { Skeleton } from "@/components/ui/skeleton";
import { Id } from "../../../../convex/_generated/dataModel";
import CommentInput from "./_components/commentInput";
import { Heart, MessageCircle, Share2, Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger
} from "@/components/ui/dialog";
import Link from "next/link";

import { Textarea } from "@/components/ui/textarea";

import { ImageIcon, VideoIcon, SmileIcon, SendIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { getLike } from "../../../../convex/posts";

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
  const [isOpen, setIsOpen] = useState(false);
  const [postText, setPostText] = useState("");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);
  const [selectedGif, setSelectedGif] = useState<string | null>(null);

  const createPost = useMutation(api.post.create); // Backend mutation for creating posts

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedVideo(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGifUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedGif(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePost = async () => {
    try {
      await createPost({
        type: selectedImage
          ? "image"
          : selectedVideo
            ? "video"
            : selectedGif
              ? "gif"
              : "text", // Specify the post type
        content: postText ?? undefined,
        imageUrl: selectedImage ?? undefined,
        videoUrl: selectedVideo ?? undefined
      });

      toast.success("Post created successfully!");

      // Close and reset the card after posting
      setIsOpen(false);
      setPostText("");
      setSelectedImage(null);
      setSelectedVideo(null);
      setSelectedGif(null);
    } catch (error) {
      toast.error("Error creating post.");
    }
  };
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
  const likePost = useMutation(api.post.like);

  const handleLike = async (postId: Id<"posts">) => {
    try {
      await likePost({ postId });
    } catch (error) {
      console.error("Failed to like post:", error);
    }
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
    <div className="justify-between items-center mx-auto max-w-sm sm:max-w-md md:max-w-xl lg:max-w-2xl space-y-6">
      <div>
        <Card className="w-full max-w-full sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl py-4 p-6 rounded-lg shadow-md">
          <CardHeader>
            <h2 className="text-xl font-semibold text-center dark:text-white text-neutral-900">
              Create a new post
            </h2>
          </CardHeader>
          <div className="space-y-4">
            <Textarea
              placeholder="What's on your mind?"
              value={postText}
              onChange={(e) => setPostText(e.target.value)}
              className="resize-none"
            />
            <div className="flex justify-between items-center space-x-2">
              <label className="cursor-pointer">
                <ImageIcon className="h-6 w-6 dark:text-neutral-200 text-neutral-900" />
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>
              <label className="cursor-pointer">
                <VideoIcon className="h-6 w-6 dark:text-neutral-200 text-neutral-900" />
                <Input
                  type="file"
                  accept="video/*"
                  onChange={handleVideoUpload}
                  className="hidden"
                />
              </label>
              <label className="cursor-pointer">
                <SmileIcon className="h-6 w-6 dark:text-neutral-200 text-neutral-900" />
                <Input
                  type="file"
                  accept="gif/*"
                  onChange={handleGifUpload}
                  className="hidden"
                />
              </label>
            </div>
            <div className="space-y-2">
              {selectedImage && (
                <Image
                  src={selectedImage}
                  alt="Selected"
                  className="max-w-full h-auto rounded-md"
                  width={500}
                />
              )}
              {selectedVideo && (
                <video
                  src={selectedVideo}
                  controls
                  className="max-w-full h-auto rounded-md"
                />
              )}
              {selectedGif && (
                <Image
                  src={selectedGif}
                  alt="Selected GIF"
                  className="max-w-full h-auto rounded-md"
                  width={500}
                />
              )}
            </div>
          </div>
          <CardFooter className="pt-4 flex items-center justify-end">
            <Button onClick={handlePost} size={"icon"} variant={"ghost"}>
              <Image
                src="/assets/send-post.png"
                alt="Post"
                width="md"
                height="md"
              />
            </Button>
          </CardFooter>
        </Card>
      </div>
      {posts.map((post: any) => (
        <Card
          key={post.post._id}
          className="overflow-hidden max-w-full sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl p-4 items-center justify-between shadow-lg rounded-lg"
        >
          <CardHeader className="p-4 flex items-center space-x-4 flex-row">
            <Avatar className="w-10 h-10">
              <AvatarImage src={post.authorImage} alt={post.authorName} />
              <AvatarFallback>{post.authorName?.[0]}</AvatarFallback>
            </Avatar>
            <div className="flex-grow">
              <p className="font-semibold truncate">{post.authorName}</p>
              <p className="text-xs">
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
          {/* Image Display */}
          {post.post.imageUrl && (
            <Image
              src={post.post.imageUrl}
              alt="Post content"
              className="w-full h-auto max-h-60 sm:max-h-80 object-cover rounded-lg"
            />
          )}
          {/* Video Display */}
          {post.post.videoUrl && (
            <video
              src={post.post.videoUrl}
              controls
              className="w-full h-auto max-h-60 sm:max-h-80 object-cover rounded-lg"
            />
          )}

          {/* GIF Display */}
          {post.post.gifUrl && (
            <Image
              src={post.post.gifUrl}
              alt="Post GIF"
              className="w-full h-auto max-h-60 sm:max-h-80 object-cover rounded-lg"
            />
          )}

          <CardContent className="p-4 space-y-4 text-lg">
            <ExpandableText content={post.post.content || ""} />
          </CardContent>
          <CardFooter className="p-4 flex justify-between items-center">
            <Button
              onClick={() => handleLike(post.post._id)}
              variant="ghost"
              size="sm"
              className="text-gray-400 hover:text-red-500"
            >
              <Heart className="h-5 w-5" />
              <span className="ml-2">{post.post.likesCount || 0}</span>{" "}
              {/* Show likes count */}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => toggleComments(post.post._id)}
              className="text-gray-400 hover:text-blue-500"
            >
              <MessageCircle className="h-5 w-5 mr-1" />
            </Button>

            {/* Dialog for sharing post */}
            <Dialog>
              <DialogTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-gray-400 hover:text-green-500"
                >
                  <Share2 className="h-5 w-5 mr-1" />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>Share Post</DialogHeader>
                <div className="flex space-x-4 justify-center">
                  {/* Twitter Share Button */}
                  <Button size={"icon"} variant={"ghost"} className="bg-white">
                    <Link
                      href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(
                        window.location.href
                      )}`}
                      target="_blank"
                    >
                      <Image
                        src="/assets/twitter.png"
                        alt="twitter"
                        width={"auto"}
                        height={"auto"}
                      />
                    </Link>
                  </Button>
                  {/* Facebook Share Button */}
                  <Button size={"icon"} variant={"ghost"}>
                    <Link
                      href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
                        window.location.href
                      )}`}
                      target="_blank"
                    >
                      <Image
                        src="/assets/facebook.png"
                        alt="facebook"
                        width={"auto"}
                        height={"auto"}
                      />
                    </Link>
                  </Button>
                  {/* WhatsApp Share Button */}
                  <Button size={"icon"} variant={"ghost"}>
                    <Link
                      href={`https://api.whatsapp.com/send?text=${encodeURIComponent(
                        window.location.href
                      )}`}
                      target="_blank"
                    >
                      <Image
                        src="/assets/whatsapp.png"
                        alt="whatsapp"
                        width={"auto"}
                        height={"auto"}
                      />
                    </Link>
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
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
