export default function Loading() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm border-b border-border/30">
        <div className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-16 py-4">
          <div className="flex items-center justify-between">
            <div className="text-lg font-medium">Timothy Chen</div>
            <div className="text-sm text-muted-foreground">Loading...</div>
          </div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-6 sm:px-8 lg:px-16 pt-24 pb-16">
        <div className="space-y-8 mb-16">
          {/* Loading skeleton */}
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-4 bg-muted/30 rounded animate-pulse"></div>
              <div className="w-1 h-1 bg-muted/30 rounded-full"></div>
              <div className="w-16 h-6 bg-muted/30 rounded animate-pulse"></div>
            </div>
            <div className="w-3/4 h-12 bg-muted/30 rounded animate-pulse"></div>
            <div className="w-full h-6 bg-muted/30 rounded animate-pulse"></div>
            <div className="w-2/3 h-6 bg-muted/30 rounded animate-pulse"></div>
          </div>

          <div className="flex gap-2">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="w-16 h-8 bg-muted/30 rounded animate-pulse"
              ></div>
            ))}
          </div>

          <div className="flex gap-4">
            <div className="w-24 h-10 bg-muted/30 rounded animate-pulse"></div>
            <div className="w-24 h-10 bg-muted/30 rounded animate-pulse"></div>
          </div>
        </div>

        <div className="w-full h-80 bg-muted/30 rounded-2xl animate-pulse mb-16"></div>

        <div className="grid lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-8">
            <div className="space-y-4">
              <div className="w-32 h-6 bg-muted/30 rounded animate-pulse"></div>
              <div className="space-y-2">
                {[...Array(5)].map((_, i) => (
                  <div
                    key={i}
                    className="w-full h-4 bg-muted/30 rounded animate-pulse"
                  ></div>
                ))}
              </div>
            </div>
          </div>
          <div className="space-y-6">
            <div className="w-full h-40 bg-muted/30 rounded-2xl animate-pulse"></div>
            <div className="w-full h-32 bg-muted/30 rounded-2xl animate-pulse"></div>
          </div>
        </div>
      </main>
    </div>
  );
}
