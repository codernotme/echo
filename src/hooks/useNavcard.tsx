import {
  CalendarIcon,
  BackpackIcon,
  HomeIcon,
  ChatBubbleIcon,
  VideoIcon,
  AvatarIcon
} from "@radix-ui/react-icons";
import { usePathname } from "next/navigation";
import { useMemo } from "react";

export const useNavigation = () => {
  const pathname = usePathname();

  const paths = useMemo(
    () => [
      {
        name: "Home",
        href: "/home",
        icon: <HomeIcon />,
        active: pathname === "/home"
      },
      {
        name: "Friends",
        href: "/friends",
        icon: <AvatarIcon />,
        active: pathname === "/friends"
      },
      {
        name: "Project",
        href: "/projects",
        icon: <BackpackIcon />,
        active: pathname === "/projects"
      }
      /*{
        name: "Chat",
        href: "/chat/conversations",
        icon: <ChatBubbleIcon />,
        active: pathname === "/chat/conversations"
      },
      {
        name: "Event",
        href: "/events",
        icon: <CalendarIcon />,
        active: pathname === "/events"
      },
      
      {
        name: "Watch",
        href: "/watch",
        icon: <VideoIcon />,
        active: pathname === "/watch"
      }*/
    ],
    [pathname]
  );

  return paths;
};
