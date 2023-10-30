import * as vscode from "vscode";

export function activate(context: vscode.ExtensionContext) {
  let disposable = vscode.commands.registerCommand(
    "extension.removeTailwindClasses",
    () => {
      const editor = vscode.window.activeTextEditor;
      if (!editor) {
        vscode.window.showErrorMessage("No active editor found");
        return;
      }

      const text = editor.document.getText();
      const regex =
        /(?:^|\s)(?:bg|text|border|divide|ring|ring-offset|shadow|opacity|mix-blend|filter|backdrop|blur|brightness|contrast|drop-shadow|grayscale|hue-rotate|invert|saturate|sepia|transition|duration|ease|delay)-[\w-]+/g;
      const newText = text.replace(regex, "");

      if (newText === text) {
        vscode.window.showInformationMessage("No tailwind classes found");
        return;
      }

      editor.edit((editBuilder) => {
        editBuilder.replace(
          new vscode.Range(
            editor.document.positionAt(0),
            editor.document.positionAt(text.length)
          ),
          newText
        );
      });

      vscode.window.showInformationMessage(`Removed tailwind classes`);
    }
  );

  context.subscriptions.push(disposable);
}

export function deactivate() {}
