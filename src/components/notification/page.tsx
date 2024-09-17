import { BellIcon, Loader2 } from "lucide-react";
import React, { useEffect, useMemo, useState } from "react";
import { Button } from "../ui/button";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger
} from "../ui/hover-card";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import Request from "./Request";
import { Badge } from "../ui/badge";

function Notification() {
  const requests = useQuery(api.requests.get) || "";
  const requestsCount = useQuery(api.requests.count);

  const paths = useMemo(
    () => [
      {
        name: "Notifications",
        href: "/notification",
        icon: <BellIcon />,
        count: requestsCount && requestsCount > 0 ? requestsCount : null
      }
    ],
    [requestsCount]
  );

  const path = paths[0];

  return (
    <main className="flex flex-col gap-4">
      <HoverCard>
        <HoverCardTrigger>
          <Button variant="outline" className="relative">
            <BellIcon />
            {path.count && (
              <Badge className="absolute top-0 right-0 px-2">
                {path.count}
              </Badge>
            )}
          </Button>
        </HoverCardTrigger>
        <HoverCardContent className="w-full sm:max-w-sm md:max-w-md lg:max-w-lg max-h-72 overflow-auto p-4 bg-background shadow-lg rounded-md">
          {requests ? (
            requests.length > 0 ? (
              requests.map((request) => (
                <Request
                  key={request.request._id}
                  id={request.request._id}
                  imageUrl={request.sender.imageUrl}
                  username={request.sender.username}
                  email={request.sender.email}
                />
              ))
            ) : (
              <p className="w-full h-full flex items-center justify-center text-gray-500">
                No requests found
              </p>
            )
          ) : null}
        </HoverCardContent>
      </HoverCard>
    </main>
  );
}

export default Notification;
