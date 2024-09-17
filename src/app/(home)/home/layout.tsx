import SideNavR from "@/components/common/SideNavR";

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
      <div className="w-full justify-evenly h-full p-4 flex flex-row gap-4">
        {children}
        {/*<SideNavR />*/}
      </div>
    </>
  );
}
