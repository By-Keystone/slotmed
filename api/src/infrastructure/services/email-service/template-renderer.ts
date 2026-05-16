import fs from "node:fs/promises";
import path from "node:path";
import Handlebars from "handlebars";
import mjml2html from "mjml";

export type EmailTemplate =
  | "confirm-email"
  | "reset-password"
  | "doctor-invitation";

interface TemplateVariables {
  "confirm-email": { name: string; confirmUrl: string };
  "reset-password": { name: string; resetUrl: string };
  "doctor-invitation": { name: string; clinicName: string; inviteUrl: string };
}

const compiledCache = new Map<EmailTemplate, HandlebarsTemplateDelegate>();

async function loadTemplate(
  name: EmailTemplate,
): Promise<HandlebarsTemplateDelegate> {
  const cached = compiledCache.get(name);
  if (cached) return cached;

  const filePath = path.join(__dirname, "templates", `${name}.mjml`);
  const source = await fs.readFile(filePath, "utf-8");
  const compiled = Handlebars.compile(source);
  compiledCache.set(name, compiled);
  return compiled;
}

export async function renderTemplate<T extends EmailTemplate>(
  name: T,
  variables: TemplateVariables[T],
): Promise<string> {
  const template = await loadTemplate(name);
  const mjmlSource = template(variables);
  const { html, errors } = await mjml2html(mjmlSource, {
    validationLevel: "strict",
  });

  if (errors.length > 0) {
    throw new Error(
      `MJML compilation errors in ${name}: ${errors.map((e) => e.message).join(", ")}`,
    );
  }

  return html;
}
