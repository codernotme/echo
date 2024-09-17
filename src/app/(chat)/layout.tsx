import Navbar from "@/components/common/Navbar";
import React from "react";

type Props = React.PropsWithChildren<{}>;

const layout = ({ children }: Props) => {
  return (
    <>
      <main className="w-full p-2 min-h-screen flex flex-col ">
        <Navbar />
        <div className="flex flex-row w-full p-2 gap-4 min-h-screen ">
          {children}
        </div>
      </main>
    </>
  );
};

export default layout;
