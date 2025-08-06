import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
         experimental: {
    authInterrupts: true,
  },
  
};

//module.exports = nextConfig;
module.exports = {
  experimental: {
    missingSuspenseWithCSRBailout: false,
    

  },
}
module.exports = nextConfig;

export default nextConfig;
