export const MainLayout = ({ children }) => {
  return (
    <div className="flex h-screen">
      {/* can use sidebar below */}
      {/* <MobileSidebar /> */}
      {/* <Sidebar /> */}
      <div className="flex min-h-full w-0 flex-1 flex-col">
        <div className="bg-opacity-15 fixed top-0 z-10 flex h-16 w-full flex-shrink-0 bg-white p-6 shadow-md">
          <button className="border-r border-gray-200 px-4 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500 md:hidden">
            {/* <MenuIcon className="h-6 w-6" aria-hidden="true" /> */}
            Possible Hamburger OR open menu
          </button>
          <div className="flex flex-1 justify-end px-4">
            <div className="ml-4 flex items-center md:ml-6">
              {/* <UserNav /> */}
              Possible User Navigation, can add logo user / redirect signin /
              logout
            </div>
          </div>
        </div>
        <section className="flex flex-1 flex-col">
          <main className="mt-16 grid grow grid-cols-[minmax(269px,1fr)_minmax(500px,4fr)] grid-rows-1 gap-8">
            <nav className="w-60 bg-white shadow-md">Possible Sidebar</nav>
            <section className="pr-8 pt-8">
              <article className="relative flex-1 overflow-y-auto rounded-[2px] bg-white p-10 shadow-md">
                {children}
              </article>
            </section>
          </main>
        </section>
      </div>
    </div>
  );
};
