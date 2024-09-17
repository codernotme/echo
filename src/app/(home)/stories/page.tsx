"use client";
import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious
} from "@/components/ui/carousel";
import Image from "next/image";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Avatar } from "@nextui-org/avatar";

interface Story {
  id: number;
  imageUrl: string;
  title: string;
}

interface UserStories {
  id: number;
  userName: string;
  userAvatar: string;
  stories: Story[];
}

export default function StoriesDemo() {
  const [users, setUsers] = useState<UserStories[]>([]);
  const [selectedUser, setSelectedUser] = useState<UserStories | null>(null);
  const [currentStoryIndex, setCurrentStoryIndex] = useState<number>(0);

  useEffect(() => {
    fetch("/data/stories.json")
      .then((response) => response.json())
      .then((data) => setUsers(data));
  }, []);

  const handleAvatarClick = (user: UserStories) => {
    setSelectedUser(user);
    setCurrentStoryIndex(0);
  };

  const handleClose = () => {
    setSelectedUser(null);
    setCurrentStoryIndex(0);
  };

  const handleNextStory = () => {
    if (selectedUser && currentStoryIndex < selectedUser.stories.length - 1) {
      setCurrentStoryIndex(currentStoryIndex + 1);
    } else {
      handleClose();
    }
  };

  const handlePreviousStory = () => {
    if (selectedUser && currentStoryIndex > 0) {
      setCurrentStoryIndex(currentStoryIndex - 1);
    }
  };

  return (
    <div className="w-full h-full p-2 flex flex-col gap-2">
      <h1 className="text-3xl font-semibold">Stories</h1>

      {/* Carousel of Avatars with Names */}
      <Carousel className="w-full">
        <CarouselContent>
          {users.map((user) => (
            <CarouselItem key={user.id}>
              <div className="flex flex-col items-center p-2">
                <Avatar
                  src={user.userAvatar}
                  name={user.userName}
                  className="w-20 h-20 text-large cursor-pointer"
                  onClick={() => handleAvatarClick(user)}
                />
                <span className="mt-2 text-center text-sm">
                  {user.userName}
                </span>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>

      {/* Dialog for Viewing Stories */}
      {selectedUser && (
        <Dialog open={true} onOpenChange={handleClose}>
          <DialogTitle>{selectedUser.userName}</DialogTitle>
          <DialogContent className="w-full h-full bg-black bg-opacity-90 flex flex-col justify-center items-center absolute">
            {/* Story Image */}
            <Image
              src={selectedUser.stories[currentStoryIndex].imageUrl}
              alt={selectedUser.stories[currentStoryIndex].title}
              className="object-contain w-full h-full"
              layout="fill"
              priority
            />

            {/* Story Navigation Controls */}
            <div className="absolute  left-0 w-full flex justify-between p-4">
              <button
                onClick={handlePreviousStory}
                disabled={currentStoryIndex === 0}
                className="bg-white bg-opacity-50 p-2 rounded-full disabled:opacity-25"
              >
                &#8592;
              </button>
              <button
                onClick={handleNextStory}
                disabled={
                  selectedUser &&
                  currentStoryIndex === selectedUser.stories.length - 1
                }
                className="bg-white bg-opacity-50 p-2 rounded-full disabled:opacity-25"
              >
                &#8594;
              </button>
            </div>
          </DialogContent>
          {/* Close Button */}
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 bg-white bg-opacity-50 p-2 rounded-full"
          >
            &#10005;
          </button>
        </Dialog>
      )}
    </div>
  );
}
