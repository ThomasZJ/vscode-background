import * as fs from "fs";
import * as path from "path";
import Config from "./Config";
import { stringify } from "querystring";

const jsName = "bootstrap-window.js";
const pkg = require("./../package.json");

class Style {
  jsPath: string = "";
  extName: string = "extension-am9rZXJiYWNrZ3JvdW5k";

  constructor() {
    let fileName: string | undefined = require.main?.filename;
    if (fileName) {
      this.jsPath = path.join(path.dirname(fileName), jsName);
      //vscode.window.showInformationMessage(this.jsPath);
    }
    this.extName = "extension-am9rZXJiYWNrZ3JvdW5k";
  }

  install() {
    let addJs: string = this.getJs();
    let js: string = this.getContent(this.jsPath);
    let originJs: string = this.clearContent(js);
    this.saveContent(this.jsPath, originJs + addJs);
    return true;
  }

  uninstall() {
    try {
      const js = this.getContent(this.jsPath);
      const originJs = this.clearContent(js);
      this.saveContent(this.jsPath, originJs);
      return true;
    } catch (e) {
      return false;
    }
  }

  getJs(): string {
    let opacity: Number = 1;
    let imagesJs: string = "";
    let pos: string = "top left";
    let path: string = "";
    let size: string = "";

    if (Config.filePath) {
      path = Config.filePath;
    } else {
      path = Config.GetConfig("filepath");
    }
    if (Config.Opacity) {
      opacity = Number.parseFloat(Config.Opacity);
    } else {
      opacity = Number.parseFloat(Config.GetConfig("opacity"));
    }
    if (Config.Alignment) {
      pos = Config.Alignment;
    } else {
      path = Config.GetConfig("alignment");
    }
    if (Config.Size) {
      size = Config.Size;
    } else {
      size = Config.GetConfig("size");
    }

    /* fix provided by Katsute <https://github.com/Katsute> */ {
        const isGIF: boolean = path.endsWith(".gif");
        const imgAsBase64: string = fs.existsSync(path) ? fs.readFileSync(path, "base64") : "";
        imagesJs = `data:image/${isGIF ? "gif" : "png"};base64,${imgAsBase64}`;
    }

    return `
/*${this.extName}-start*/
/*${this.extName}.ver.${pkg.version}*/
window.onload = function() {
    const image = "${imagesJs}"
    const defaultOpacity = ${opacity}
    const position = "${pos}"
    const size = "${size}"

    document.body.style.opacity = defaultOpacity
    document.body.style.backgroundSize = size
    document.body.style.backgroundPosition = position
    document.body.style.backgroundRepeat = "no-repeat"
    document.body.style.backgroundImage = "url('" + image + "')"
}
/*${this.extName}-end*/`.replace(/\s*$/, "");
  }

  getContent(contentPath: string) {
    return fs.readFileSync(contentPath, "utf-8");
  }

  saveContent(contentPath: string, content: any) {
    fs.writeFileSync(contentPath, content, "utf-8");
  }

  clearContent(content: string) {
    let re = new RegExp(
      "\\/\\*" +
      this.extName +
      "-start\\*\\/[\\s\\S]*?\\/\\*" +
      this.extName +
      "-end\\*" +
      "\\/",
      "g"
    );
    content = content.replace(re, "");
    content = content.replace(/\s*$/, "");
    return content;
  }
}
export default new Style();
