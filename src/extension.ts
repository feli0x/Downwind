import * as vscode from "vscode";

// function to remove tailwind classes
export function removeTailwindClasses(): void {
  // get the active text editor
  const editor: vscode.TextEditor | undefined = vscode.window.activeTextEditor;
  // if no active editor found, show error message and return
  if (!editor) {
    vscode.window.showErrorMessage("No active editor found");
    return;
  }

  // list of tailwind classes to remove
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

  // regex to match tailwind classes
  const regex: RegExp = new RegExp(
    `(?:^|\\s)(?:${classList.join("|")})-[\\w-]+`,
    "g"
  );

  // get the current selection
  const selection: vscode.Selection = editor.selection;
  // get the text within the selection
  const text: string = editor.document.getText(selection);
  // remove tailwind classes from the text
  const newText: string = text.replace(regex, "");

  // if no tailwind classes found, show information message and return
  if (newText === text) {
    vscode.window.showInformationMessage("No tailwind classes found");
    return;
  }

  // replace the text within the selection with the new text
  editor.edit((editBuilder: vscode.TextEditorEdit) => {
    editBuilder.replace(selection, newText);
  });

  // show information message
  vscode.window.showInformationMessage(`Removed tailwind classes`);
}

// function to remove all classes
export function removeAllClasses(): void {
  // get the active text editor
  const editor: vscode.TextEditor | undefined = vscode.window.activeTextEditor;
  // if no active editor found, show error message and return
  if (!editor) {
    vscode.window.showErrorMessage("No active editor found");
    return;
  }

  // regex to match class attribute
  const regex: RegExp = /class\s*=\s*"([^"]*)"/g;

  // get the current selection
  const selection: vscode.Selection = editor.selection;
  // get the text within the selection
  const text: string = editor.document.getText(selection);
  // remove all classes from the text
  const newText: string = text.replace(regex, 'class=""');

  // if no classes found, show information message and return
  if (newText === text) {
    vscode.window.showInformationMessage("No classes found");
    return;
  }

  // replace the text within the selection with the new text
  editor.edit((editBuilder: vscode.TextEditorEdit) => {
    editBuilder.replace(selection, newText);
  });

  // show information message
  vscode.window.showInformationMessage(`Emptied all classes`);
}

// function to activate the extension
export function activate(context: vscode.ExtensionContext): void {
  // register the removeTailwindClasses command
  let removeTailwindClassesFunction: vscode.Disposable =
    vscode.commands.registerCommand(
      "extension.removeTailwindClasses",
      removeTailwindClasses
    );

  // register the removeAllClasses command
  let removeAllClassesFunction: vscode.Disposable =
    vscode.commands.registerCommand(
      "extension.removeAllClasses",
      removeAllClasses
    );

  // add the commands to the context subscriptions
  context.subscriptions.push(removeTailwindClassesFunction);
  context.subscriptions.push(removeAllClassesFunction);
}

// function to deactivate the extension
export function deactivate(): void {}
