const vscode = require('vscode');
const path = require('path');
const fs = require('fs');

// Accent color targets — tokens that use the theme's accent color
const ACCENT_TOKENS = {
  "activityBarBadge.background": 100,
  "list.activeSelectionForeground": 100,
  "list.inactiveSelectionForeground": 100,
  "list.highlightForeground": 100,
  "scrollbarSlider.activeBackground": 50,
  "editorSuggestWidget.highlightForeground": 100,
  "textLink.foreground": 100,
  "progressBar.background": 100,
  "pickerGroup.foreground": 100,
  "tab.activeBorderTop": 100,
  "panel.border": 100
};

function activate(context) {
  const defaultsPath = path.join(context.extensionPath, 'extensions', 'defaults.json');
  const defaults = JSON.parse(fs.readFileSync(defaultsPath, 'utf8'));
  const accents = defaults.accents;
  const accentNames = Object.keys(accents);

  const command = vscode.commands.registerCommand('material.theme.setAccent', () => {
    const options = [...accentNames, 'Remove accent'];

    vscode.window.showQuickPick(options, {
      placeHolder: 'Select accent color'
    }).then(selected => {
      if (!selected) return;

      const config = vscode.workspace.getConfiguration().get('workbench.colorCustomizations') || {};

      if (selected === 'Remove accent') {
        Object.keys(ACCENT_TOKENS).forEach(token => {
          config[token] = undefined;
        });
      } else {
        let color = accents[selected];
        Object.entries(ACCENT_TOKENS).forEach(([token, alpha]) => {
          if (alpha < 100) {
            const hex = alpha > 10 ? String(alpha) : '0' + alpha;
            config[token] = color + hex;
          } else {
            config[token] = color;
          }
        });
      }

      vscode.workspace.getConfiguration().update('workbench.colorCustomizations', config, true).then(() => {
        vscode.window.showInformationMessage(`Accent: ${selected}`, 'Reload').then(choice => {
          if (choice === 'Reload') {
            vscode.commands.executeCommand('workbench.action.reloadWindow');
          }
        });
      });
    });
  });

  context.subscriptions.push(command);
}

module.exports = { activate };
