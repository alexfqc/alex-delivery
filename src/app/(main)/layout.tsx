import Header from "@/app/_components/header/page";
import Chat from "@/app/_components/chat/page";

const Layout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <>
      <Header />
      {children}
      <Chat />
    </>
  );
};

export default Layout;
