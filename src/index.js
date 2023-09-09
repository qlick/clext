#!/usr/bin/env node

import chalk from "chalk";
import inquirer from "inquirer";
import TemplateManager from "./templateManager.js";

await main();

/**
 * Main function
 */
async function main() {
  /**
   * Welcome message
   */
  console.log(`
  Welcome to ${chalk.bgMagenta("clext")}!
  A CLI tool to add features to your Next.js project.

  ${chalk.bgRed("WARNING: clext requires git to be installed!")}

  To add new values, make a feature request on github!
  https://github.com/qlick/clext/issues/new/
  `);

  /**
   * Sleep for 2 seconds
   */
  await sleep(2000);

  /**
   * Ask questions
   * 
   * @param {boolean} srcFolder - Whether to use src folder or not
   * @param {boolean} appRouter - Whether to use app router or not
   * @param {string} packageManager - Package manager to use
   * @param {string[]} features - Features to add
   * @param {string} orm - ORM to use
   * @param {string} validator - Validator to use
   * @param {string} cssFramework - CSS Framework to use
   * @param {string} cssPreprocessor - CSS Preprocessor to use
   * @param {string} auth - Auth Provider to use
   * @param {boolean} installDependencies - Whether to install dependencies or not
   * @param {boolean} confirm - Whether to confirm or not
   */

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
    choices: ["npm", "yarn", "pnpm", "bun"],
  });

  const features = await inquirer.prompt({
    name: "value",
    type: "checkbox",
    message: "(4/10) What features would you like to add?",
    choices: [
      {
        name: "ShadCN-UI (Installs Tailwind CSS)",
        value: "shadcn-ui",
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
  
  await sh(`${packageManager.value} i`);
  await sh(`${packageManager.value} i ${dependencies}`);
}

/**
 * Get the dependencies to be installed
 * 
 * @param {string[]} features - Features to add
 * @param {string} orm - ORM to use
 * @param {string} validator - Validator to use
 * @param {string} css_framework - CSS Framework to use
 * @param {string} css_preprocessor - CSS Preprocessor to use
 * @param {string} auth - Auth Provider to use
 * 
 * @returns {string} - Dependencies to be installed
 */
function getDependencies(features, orm, validator, css_framework, css_preprocessor, auth) {
  /**
   * Dependencies to be installed
   */
  let dependencies = [];

  /**
   * Add dependencies based on features
   */
  dependencies.push(features.map((feature) => feature).join(" "));

  /**
   * Add dependencies based on chosen orm
   */
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

  /**
   * Add dependencies based on chosen validator
   */
  if (validator != "None") dependencies.push(validator.toLowerCase());

  /**
   * Add dependencies based on chosen css framework
   */
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

  /**
   * Add dependencies based on chosen css preprocessor
   */
  if (css_preprocessor != "None") dependencies.push(css_preprocessor.toLowerCase());

  /**
   * Add dependencies based on chosen auth provider
   */
  if (auth != "None") dependencies.push(auth.toLowerCase());

  /**
   * Return dependencies
   */
  return dependencies.join(" ");
}

/**
 * Sleep for a specified amount of time
 * 
 * @param {number} ms - Time to sleep in milliseconds
 * 
 * @returns {Promise<void>}
 */
function sleep(ms = 2000) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Execute a shell command
 * 
 * @param {string} cmd - Command to execute
 * 
 * @returns {Promise<{stdout: string, stderr: string}>}
 */
async function sh(cmd) {
  return new Promise(function (resolve, reject) {
    exec(cmd, (err, stdout, stderr) => {
      if (err) {
        reject(err);
      } else {
        resolve({stdout, stderr});
      }
    });
  });
}