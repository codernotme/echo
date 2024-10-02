export const metadata = {
  title: "ECHO"
};
export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <div className="w-full">
        {children}
        {/*<SideNavR />*/}
      </div>
    </>
  );
}
