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
import { toast } from "sonner";

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

  const createPost = useMutation(api.post.create); // Backend mutation for creating posts
  const [fileUploaded, setFileUploaded] = useState(false); // State to track if a file has been uploaded

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const fileType = file.type;

        if (fileType.startsWith("image/")) {
          if (fileType === "image/gif") {
            setSelectedGif(reader.result as string); // Set the GIF
          } else {
            setSelectedImage(reader.result as string); // Set the image
          }
        } else if (fileType.startsWith("video/")) {
          setSelectedVideo(reader.result as string); // Set the video
        }

        // Set the state to true, meaning a file has been uploaded
        setFileUploaded(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePost = async () => {
    // Check if post text is provided or if there's at least one media type selected
    const isPostValid =
      postText?.trim() !== "" || selectedImage || selectedVideo || selectedGif;

    if (!isPostValid) {
      toast.error(
        "Please add text or select an image, video, or GIF to create a post."
      );
      return; // Exit the function if no valid post content is found
    }

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
        videoUrl: selectedVideo ?? undefined,
        gifUrl: selectedGif ?? undefined // Added gifUrl for GIF uploads
      });

      toast.success("Post created successfully!");
      // Clear selections after posting
      setSelectedImage("");
      setSelectedVideo("");
      setSelectedGif("");
      setPostText(""); // Clear post text if necessary
    } catch (error) {
      toast.error("Failed to create post. Please try again.");
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
            <div className="flex justify-between items-center flex-col">
              {!fileUploaded && ( // Conditionally render the upload section
                <label
                  htmlFor="file-upload"
                  className="custum-file-upload cursor-pointer"
                >
                  <div className="icon">
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
                  <div className="text">
                    <span>Click to upload</span>
                  </div>
                  <input
                    id="file-upload"
                    type="file"
                    accept="image/*, video/*, image/gif" // Allows images, videos, and GIFs
                    onChange={handleFileUpload} // Single handler for all uploads
                    className="hidden"
                  />
                </label>
              )}

              {fileUploaded && (
                /* From Uiverse.io by seyed-mohsen-mousavi */
                <div className="flex flex-col gap-2 w-60 sm:w-72 text-[10px] sm:text-xs z-50">
                  <div className="succsess-alert cursor-default flex items-center justify-between w-full h-12 sm:h-14 rounded-lg bg-[#232531] px-[10px]">
                    <div className="flex gap-2">
                      <div className="text-[#2b9875] bg-white/5 backdrop-blur-xl p-1 rounded-lg">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke-width="1.5"
                          stroke="currentColor"
                          className="w-6 h-6"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            d="m4.5 12.75 6 6 9-13.5"
                          ></path>
                        </svg>
                      </div>
                      <div className="text-white align-middle justify-between">
                        <p className="text-white">File uploaded successfully</p>
                        <span
                          className="text-red-500 cursor-pointer"
                          onClick={() => setFileUploaded(false)}
                        >
                          {" "}
                          want to change file?
                        </span>
                      </div>
                    </div>
                    <Button className="text-gray-600 hover:bg-white/5 p-1 rounded-md transition-colors ease-linear">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke-width="1.5"
                        stroke="currentColor"
                        className="w-6 h-6"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          d="M6 18 18 6M6 6l12 12"
                        ></path>
                      </svg>
                    </Button>
                  </div>
                </div>
              )}
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
            <Button
              onClick={handlePost}
              size="icon"
              variant="ghost"
              className="button justify-between"
            >
              <div className="outline"></div>
              <div className="state state--default">
                <div className="icon">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    height="1em"
                    width="1em"
                  >
                    <g style={{ filter: "url(#shadow)" }}>
                      <path
                        fill="currentColor"
                        d="M14.2199 21.63C13.0399 21.63 11.3699 20.8 10.0499 16.83L9.32988 14.67L7.16988 13.95C3.20988 12.63 2.37988 10.96 2.37988 9.78001C2.37988 8.61001 3.20988 6.93001 7.16988 5.60001L15.6599 2.77001C17.7799 2.06001 19.5499 2.27001 20.6399 3.35001C21.7299 4.43001 21.9399 6.21001 21.2299 8.33001L18.3999 16.82C17.0699 20.8 15.3999 21.63 14.2199 21.63ZM7.63988 7.03001C4.85988 7.96001 3.86988 9.06001 3.86988 9.78001C3.86988 10.5 4.85988 11.6 7.63988 12.52L10.1599 13.36C10.3799 13.43 10.5599 13.61 10.6299 13.83L11.4699 16.35C12.3899 19.13 13.4999 20.12 14.2199 20.12C14.9399 20.12 16.0399 19.13 16.9699 16.35L19.7999 7.86001C20.3099 6.32001 20.2199 5.06001 19.5699 4.41001C18.9199 3.76001 17.6599 3.68001 16.1299 4.19001L7.63988 7.03001Z"
                      ></path>
                      <path
                        fill="currentColor"
                        d="M10.11 14.4C9.92005 14.4 9.73005 14.33 9.58005 14.18C9.29005 13.89 9.29005 13.41 9.58005 13.12L13.16 9.53C13.45 9.24 13.93 9.24 14.22 9.53C14.51 9.82 14.51 10.3 14.22 10.59L10.64 14.18C10.5 14.33 10.3 14.4 10.11 14.4Z"
                      ></path>
                    </g>
                    <defs>
                      <filter id="shadow">
                        <feDropShadow
                          floodOpacity="0.5"
                          stdDeviation="0.6"
                          dy="1"
                          dx="0"
                        ></feDropShadow>
                      </filter>
                    </defs>
                  </svg>
                </div>
                <p>
                  {Array.from("Send").map((char, index) => (
                    <span
                      key={index}
                      style={{ "--i": index } as React.CSSProperties}
                    >
                      {char}
                    </span>
                  ))}
                </p>
              </div>
              <div className="state state--sent">
                <div className="icon">
                  <svg
                    stroke="black"
                    strokeWidth="0.5px"
                    width="1em"
                    height="1em"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <g style={{ filter: "url(#shadow)" }}>
                      <path
                        d="M12 22.75C6.07 22.75 1.25 17.93 1.25 12C1.25 6.07 6.07 1.25 12 1.25C17.93 1.25 22.75 6.07 22.75 12C22.75 17.93 17.93 22.75 12 22.75ZM12 2.75C6.9 2.75 2.75 6.9 2.75 12C2.75 17.1 6.9 21.25 12 21.25C17.1 21.25 21.25 17.1 21.25 12C21.25 6.9 17.1 2.75 12 2.75Z"
                        fill="currentColor"
                      ></path>
                      <path
                        d="M10.5795 15.5801C10.3795 15.5801 10.1895 15.5001 10.0495 15.3601L7.21945 12.5301C6.92945 12.2401 6.92945 11.7601 7.21945 11.4701C7.50945 11.1801 7.98945 11.1801 8.27945 11.4701L10.5795 13.7701L15.7195 8.6301C16.0095 8.3401 16.4895 8.3401 16.7795 8.6301C17.0695 8.9201 17.0695 9.4001 16.7795 9.6901L11.1095 15.3601C10.9695 15.5001 10.7795 15.5801 10.5795 15.5801Z"
                        fill="currentColor"
                      ></path>
                    </g>
                  </svg>
                </div>
                <p>
                  <span style={{ "--i": 5 } as React.CSSProperties}>S</span>
                  <span style={{ "--i": 6 } as React.CSSProperties}>e</span>
                  <span style={{ "--i": 7 } as React.CSSProperties}>n</span>
                  <span style={{ "--i": 8 } as React.CSSProperties}>t</span>
                </p>
              </div>
            </Button>
          </CardFooter>
        </Card>
      </div>
      {posts.map((post: any) => (
        <Card
          key={post.post._id}
          className="overflow-hidden max-w-full sm:max-w-[300px] md:max-w-[400px] lg:max-w-[500px] p-4 items-center justify-between shadow-lg rounded-lg"
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
                className="group relative flex h-12 w-12 flex-col items-center justify-center overflow-hidden rounded-xl border-2 border-red-800 bg-red-400 hover:bg-red-600"
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
              <Heart className="h-8 w-8" strokeWidth={2} />
              <span className="ml-2">{post.post.likesCount || 0}</span>{" "}
              {/* Show likes count */}
            </Button>
            <div className="group relative">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => toggleComments(post.post._id)}
              >
                <svg
                  stroke-linejoin="round"
                  stroke-linecap="round"
                  stroke="currentColor"
                  stroke-width="2"
                  viewBox="0 0 24 24"
                  height="44"
                  width="44"
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-8 hover:scale-125 duration-200 hover:stroke-blue-500"
                  fill="none"
                >
                  <path fill="none" d="M0 0h24v24H0z" stroke="none"></path>
                  <path d="M8 9h8"></path>
                  <path d="M8 13h6"></path>
                  <path d="M18 4a3 3 0 0 1 3 3v8a3 3 0 0 1 -3 3h-5l-5 3v-3h-2a3 3 0 0 1 -3 -3v-8a3 3 0 0 1 3 -3h12z"></path>
                </svg>
              </Button>
              <span className="absolute -top-14 left-[50%] -translate-x-[50%] z-20 origin-left scale-0 px-3 rounded-lg border border-gray-300 bg-background py-2 text-sm font-bold shadow-md transition-all duration-300 ease-in-out group-hover:scale-100">
                Comment <span> </span>
              </span>
            </div>

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
