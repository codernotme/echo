"use client";
import React, { useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { useDropzone } from "react-dropzone";
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
import { Heart, Send, Share2, Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger
} from "@/components/ui/dialog";
import Link from "next/link";

import { Textarea } from "@nextui-org/input";
import { toast } from "sonner";
import { ChatBubbleIcon } from "@radix-ui/react-icons";
import { useTheme } from "next-themes";

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
  const [postText, setPostText] = useState("");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);
  const [selectedGif, setSelectedGif] = useState<string | null>(null);
  const createPost = useMutation(api.post.create);
  const [fileUploaded, setFileUploaded] = useState(false);
  const [isPosting, setIsPosting] = useState(false);
  const { theme } = useTheme();

  const onDrop = (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    const reader = new FileReader();

    reader.onloadend = () => {
      const fileType = file.type;

      if (fileType.startsWith("image/")) {
        if (fileType === "image/gif") {
          setSelectedGif(reader.result as string);
        } else {
          setSelectedImage(reader.result as string);
        }
      } else if (fileType.startsWith("video/")) {
        setSelectedVideo(reader.result as string);
      }

      setFileUploaded(true);
    };

    reader.readAsDataURL(file);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".jpg", ".jpeg", ".png"],
      "video/*": [".mp4", ".mov"],
      "gif/*": [".gif"]
    }
  });

  const handlePost = async () => {
    const isPostValid =
      postText?.trim() !== "" || selectedImage || selectedVideo || selectedGif;

    if (!isPostValid) {
      toast.error(
        "Please add text or select an image, video, or GIF to create a post."
      );
      return;
    }

    setIsPosting(true);

    try {
      await createPost({
        type: selectedImage
          ? "image"
          : selectedVideo
            ? "video"
            : selectedGif
              ? "gif"
              : "text",
        content: postText ?? undefined,
        imageUrl: selectedImage ?? undefined,
        videoUrl: selectedVideo ?? undefined,
        gifUrl: selectedGif ?? undefined
      });

      toast.success("Post created successfully!", {
        icon: "📝",
        style: {
          borderRadius: "10px",
          background: "#333",
          color: "#fff"
        }
      });
      setSelectedImage(null);
      setSelectedVideo(null);
      setSelectedGif(null);
      setPostText("");
      setFileUploaded(false);
    } catch (error) {
      toast.error("Failed to create post. Please try again.");
    } finally {
      setIsPosting(false);
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
    <div className="justify-between items-center mx-auto max-w-sm sm:max-w-md md:max-w-xl lg:max-w-2xl space-y-6 p-4 top-0">
      <div>
        <Card
          className={`overflow-hidden max-w-full sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl p-4 items-center justify-between shadow-lg rounded-lg border-b ${theme === "dark" ? "border-gray-800" : "border-gray-300"} `}
        >
          <CardHeader>
            <h2 className="text-2xl font-bold text-center">
              Create a New Post
            </h2>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              placeholder="What's on your mind?"
              value={postText}
              onChange={(e) => setPostText(e.target.value)}
              className="w-full min-h-[100px] bg-secondary border-gray-300 focus:border-gray-500 rounded-lg resize-none transition-colors duration-300"
            />
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-lg p-4 transition-colors ${isDragActive ? "border-blue-500" : "border-gray-300"} bg-secondary`}
            >
              <input {...getInputProps()} />
              {isDragActive ? (
                <p className="text-center">Drop the files here ...</p>
              ) : (
                <div>
                  <div className="flex items-center justify-center max-w-[100px]">
                    <svg
                      viewBox="0 0 24 24"
                      fill=""
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                      <g
                        id="SVGRepo_tracerCarrier"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      ></g>
                      <g id="SVGRepo_iconCarrier">
                        {" "}
                        <path
                          fill-rule="evenodd"
                          clip-rule="evenodd"
                          d="M10 1C9.73478 1 9.48043 1.10536 9.29289 1.29289L3.29289 7.29289C3.10536 7.48043 3 7.73478 3 8V20C3 21.6569 4.34315 23 6 23H7C7.55228 23 8 22.5523 8 22C8 21.4477 7.55228 21 7 21H6C5.44772 21 5 20.5523 5 20V9H10C10.5523 9 11 8.55228 11 8V3H18C18.5523 3 19 3.44772 19 4V9C19 9.55228 19.4477 10 20 10C20.5523 10 21 9.55228 21 9V4C21 2.34315 19.6569 1 18 1H10ZM9 7H6.41421L9 4.41421V7ZM14 15.5C14 14.1193 15.1193 13 16.5 13C17.8807 13 19 14.1193 19 15.5V16V17H20C21.1046 17 22 17.8954 22 19C22 20.1046 21.1046 21 20 21H13C11.8954 21 11 20.1046 11 19C11 17.8954 11.8954 17 13 17H14V16V15.5ZM16.5 11C14.142 11 12.2076 12.8136 12.0156 15.122C10.2825 15.5606 9 17.1305 9 19C9 21.2091 10.7909 23 13 23H20C22.2091 23 24 21.2091 24 19C24 17.1305 22.7175 15.5606 20.9844 15.122C20.7924 12.8136 18.858 11 16.5 11Z"
                          fill=""
                        ></path>{" "}
                      </g>
                    </svg>
                  </div>
                  <p className="text-center">
                    Drag & drop files here, or click to select files
                  </p>
                </div>
              )}
            </div>
            {fileUploaded && (
              <div className="border border-gray-300 p-4 rounded-lg transition-colors duration-300">
                <div className="flex items-center justify-between">
                  <span className="text-sm">File uploaded successfully</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setFileUploaded(false);
                      setSelectedImage(null);
                      setSelectedVideo(null);
                      setSelectedGif(null);
                    }}
                    className=" hover:text-red-700"
                  >
                    Remove
                  </Button>
                </div>
                {selectedImage && (
                  <Image
                    src={selectedImage}
                    alt="Selected"
                    width={500}
                    height={300}
                    className="mt-2 rounded-md object-cover"
                  />
                )}
                {selectedVideo && (
                  <video
                    src={selectedVideo}
                    controls
                    className="mt-2 max-w-full h-auto rounded-md"
                  />
                )}
                {selectedGif && (
                  <Image
                    src={selectedGif}
                    alt="Selected GIF"
                    width={500}
                    height={300}
                    className="mt-2 rounded-md object-cover"
                  />
                )}
              </div>
            )}
          </CardContent>
          <CardFooter className="flex justify-end">
            <Button
              onClick={handlePost}
              disabled={isPosting}
              className="bg-gray-800 hover:bg-gray-700 text-white px-6 py-2 rounded-full transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50"
            >
              {isPosting ? (
                <span className="flex items-center">
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Posting...
                </span>
              ) : (
                <>
                  <Send className="w-5 h-5 mr-2" />
                  Post
                </>
              )}
            </Button>
          </CardFooter>
        </Card>
      </div>
      {posts.map((post: any) => (
        <Card
          key={post.post._id}
          className={` bg-background overflow-hidden max-w-full sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl p-2 items-center justify-between shadow-lg rounded-lg ${isDragActive ? "border-blue-500" : "border-gray-300"}`}
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
                className="group relative flex lg:h-12 lg:w-12 sm:h-10 sm:w-10 flex-col items-center justify-center overflow-hidden rounded-xl border-2 border-red-800 bg-red-400 hover:bg-red-600"
              >
                <svg
                  viewBox="0 0 1.625 1.625"
                  className="absolute -top-7 fill-white delay-100 group-hover:top-6 group-hover:animate-[spin_1.4s] group-hover:duration-1000"
                  height="15"
                  width="15"
                >
                  <path d="M.471 1.024v-.52a.1.1 0 0 0-.098.098v.618c0 .054.044.098.098.098h.487a.1.1 0 0 0 .098-.099h-.39c-.107 0-.195 0-.195-.195"></path>
                  <path d="M1.219.601h-.163A.1.1 0 0 1 .959.504V.341A.033.033 0 0 0 .926.309h-.26a.1.1 0 0 0-.098.098v.618c0 .054.044.098.098.098h.487a.1.1 0 0 0 .098-.099v-.39a.033.033 0 0 0-.032-.033"></path>
                  <path d="m1.245.465-.15-.15a.02.02 0 0 0-.016-.006.023.023 0 0 0-.023.022v.108c0 .036.029.065.065.065h.107a.023.023 0 0 0 .023-.023.02.02 0 0 0-.007-.016"></path>
                </svg>
                <svg
                  width="16"
                  fill="none"
                  viewBox="0 0 39 7"
                  className="origin-right duration-500 group-hover:rotate-90"
                >
                  <line
                    stroke-width="4"
                    stroke="white"
                    y2="5"
                    x2="39"
                    y1="5"
                  ></line>
                  <line
                    stroke-width="3"
                    stroke="white"
                    y2="1.5"
                    x2="26.0357"
                    y1="1.5"
                    x1="12"
                  ></line>
                </svg>
                <svg width="16" fill="none" viewBox="0 0 33 39" className="">
                  <mask fill="white" id="path-1-inside-1_8_19">
                    <path d="M0 0H33V35C33 37.2091 31.2091 39 29 39H4C1.79086 39 0 37.2091 0 35V0Z"></path>
                  </mask>
                  <path
                    mask="url(#path-1-inside-1_8_19)"
                    fill="white"
                    d="M0 0H33H0ZM37 35C37 39.4183 33.4183 43 29 43H4C-0.418278 43 -4 39.4183 -4 35H4H29H37ZM4 43C-0.418278 43 -4 39.4183 -4 35V0H4V35V43ZM37 0V35C37 39.4183 33.4183 43 29 43V35V0H37Z"
                  ></path>
                  <path stroke-width="4" stroke="white" d="M12 6L12 29"></path>
                  <path stroke-width="4" stroke="white" d="M21 6V29"></path>
                </svg>
              </Button>
            )}
          </CardHeader>
          <div className="p-4">
            {/* Image Display */}
            {post.post.imageUrl && (
              <Image
                src={post.post.imageUrl}
                alt="Post content"
                className=" lg:max-w-[500px] items-center object-cover rounded-lg justify-center mx-auto"
              />
            )}
            {/* Video Display */}
            {post.post.videoUrl && (
              <video
                src={post.post.videoUrl}
                controls
                className=" items-center object-cover rounded-lg"
              />
            )}

            {/* GIF Display */}
            {post.post.gifUrl && (
              <Image
                src={post.post.gifUrl}
                alt="Post GIF"
                className=" items-center rounded-lg justify-center mx-auto"
              />
            )}
          </div>
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
              <Heart className="h-6 w-6" strokeWidth={2} />
              <span className="ml-2">{post.post.likesCount || 0}</span>{" "}
              {/* Show likes count */}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => toggleComments(post.post._id)}
              className="text-gray-400 hover:text-blue-500"
            >
              <ChatBubbleIcon className="h-6 w-6" />
            </Button>

            {/* Dialog for sharing post */}
            <Dialog>
              <DialogTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-gray-400 hover:text-green-500"
                >
                  <Share2 className="h-6 w-6 mr-1" />
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
