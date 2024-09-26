import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardHeader, CardFooter } from "@/components/ui/card"; // Card component
import { ImageIcon, VideoIcon, SmileIcon, SendIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Image } from "@nextui-org/image";

export default function PostCard() {
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

  const handleGifSelect = () => {
    // Simulating GIF selection with a placeholder
    setSelectedGif("/placeholder.svg?height=200&width=200");
  };

  const handlePost = async () => {
    try {
      await createPost({
        type: selectedImage ? "image" : selectedVideo ? "video" : "text", // Specify the post type
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

  return (
    <div className="flex justify-center items-center px-4 mx-auto">
      <Card className="w-full max-w-full sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl mx-auto py-4 p-6 rounded-lg shadow-md">
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
            <Button variant="ghost" size="icon" onClick={handleGifSelect}>
              <SmileIcon className="h-6 w-6 dark:text-neutral-200 text-neutral-900" />
            </Button>
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
        <CardFooter className="pt-4 flex items-center">
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
  );
}
