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
        name: "Watch",
        href: "/watch",
        icon: <VideoIcon />,
        active: pathname === "/watch"
      }
    ],
    [pathname]
  );

  return paths;
};
