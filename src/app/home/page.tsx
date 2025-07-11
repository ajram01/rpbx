import Image from "next/image";

export default function Home() {
  return (
    <div className="grid grid-rows-[auto_1fr_auto] min-h-screen">
      {/* 
        HEADER SECTION
        - This is row 1 of the grid
        - Use "auto" height so it only takes space it needs
        - Put navigation, logo, or page title here
      */}
      <header className="bg-blue-600 text-white p-4">
        <Image
            src="/photos/logos/rio-plex-logo-main-mint-white.png"
            alt="RPBX Logo"
            width={200}
            height={100}
            priority
        />
        {/* Add navigation menu, logo, or other header content here */}
      </header>

      {/* 
        MAIN BODY SECTION
        - This is row 2 of the grid
        - Uses "1fr" to take up all remaining space
        - This is where your main page content goes
      */}
      <main className="bg-gray-50 p-8">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-semibold mb-6">Welcome to my page</h2>
          
          {/* Your main content goes here */}
          <p className="text-lg mb-4">
            This is where you'd put your main page content like:
          </p>
          
          <ul className="list-disc list-inside space-y-2 mb-6">
            <li>Articles or blog posts</li>
            <li>Product listings</li>
            <li>Forms</li>
            <li>Images and galleries</li>
            <li>Any other content</li>
          </ul>

          {/* Example of adding a button */}
          <button className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition-colors">
            Click me
          </button>
        </div>
      </main>

      {/* 
        FOOTER SECTION
        - This is row 3 of the grid
        - Uses "auto" height so it only takes space it needs
        - Put copyright, links, contact info here
      */}
      <footer className="bg-gray-800 text-white p-6">
        <div className="max-w-4xl mx-auto text-center">
          <p>&copy; 2025 My Website. All rights reserved.</p>
          
          {/* Footer links */}
          <div className="mt-4 space-x-6">
            <a href="/about" className="hover:text-blue-400 transition-colors">
              About
            </a>
            <a href="/contact" className="hover:text-blue-400 transition-colors">
              Contact
            </a>
            <a href="/privacy" className="hover:text-blue-400 transition-colors">
              Privacy
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}

/* 
  KEY CONCEPTS TO REMEMBER:

  1. TYPESCRIPT:
     - File extension is .tsx (not .ts) because we're using JSX
     - You can add type definitions for props, state, etc.
     - Example: function Home(): JSX.Element
     
  2. TAILWIND CLASSES EXPLAINED:
     - grid: Makes the div a CSS Grid container
     - grid-rows-[auto_1fr_auto]: Creates 3 rows - header (auto height), main (flexible), footer (auto height)
     - min-h-screen: Minimum height is 100% of viewport
     - max-w-4xl mx-auto: Max width with center alignment
     - p-4, p-8: Padding (4 = 1rem, 8 = 2rem)
     - bg-blue-600: Background color
     - text-white: White text color
     - hover:bg-blue-700: Color change on hover

  3. NEXT.JS SPECIFICS:
     - Always export default your page component
     - Use <Image> from "next/image" instead of <img> for optimization
     - Links should use <Link> from "next/link" for client-side navigation

  4. TO CUSTOMIZE:
     - Replace the content in each section with your own
     - Change colors by modifying the bg-* and text-* classes
     - Add your own components and logic
     - Import other components you create
*/