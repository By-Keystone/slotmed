/// <reference path="./.sst/platform/config.d.ts" />

export default $config({
  app(input) {
    return {
      name: "Slotmed",
      removal: input?.stage === "production" ? "retain" : "remove",
      protect: ["production"].includes(input?.stage),
      home: "aws",
    };
  },
  async run() {
    console.log({ SITE_URL: process.env.SITE_URL });

    const slotmedWebsite = new sst.aws.Nextjs("Slotmed", {
      environment: {
        NEXT_PUBLIC_SUPABASE_PROJECT_URL:
          process.env.NEXT_PUBLIC_SUPABASE_PROJECT_URL!,
        SITE_URL: process.env.SITE_URL!,
        NEXT_PUBLIC_SUPABASE_ANON_KEY:
          process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        DATABASE_URL: process.env.DATABASE_URL!,
        SUPABASE_SECRET_KEY: process.env.SUPABASE_SECRET_KEY!,
        SLOTMED_SMTP_KEY: process.env.SLOTMED_SMTP_KEY!,
        BETA_ENDED: process.env.BETA_ENDED!,
      },
    });
  },
});
