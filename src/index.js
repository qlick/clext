#!/usr/bin/env node

import chalk from "chalk";
import {exec} from "child_process";
import inquirer from "inquirer";
import TemplateManager from "./templateManager.js";

await main();

async function main() {
  console.log(`
  Welcome to ${chalk.bgMagenta("clext")}!
  A CLI tool to add features to your Next.js project.

  ${chalk.bgRed("WARNING: clext requires git to be installed!")}

  To add new values, make a feature request on github!
  https://github.com/qlick/clext/issues/new/
  `);
  await sleep(2000);

  const srcFolder = await inquirer.prompt({
    name: "value",
    type: "confirm",
    message: "(1/10) Do you use the src directory?",
    default() {
      return true;
    },
  });

  const appRouter = await inquirer.prompt({
    name: "value",
    type: "confirm",
    message: "(2/10) Do you use Next.js v13 App Router?",
    default() {
      return true;
    },
  });

  const packageManager = await inquirer.prompt({
    name: "value",
    type: "list",
    message: "(3/10) What package manager are you using?",
    choices: ["npm", "yarn", "pnpm"],
  });

  const features = await inquirer.prompt({
    name: "value",
    type: "checkbox",
    message: "(4/10) What features would you like to add?",
    choices: [
      {
        name: "ShadCN-UI (Installs Tailwind CSS)",
        value: "shadcn",
      },
      {
        name: "tRPC",
        value: "trpc",
      },
    ],
  });

  const orm = await inquirer.prompt({
    name: "value",
    type: "list",
    message: "(5/10) What ORM would you like to use?",
    choices: ["None", "Prisma ORM", "Drizzle ORM", "Firestore (Installs Firebase)"],
  });

  if (orm.value != "None" && orm.value != "Firestore (Installs Firebase)") {
    const database = await inquirer.prompt({
      name: "value",
      type: "list",
      message: "(5.1/10) What Database do you use?",
      choices: ["PostgreSQL", "MySQL", "SQLite"],
    });
  }

  const validator = await inquirer.prompt({
    name: "value",
    type: "list",
    message: "(6/10) What Validator would you like to use?",
    choices: ["None", "Valibot", "Zod", "Superstruct", "Yup"],
  });

  const cssFramework = await inquirer.prompt({
    name: "value",
    type: "list",
    message: "(7/10) What CSS Framework would you like to use?",
    choices: features.value.includes("shadcn") ? ["TailwindCSS"] : ["None", "TailwindCSS", "UnoCSS"],
    default() {
      if (features.value.includes("shadcn")) return "TailwindCSS";
    },
  });

  if (cssFramework.value === "UnoCSS") {
    const unoCss = await inquirer.prompt({
      name: "value",
      type: "confirm",
      message: "(7.1/10) Would you like to use the Tailwind CSS preset from UnoCSS?",
      default() {
        return true;
      },
    });
  }

  const cssPreprocessor = await inquirer.prompt({
    name: "value",
    type: "list",
    message: "(8/10) What CSS Preprocessor would you like to use?",
    choices: ["None", "SCSS", "SASS", "LESS", "Stylus"],
  });

  const auth = await inquirer.prompt({
    name: "value",
    type: "list",
    message: "(9/10) What Auth Provider would you like to use?",
    choices: orm.value === "Firestore (Installs Firebase)" ? ["Firebase"] : ["None", "Firebase", "Supabase", "Auth0"],
  });

  const installDependencies = await inquirer.prompt({
    name: "value",
    type: "confirm",
    message: "(10/10) Would you like to install dependencies?",
    default() {
      return true;
    },
  });

  console.info(`
  You chose:
  - Source Folder: ${srcFolder.value}
  - App Router: ${appRouter.value}
  - Package Manager: ${packageManager.value}
  - Features: ${features.value.length == 0 ? "None" : features.value.join(", ")}
  - ORM: ${orm.value}
  - Validator: ${validator.value}
  - CSS Framework: ${cssFramework.value}
  - CSS Preprocessor: ${cssPreprocessor.value}
  - Auth Provider: ${auth.value}
  - Install Dependencies: ${installDependencies.value}
  `);

  const confirm = await inquirer.prompt({
    name: "value",
    type: "confirm",
    message: "Is this correct?",
  });

  if (!confirm.value) process.exit(0);

  const dependencies = getDependencies();
  new TemplateManager(srcFolder.value, appRouter.value, dependencies).initiateTemplate();
  exec(`${packageManager.value} i ${dependencies}`);
}

function getDependencies(features, orm, validator, css_framework, css_language, auth) {
  let dependencies = [];

  if (features.includes("shadcn")) {
    dependencies.push("shadcn-ui");
  }
  if (features.includes("trpc")) {
    dependencies.push("trpc");
  }

  switch (orm) {
    case "None":
      break;
    case "Prisma ORM":
      dependencies.push("prisma");
      dependencies.push("@prisma/client");
      break;
    case "Drizzle ORM":
      dependencies.push("drizzle-orm");
      break;
  }

  switch (validator) {
    case "None":
      break;
    case "Valibot":
      dependencies.push("valibot");
      break;
    case "Zod":
      dependencies.push("zod");
      break;
    case "Superstruct":
      dependencies.push("superstruct");
      break;
    case "Yup":
      dependencies.push("yup");
      break;
  }

  switch (css_framework) {
    case "None":
      break;
    case "TailwindCSS":
      dependencies.push("tailwindcss");
      dependencies.push("autoprefixer");
      dependencies.push("postcss");
      break;
    case "UnoCSS":
      dependencies.push("unocss");
      break;
  }

  switch (css_language) {
    case "None":
      break;
    case "SCSS":
      dependencies.push("sass");
      break;
    case "SASS":
      dependencies.push("sass");
      break;
    case "LESS":
      dependencies.push("less");
      break;
    case "Stylus":
      dependencies.push("stylus");
      break;
  }

  switch (auth) {
    case "None":
      break;
    case "Firebase":
      dependencies.push("firebase");
      break;
    case "Supabase":
      dependencies.push("supabase");
      break;
    case "Auth0":
      dependencies.push("auth0");
      break;
  }

  return dependencies.join(" ");
}

function sleep(ms = 2000) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}