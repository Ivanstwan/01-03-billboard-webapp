import * as React from 'react';
import { Link } from 'react-router-dom';

import { cn } from '@/lib/utils';
// import { Icons } from '@/components/icons';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu';
import { useContext } from 'react';
import AuthContext from '@/context/AuthProvider';
import NoUserPhoto from '@/assets/no-user-photo.png';

const components = [
  {
    title: 'Alert Dialog',
    href: '/docs/primitives/alert-dialog',
    description:
      'A modal dialog that interrupts the user with important content and expects a response.',
  },
  {
    title: 'Hover Card',
    href: '/docs/primitives/hover-card',
    description:
      'For sighted users to preview content available behind a link.',
  },
  {
    title: 'Progress',
    href: '/docs/primitives/progress',
    description:
      'Displays an indicator showing the completion progress of a task, typically displayed as a progress bar.',
  },
  {
    title: 'Scroll-area',
    href: '/docs/primitives/scroll-area',
    description: 'Visually or semantically separates content.',
  },
  {
    title: 'Tabs',
    href: '/docs/primitives/tabs',
    description:
      'A set of layered sections of content—known as tab panels—that are displayed one at a time.',
  },
  {
    title: 'Tooltip',
    href: '/docs/primitives/tooltip',
    description:
      'A popup that displays information related to an element when the element receives keyboard focus or the mouse hovers over it.',
  },
];

const listingComponents = [
  {
    title: 'View Listing',
    href: '/listing',
    description: 'View listed advertisement in your area.',
  },
  {
    title: 'Add Listing',
    href: '/listing/add',
    description: 'For listing your advertisement product to the public.',
  },
  {
    title: 'My Listing',
    href: '/my-listing',
    description: 'To see what advertisement you have listed.',
  },
];

const listingPublicComponents = [
  {
    title: 'View Listing',
    href: '/listing',
    description: 'View listed advertisement in your area.',
  },
];

const listingPrivateComponents = [
  {
    title: 'My Listing',
    href: '/my-listing',
    description: 'To see what advertisement you have listed.',
  },
  {
    title: 'Add Listing',
    href: '/listing/add',
    description: 'For listing your advertisement product to the public.',
  },
];

const authBeforeLoginOption = [
  {
    title: 'Login',
    href: '/login',
    description: 'View listed advertisement in your area.',
  },
];

const authAfterLoginOption = [
  {
    title: 'Profile',
    href: '/user/profile',
    description: 'Change your username, add agent contact.',
  },
  {
    title: 'My Listing',
    href: '/my-listing',
    description: 'To see what advertisement you have listed.',
  },
];

const UserNavigation = ({ auth }) => {
  return (
    <NavigationMenu customRightSide={true}>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger className="px-2">
            <div className="flex flex-1 basis-[200px] items-center justify-end gap-2 pr-2">
              <div>
                <img
                  src={auth?.img ?? NoUserPhoto}
                  alt="No User Photo"
                  className="h-8 w-8 rounded-full"
                />
              </div>
              <div>
                <p>{auth?.username ?? auth?.email ?? 'Go Login?'}</p>
                {/* <p className="text-sm">{auth?.email ?? 'No Email'}</p> */}
              </div>
            </div>
          </NavigationMenuTrigger>
          <NavigationMenuContent className="">
            <ul className="grid gap-3 p-4 md:w-[300px]">
              {Object.keys(auth).length === 0
                ? authBeforeLoginOption.map((component) => (
                    <ListItem
                      key={component.title}
                      title={component.title}
                      href={component.href}
                    >
                      {console.log(auth, '[auth]')}
                      {component.description}
                    </ListItem>
                  ))
                : authAfterLoginOption.map((component) => (
                    <ListItem
                      key={component.title}
                      title={component.title}
                      href={component.href}
                    >
                      {console.log(auth, '[auth]')}
                      {component.description}
                    </ListItem>
                  ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
};

function NavigationMenuDemo() {
  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Getting started</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid gap-3 p-4 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
              <li className="row-span-3">
                <NavigationMenuLink asChild>
                  <a
                    className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
                    href="/"
                  >
                    {/* <Icons.logo className="h-6 w-6" /> */}
                    <div className="mb-2 mt-4 text-lg font-medium">
                      shadcn/ui
                    </div>
                    <p className="text-sm leading-tight text-muted-foreground">
                      Beautifully designed components built with Radix UI and
                      Tailwind CSS.
                    </p>
                  </a>
                </NavigationMenuLink>
              </li>
              <ListItem href="/docs" title="Introduction">
                Re-usable components built using Radix UI and Tailwind CSS.
              </ListItem>
              <ListItem href="/docs/installation" title="Installation">
                How to install dependencies and structure your app.
              </ListItem>
              <ListItem href="/docs/primitives/typography" title="Typography">
                Styles for headings, paragraphs, lists...etc
              </ListItem>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Components</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] ">
              {components.map((component) => (
                <ListItem
                  key={component.title}
                  title={component.title}
                  href={component.href}
                >
                  {component.description}
                </ListItem>
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Listing</NavigationMenuTrigger>
          <NavigationMenuContent>
            <p className="p-6 pb-0 font-semibold text-slate-500">
              Public Access
            </p>
            <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] ">
              {listingPublicComponents.map((component) => (
                <ListItem
                  key={component.title}
                  title={component.title}
                  href={component.href}
                >
                  {component.description}
                </ListItem>
              ))}
            </ul>
            <hr />
            <p className="p-6 pb-0 font-semibold text-slate-500">
              Private Access
            </p>
            <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] ">
              {listingPrivateComponents.map((component) => (
                <ListItem
                  key={component.title}
                  title={component.title}
                  href={component.href}
                >
                  {component.description}
                </ListItem>
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink asChild>
            <Link
              to="/listing"
              className="hover:bg- accent block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none
              transition-colors hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
            >
              <span className="text-sm font-medium leading-none">
                View Listing
              </span>
            </Link>
          </NavigationMenuLink>
          {/* <Link href="/docs" legacyBehavior passHref>
            <NavigationMenuLink className={navigationMenuTriggerStyle()}>
              Documentation
            </NavigationMenuLink>
          </Link> */}
          {/* <Link href="/docs" legacyBehavior passHref>
            <NavigationMenuLink className={navigationMenuTriggerStyle()}>
              Documentation
            </NavigationMenuLink>
          </Link> */}
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}

const ListItem = React.forwardRef(
  ({ className, title, children, ...props }, ref) => {
    return (
      <li>
        <NavigationMenuLink asChild>
          <a
            ref={ref}
            className={cn(
              'block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground',
              className
            )}
            {...props}
          >
            <div className="text-sm font-medium leading-none">{title}</div>
            <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
              {children}
            </p>
          </a>
        </NavigationMenuLink>
      </li>
    );
  }
);
ListItem.displayName = 'ListItem';

// Layout, With Sidebar
export const MainLayout = ({ children }) => {
  const { auth, setAuth, initAuth } = useContext(AuthContext);
  return (
    <div className="flex h-screen bg-gray-200">
      {/* can use sidebar below */}
      {/* <MobileSidebar /> */}
      {/* <Sidebar /> */}
      <div className="flex min-h-full w-0 flex-1 flex-col">
        <div className="bg-opacity-15 fixed top-0 z-[1001] flex h-16 w-full flex-shrink-0 justify-between bg-white py-6 shadow-md">
          <button className="border-r border-gray-200 px-4 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500 md:hidden">
            {/* <MenuIcon className="h-6 w-6" aria-hidden="true" /> */}
            Possible Hamburger OR open menu
          </button>
          <div className="flex px-4">
            <div className="ml-4 flex items-center md:ml-6">
              <NavigationMenuDemo />
            </div>
          </div>
          <div className="flex flex-1 basis-[200px] items-center justify-end gap-4 pr-10">
            <UserNavigation auth={auth} />
          </div>
        </div>
        <section className="flex flex-1 flex-col">
          {/* <main className="relative mt-16 grid grow grid-cols-[minmax(269px,1fr)_minmax(500px,4fr)] grid-rows-1 gap-8"> */}
          <main className="relative mt-16 grid grow grid-rows-1 gap-8 md:grid-cols-[minmax(269px,1fr)_minmax(500px,4fr)]">
            <nav className="fixed left-0 top-[4rem] hidden h-full w-60 bg-white shadow-md md:block">
              Possible Sidebar
            </nav>
            <section className="col-start-2 pr-8 pt-8">
              <article className="relative flex-1 overflow-y-auto rounded-[2px] bg-white shadow-md">
                {children}
              </article>
            </section>
          </main>
        </section>
      </div>
    </div>
  );
};

// Full Screen (height max screen), No Scrollable
export const FullLayoutFixed = ({ children }) => {
  const { auth, setAuth, initAuth } = useContext(AuthContext);
  return (
    <div className="flex h-screen flex-col-reverse bg-gray-200">
      {/* can use sidebar below */}
      {/* <MobileSidebar /> */}
      {/* <Sidebar /> */}
      <div className="bg-opacity-15 fixed top-0 z-[1001] flex h-16 w-full flex-shrink-0 bg-white py-6 shadow-md">
        <button className="border-r border-gray-200 px-4 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500 md:hidden">
          {/* <MenuIcon className="h-6 w-6" aria-hidden="true" /> */}
          Possible Hamburger OR open menu
        </button>
        <div className="flex flex-1 px-4">
          <div className="ml-4 flex items-center md:ml-6">
            <NavigationMenuDemo />
          </div>
        </div>
        <div className="flex flex-1 basis-[200px] items-center justify-end gap-4 pr-10">
          <UserNavigation auth={auth} />
        </div>
      </div>
      {/* <main className="relative mt-16 grid grow grid-cols-[minmax(269px,1fr)_minmax(500px,4fr)] grid-rows-1 gap-8"> */}
      <main style={{ height: 'calc(100% - 4rem)' }}>
        <article className="h-full rounded-[2px] bg-white shadow-md">
          {children}
        </article>
      </main>
    </div>
  );
};

// Full Screen (height auto), Scrollable
export const FullLayoutScrollable = ({ children }) => {
  const { auth, setAuth, initAuth } = useContext(AuthContext);
  return (
    <div className="flex h-screen flex-col-reverse bg-gray-200">
      {/* can use sidebar below */}
      {/* <MobileSidebar /> */}
      {/* <Sidebar /> */}
      <div className="bg-opacity-15 fixed top-0 z-[1001] flex h-16 w-full flex-shrink-0 bg-white py-6 shadow-md">
        <button className="border-r border-gray-200 px-4 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500 md:hidden">
          {/* <MenuIcon className="h-6 w-6" aria-hidden="true" /> */}
          Possible Hamburger OR open menu
        </button>
        <div className="flex flex-1 px-4">
          <div className="ml-4 flex items-center md:ml-6">
            <NavigationMenuDemo />
          </div>
        </div>
        <div className="flex flex-1 basis-[200px] items-center justify-end gap-4 pr-10">
          <UserNavigation auth={auth} />
        </div>
      </div>
      {/* <main className="relative mt-16 grid grow grid-cols-[minmax(269px,1fr)_minmax(500px,4fr)] grid-rows-1 gap-8"> */}
      <main style={{ height: 'calc(100% - 4rem)' }}>
        <article className="h-auto min-h-full rounded-[2px] bg-white shadow-md">
          {children}
        </article>
      </main>
    </div>
  );
};
