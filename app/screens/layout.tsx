import AuthGuard from '@/app/components/AuthGuard';

export default function ScreensLayout({ children }: { children: React.ReactNode }) {
  return <AuthGuard>{children}</AuthGuard>;
}
