import { Card } from "@/components/ui/card";
import { SignIn, UserButton } from "@clerk/clerk-react";
import { Unauthenticated, Authenticated } from "convex/react";
import { StrictMode } from "react";

export default function AuthCard() {
  return (
    <StrictMode>
      <Card>
        <Unauthenticated>
          <SignIn />
        </Unauthenticated>
        <Authenticated>
          <UserButton />
        </Authenticated>
      </Card>
    </StrictMode>
  );
}
