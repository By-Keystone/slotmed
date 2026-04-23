/// <reference path="./.sst/platform/config.d.ts" />

export default $config({
  app(input) {
    return {
      name: "Wizydoc",
      removal: input?.stage === "production" ? "retain" : "remove",
      protect: ["production"].includes(input?.stage),
      home: "aws",
    };
  },
  async run() {
    new sst.aws.Nextjs("Wizydoc", {
      domain: {
        name: process.env.DOMAIN_NAME || "",
        dns: sst.aws.dns({
          zone: process.env.HOSTED_ZONE_ID,
        }),
      },
      environment: {
        NEXT_PUBLIC_SUPABASE_PROJECT_URL:
          process.env.NEXT_PUBLIC_SUPABASE_PROJECT_URL!,
        SITE_URL: process.env.SITE_URL!,
        NEXT_PUBLIC_SUPABASE_ANON_KEY:
          process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        SUPABASE_SECRET_KEY: process.env.SUPABASE_SECRET_KEY!,
        BETA_ENDED: process.env.BETA_ENDED!,
        API_URL: process.env.API_URL!,
        COGNITO_USER_POOL_ID: process.env.COGNITO_USER_POOL_ID!,
      },
    });
  },
});
