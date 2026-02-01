function Footer() {
  return (
    <footer className="bg-black text-gray-400 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Top section */}
        <div className="flex flex-col md:flex-row justify-between gap-8">
          {/* Brand */}
          <div>
            <h1 className="text-red-500 text-3xl font-semibold">Reelify</h1>
            <p className="mt-2 text-sm max-w-xs">
              Discover movies and web series. Built with React, Tailwind, and
              TMDB.
            </p>

            {/* Social Icons */}
            <div className="flex items-center gap-4 mt-4">
              {/* Facebook */}
              <a
                href="https://www.facebook.com/profile.php?id=100014727486421"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white transition"
                aria-label="Facebook"
              >
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M22.675 0h-21.35C.597 0 0 .597 0 1.326v21.348C0 23.403.597 24 1.326 24h11.495v-9.294H9.691v-3.622h3.13V8.413c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24h-1.918c-1.504 0-1.796.715-1.796 1.763v2.313h3.587l-.467 3.622h-3.12V24h6.116C23.403 24 24 23.403 24 22.674V1.326C24 .597 23.403 0 22.675 0z" />
                </svg>
              </a>

              {/* Instagram */}
              <a
                href="https://instagram.com/rohi.t6460"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white transition"
                aria-label="Instagram"
              >
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 1.366.062 2.633.343 3.608 1.318.975.975 1.256 2.242 1.318 3.608.058 1.266.07 1.646.07 4.84 0 3.204-.012 3.584-.07 4.85-.062 1.366-.343 2.633-1.318 3.608-.975.975-2.242 1.256-3.608 1.318-1.266.058-1.646.07-4.85.07-3.194 0-3.574-.012-4.84-.07-1.366-.062-2.633-.343-3.608-1.318-.975-.975-1.256-2.242-1.318-3.608C2.175 15.584 2.163 15.204 2.163 12c0-3.194.012-3.574.07-4.84.062-1.366.343-2.633 1.318-3.608.975-.975 2.242-1.256 3.608-1.318C8.426 2.175 8.806 2.163 12 2.163zM12 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zm0 10.162a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 11-2.88 0 1.44 1.44 0 012.88 0z" />
                </svg>
              </a>

              {/* GitHub */}
              <a
                href="https://github.com/I-am-rohitcode"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white transition"
                aria-label="GitHub"
              >
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 0a12 12 0 00-3.79 23.4c.6.11.82-.26.82-.58v-2.02c-3.34.73-4.04-1.61-4.04-1.61-.55-1.4-1.34-1.77-1.34-1.77-1.09-.75.08-.74.08-.74 1.2.08 1.83 1.24 1.83 1.24 1.07 1.83 2.8 1.3 3.49.99.11-.78.42-1.3.76-1.6-2.67-.3-5.47-1.34-5.47-5.95 0-1.31.47-2.38 1.24-3.22-.12-.3-.54-1.52.12-3.18 0 0 1.01-.32 3.3 1.23a11.5 11.5 0 016 0c2.28-1.55 3.29-1.23 3.29-1.23.66 1.66.24 2.88.12 3.18.77.84 1.23 1.91 1.23 3.22 0 4.62-2.8 5.64-5.48 5.94.43.37.82 1.1.82 2.22v3.29c0 .32.22.69.83.58A12 12 0 0012 0z" />
                </svg>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-gray-800 mt-8 pt-6 text-sm flex flex-col sm:flex-row justify-between items-center gap-4">
          <p>© {new Date().getFullYear()} Reelify. All rights reserved.</p>
          <p className="text-gray-500">Data provided by TMDB</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
