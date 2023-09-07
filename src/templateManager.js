import {exec} from "child_process";

class TemplateManager {
  usingSrc;
  usingAppRouter;
  dependencies;

  constructor(usingSrc, usingAppRouter, dependencies) {
    this.usingSrc = usingSrc;
    this.usingAppRouter = usingAppRouter;
    this.dependencies = dependencies;
  }

  initiateTemplate() {
    exec(`git clone --depth 1 --no-checkout https://github.com/qlick/clext.git .`);
    exec(`git sparse-checkout set templates/${getGitHubFolder(dependencies)}`);
    exec(`git checkout`);
  }

  getPath() {
    return `${usingSrc ? "src/" : ""}${usingAppRouter ? "pages/" : ""}`;
  }

  getGitHubFolder(dependencies) {
    return `${getPath()}/${dependencies.join("/")}`;
  }
}
