// friendbox.tsx
import React from "react";
import { Card } from "@/components/ui/card";
import { Avatar } from "@nextui-org/avatar";

type Props = {
  friend: {
    _id: string;
    imageUrl: string;
    username: string;
    email: string;
  };
};

const FriendCard = ({ friend }: Props) => {
  return (
    <Card className="p-4 max-w-md flex flex-row items-center gap-4 border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow">
      <Avatar
        isBordered
        src={friend.imageUrl}
        alt={`${friend.username}'s avatar`}
        className="w-12 h-12 rounded-full"
      />
      <div className="flex flex-col truncate">
        <h4 className="text-lg font-semibold truncate">{friend.username}</h4>
        <p className="text-sm text-gray-500 truncate">{friend.email}</p>
      </div>
    </Card>
  );
};

export default FriendCard;
