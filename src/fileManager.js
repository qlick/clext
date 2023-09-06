import {readdir} from "fs/promises"
import { dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(`${__dirname}/templates`))

class FileManager {
  usingSrc;
  usingAppRouter;
  
  constructor(usingSrc, usingAppRouter) {
    this.usingSrc = usingSrc;
    this.usingAppRouter = usingAppRouter;
  }

  initiateTemplate() {
  
  }
}