import Navbar from "@/components/common/Navbar";
import SidebarWrapper from "@/components/common/SidebarWrapper";
import SideNav from "@/components/common/SideNav";

export const metadata = {
  title: "devhive"
};
export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <main className="w-full justify-between h-full p-4 flex flex-col gap-4">
        <Navbar />
        <SidebarWrapper>
          <SideNav />
          {children}
        </SidebarWrapper>
      </main>
    </>
  );
}
