import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen p-8 vintage-texture flex items-center justify-center">
      <div className="max-w-4xl mx-auto">
        <div className="bg-vintage-light border-4 border-vintage-border rounded-lg p-12 vintage-shadow">
          <h1 className="text-6xl font-vintage text-vintage-sepia text-center mb-6 text-shadow-vintage">
            Family Tree
          </h1>
          <p className="text-center text-vintage-dark text-xl mb-8">
            Preserve your legacy with elegance and tradition
          </p>
          <p className="text-center text-vintage-dark mb-8">
            Create, manage, and visualize your family history with our beautiful vintage-styled application.
            Connect generations, preserve stories, and build your family legacy.
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              href="/sign-up"
              className="px-8 py-3 bg-vintage-sepia text-vintage-paper rounded-lg
                       hover:bg-vintage-dark transition-colors border-2 border-vintage-dark vintage-shadow
                       font-medium"
            >
              Get Started
            </Link>
            <Link
              href="/sign-in"
              className="px-8 py-3 bg-vintage-border text-vintage-paper rounded-lg
                       hover:bg-vintage-dark transition-colors border-2 border-vintage-dark
                       font-medium"
            >
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
