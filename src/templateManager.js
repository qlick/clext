import {exec} from "child_process";

class TemplateManager {
  usingSrc;
  usingAppRouter;
  dependencies;

  /**
   * Constructor for TemplateManager
   * 
   * @param {boolean} usingSrc - Whether to use src folder or not
   * @param {boolean} usingAppRouter - Whether to use app router or not
   * @param {string[]} dependencies - Dependencies to be installed
  */
  constructor(usingSrc, usingAppRouter, dependencies) {
    this.usingSrc = usingSrc;
    this.usingAppRouter = usingAppRouter;
    this.dependencies = dependencies;
  }

  /**
   * Initiate the template
   */
  initiateTemplate() {
    exec(`git clone --depth 1 --no-checkout https://github.com/qlick/clext.git .`);
    exec(`git sparse-checkout set templates/${getGitHubFolder(dependencies)}`);
    exec(`git checkout`);
  }

  /**
   * Get the path of the template
   */
  getPath() {
    return `${usingSrc ? "src/" : ""}${usingAppRouter ? "pages/" : ""}`;
  }

  /**
   * Get the folder name of the template
   * 
   * @param {string[]} dependencies - Dependencies to be installed
   */
  getGitHubFolder(dependencies) {
    return `${getPath()}/${dependencies.join("/")}`;
  }
}
