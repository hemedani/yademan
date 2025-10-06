export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // This is now just a simple wrapper - no HTML or BODY tags
  // The actual HTML structure is defined in [locale]/layout.tsx
  // Using system fonts to avoid network connectivity issues during builds
  return children;
}
