import * as vscode from "vscode";

function removeTailwindClasses(): void {
  const editor: vscode.TextEditor | undefined = vscode.window.activeTextEditor;
  if (!editor) {
    vscode.window.showErrorMessage("No active editor found");
    return;
  }

  const classList: string[] = [
    "bg",
    "text",
    "leading",
    "border",
    "divide",
    "ring",
    "shadow",
    "opacity",
    "transition",
    "duration",
    "ease",
    "delay",
  ];

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
  let removeTailwindClassesFunction: vscode.Disposable =
    vscode.commands.registerCommand(
      "extension.removeTailwindClasses",
      removeTailwindClasses
    );

  let removeAllClassesFunction: vscode.Disposable =
    vscode.commands.registerCommand(
      "extension.removeAllClasses",
      removeAllClasses
    );

  context.subscriptions.push(removeTailwindClassesFunction);
  context.subscriptions.push(removeAllClassesFunction);

  let disposable = vscode.commands.registerCommand(
    "extension.downwind",
    async () => {
      const selectedOption = await vscode.window.showQuickPick(
        ["Remove Tailwind Classes", "Remove All Classes"],
        { canPickMany: false }
      );
      if (selectedOption === "Remove Tailwind Classes") {
        removeTailwindClasses();
      } else if (selectedOption === "Remove All Classes") {
        removeAllClasses();
      }
    }
  );

  context.subscriptions.push(disposable);
}

export function deactivate(): void {}
