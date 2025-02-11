// Next.js has a bug which it doesn't allow to use not-found.<pageExtensions> as a file name
// Instead, we have to use not-found.ts or not-found.tsx for a workaround
// "ts" does not wright tsx syntax, but we can export component from actual not-found component tsx file
// https://github.com/vercel/next.js/issues/65447
// Note: We need to remove `not-found.<pageExtensions>` file.
