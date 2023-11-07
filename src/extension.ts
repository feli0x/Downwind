import * as vscode from "vscode";

function removeTailwindClasses(classType: string): void {
  const editor: vscode.TextEditor | undefined = vscode.window.activeTextEditor;
  if (!editor) {
    vscode.window.showErrorMessage("No active editor found");
    return;
  }

  const classMap: Record<string, string[]> = {
    typography: [
      "font",
      "text",
      "whitespace",
      "break",
      "align",
      "leading",
      "list",
      "placeholder",
      "rte",
      "tracking",
    ],
    layout: [
      "p",
      "m",
      "w",
      "min",
      "max",
      "h",
      "container",
      "box",
      "grid",
      "flex",
      "table",
      "float",
      "clear",
      "absolute",
      "fixed",
      "inset",
      "top",
      "right",
      "bottom",
      "left",
      "z",
      "order",
      "object",
      "overflow",
      "aspect",
      "col",
      "row",
      "basis",
      "grow",
      "shrink",
      "justify",
      "content",
      "items",
      "align",
      "place",
      "gap",
      "space",
    ],
    styling: [
      "bg",
      "border",
      "divide",
      "ring",
      "shadow",
      "opacity",
      "transition",
      "duration",
      "ease",
      "delay",
      "animate",
    ],
  };

  const classList: string[] = classMap[classType] || [];

  if (!classList.length) {
    removeAllClasses();
    return;
  }

  const regex: RegExp = new RegExp(
    `(?:^|\\s)(?:${classList.join("|")})-[\\w-]+`,
    "g"
  );

  const selection: vscode.Selection = editor.selection;
  const text: string = editor.document.getText(selection);
  const newText: string = removeClasses(text, regex);

  editor.edit((editBuilder: vscode.TextEditorEdit) => {
    editBuilder.replace(selection, newText);
  });

  vscode.window.showInformationMessage(`Removed ${classType} classes`);
}

function removeClasses(text: string, regex: RegExp): string {
  return text.replace(regex, "");
}

function removeAllClasses(): void {
  const editor: vscode.TextEditor | undefined = vscode.window.activeTextEditor;
  if (!editor) {
    vscode.window.showErrorMessage("No active editor found");
    return;
  }

  const regex: RegExp = /class\s*=\s*"([^"]*)"/g;

  const selection: vscode.Selection = editor.selection;
  const text: string = editor.document.getText(selection);
  const newText: string = text.replace(regex, 'class=""');

  if (newText === text) {
    vscode.window.showInformationMessage("No classes found");
    return;
  }

  editor.edit((editBuilder: vscode.TextEditorEdit) => {
    editBuilder.replace(selection, newText);
  });

  vscode.window.showInformationMessage(`Emptied all classes`);
}

export function activate(context: vscode.ExtensionContext): void {
  let removeTypographyClassesFunction: vscode.Disposable =
    vscode.commands.registerCommand("extension.removeTypographyClasses", () =>
      removeTailwindClasses("typography")
    );

  let removeLayoutClassesFunction: vscode.Disposable =
    vscode.commands.registerCommand("extension.removeLayoutClasses", () =>
      removeTailwindClasses("layout")
    );

  let removeStylingClassesFunction: vscode.Disposable =
    vscode.commands.registerCommand("extension.removeStylingClasses", () =>
      removeTailwindClasses("styling")
    );

  let removeAllClassesFunction: vscode.Disposable =
    vscode.commands.registerCommand(
      "extension.removeAllClasses",
      removeAllClasses
    );

  context.subscriptions.push(removeTypographyClassesFunction);
  context.subscriptions.push(removeLayoutClassesFunction);
  context.subscriptions.push(removeStylingClassesFunction);
  context.subscriptions.push(removeAllClassesFunction);

  let disposable = vscode.commands.registerCommand(
    "extension.downwind",
    async () => {
      const selectedOption = await vscode.window.showQuickPick(
        [
          "Remove Typography Classes",
          "Remove Layout Classes",
          "Remove Styling Classes",
          "Remove All Classes",
        ],
        { canPickMany: false }
      );
      switch (selectedOption) {
        case "Remove Typography Classes":
          removeTailwindClasses("typography");
          break;
        case "Remove Layout Classes":
          removeTailwindClasses("layout");
          break;
        case "Remove Styling Classes":
          removeTailwindClasses("styling");
          break;
        case "Remove All Classes":
          removeAllClasses();
          break;
        default:
          break;
      }
    }
  );

  context.subscriptions.push(disposable);
}

export function deactivate(): void {}
