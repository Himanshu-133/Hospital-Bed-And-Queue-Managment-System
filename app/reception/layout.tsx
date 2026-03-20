import { Navbar } from '@/components/navbar';

export default function ReceptionLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-background">
        {children}
      </div>
    </>
  );
}
