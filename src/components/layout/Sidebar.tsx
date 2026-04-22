import { useTheme } from '../../context/ThemeContext'

function MoonIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path
        d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  )
}

function SunIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <circle cx="10" cy="10" r="4" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M10 1v2M10 17v2M1 10h2M17 10h2M3.22 3.22l1.42 1.42M15.36 15.36l1.42 1.42M3.22 16.78l1.42-1.42M15.36 4.64l1.42-1.42"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  )
}

function Logo() {
  return (
  <svg width="40" height="38" viewBox="0 0 40 38" fill="none" xmlns="http://www.w3.org/2000/svg">
<path fill-rule="evenodd" clip-rule="evenodd" d="M10.6942 0L20 18.7078L29.3058 4.74611e-08C35.6645 3.34856 40 10.0219 40 17.7078C40 28.7535 31.0457 37.7078 20 37.7078C8.9543 37.7078 0 28.7535 0 17.7078C0 10.0219 4.33546 3.34856 10.6942 0Z" fill="white"/>
</svg>
  )
}



export default function Sidebar() {
  const { isDark, toggleTheme } = useTheme()

  return (
    <>
      <aside className="
        fixed left-0 top-0 h-screen w-[103px]
        bg-[#373B53] rounded-r-[20px]
        flex-col items-center justify-between
        z-50 hidden lg:flex
      ">
        <div className="
          w-full aspect-square
          bg-[#7C5DFA] rounded-r-[20px]
          flex items-center justify-center
          relative overflow-hidden
        ">
          <div className="
            absolute bottom-0 left-0 right-0 h-1/2
            bg-[#9277FF] rounded-tl-[20px]
          " />
          <div className="relative z-10">
            <Logo />
          </div>
        </div>

        <div className="flex flex-col items-center gap-6 pb-8">
          <button
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="
              p-2 bg-transparent border-none cursor-pointer
              text-[#858BB2] hover:text-white
              transition-colors duration-200
            "
          >
            {isDark ? <SunIcon /> : <MoonIcon />}
          </button>

          <div className="w-full h-px bg-[#494E6E]" />

          <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-[#7C5DFA]">
            <img
              src="https://api.dicebear.com/7.x/avataaars/svg?seed=favour"
              alt="User avatar"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </aside>

      <header className="
        fixed top-0 left-0 right-0 h-[72px]
        bg-[#373B53]
        flex items-center justify-between
        z-50 lg:hidden
      ">
        <div className="
          w-[72px] h-[72px] shrink-0
          bg-[#7C5DFA] rounded-br-[20px]
          flex items-center justify-center
          relative overflow-hidden
        ">
          <div className="
            absolute bottom-0 left-0 right-0 h-1/2
            bg-[#9277FF] rounded-tl-[20px]
          " />
          <div className="relative z-10">
            <Logo />
          </div>
        </div>

        <div className="flex items-center gap-6 pr-6">
          <button
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="p-2 bg-transparent border-none cursor-pointer text-[#858BB2] hover:text-white transition-colors duration-200"
          >
            {isDark ? <SunIcon /> : <MoonIcon />}
          </button>

          <div className="w-px h-10 bg-[#494E6E]" />

          <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-[#7C5DFA]">
            <img
              src="https://api.dicebear.com/7.x/avataaars/svg?seed=favour"
              alt="User avatar"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </header>
    </>
  )
}