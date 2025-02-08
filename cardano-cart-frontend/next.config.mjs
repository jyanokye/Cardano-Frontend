/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        domains: ['localhost', 'charming-ninnetta-knust-028ea081.koyeb.app'],
      },
      webpack: function (config, options) {
        config.experiments = {
          asyncWebAssembly: true,
          layers: true,
        };
        return config;
      },
};export async function getStaticProps(context) {
  const data = await fetchData(context.params.id)
  if (!data) {
    return {
      notFound: true,
    }
  }
  return {
    props: { data },
  }
}

export default nextConfig;
