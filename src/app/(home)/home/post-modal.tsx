import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import { ImageIcon, VideoIcon, SmileIcon, SendIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Image } from "@nextui-org/image";

export default function PostModal() {
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

      // Close the modal and reset the form after posting
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
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>Create Post</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create a new post</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <Textarea
            placeholder="What's on your mind?"
            value={postText}
            onChange={(e) => setPostText(e.target.value)}
            className="resize-none"
          />
          <div className="flex justify-between">
            <label className="cursor-pointer">
              <ImageIcon className="h-6 w-6" />
              <Input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </label>
            <label className="cursor-pointer">
              <VideoIcon className="h-6 w-6" />
              <Input
                type="file"
                accept="video/*"
                onChange={handleVideoUpload}
                className="hidden"
              />
            </label>
            <Button variant="ghost" size="icon" onClick={handleGifSelect}>
              <SmileIcon className="h-6 w-6" />
            </Button>
          </div>
          <div className="space-y-2">
            {selectedImage && (
              <Image
                src={selectedImage}
                alt="Selected"
                className="max-w-full h-auto"
                width={500}
              />
            )}
            {selectedVideo && (
              <video
                src={selectedVideo}
                controls
                className="max-w-full h-auto"
              />
            )}
            {selectedGif && (
              <Image
                src={selectedGif}
                alt="Selected GIF"
                className="max-w-full h-auto"
                width={500}
              />
            )}
          </div>
        </div>
        <Button onClick={handlePost} className="w-full">
          <SendIcon className="mr-2 h-4 w-4" /> Post
        </Button>
      </DialogContent>
    </Dialog>
  );
}
