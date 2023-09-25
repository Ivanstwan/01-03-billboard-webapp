initial command

1. npm create vite@latest client -> 'React' framework -> 'JavaScript' variant
2. npm install -D tailwindcss postcss autoprefixer
3. npx tailwindcss init -p
4. npm i -D prettier eslint-config-prettier eslint-plugin-prettier
   eslint-config-prettier - disabled rule that conflict with prettier
   eslint-plugin-prettier - all prettier rule work in joncunction with eslint rule
5. npm install -D prettier-plugin-tailwindcss (for sorting tailwind class)
6. npx shadcn-ui@latest init
   typescript? no
   style? new york
   color? slate
   global css? src/index.css
   css variable? yes
   tailwind.config? tailwind.config.js
   components? @/components
   utils? @/utils
   react server component? no

   if error when installing shadcn, please add 'jsconfig.json' file
