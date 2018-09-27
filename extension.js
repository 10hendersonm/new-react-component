// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');
const path = require('path')
const fs = require('fs')

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
function activate(context) {
  let disposable = vscode.commands.registerCommand('extension.newReactComponent', function ({fsPath}) {
    const functionalComponent = {
      label: 'Functional Component',
      detail: 'A simple, easy to read component with no state or lifecycle methods.',
      generate: (componentName) =>
`import React from 'react'

const ${componentName} = (props) => {
  return (
    <div>
      
    </div>
  )
}

export default ${componentName}
`
    }
    const classComponent = {
      label: 'Class Component',
      detail: 'A component with the ability to add state and lifecycle methods.',
      generate: (componentName) =>
`import React, { Component } from 'react'

class ${componentName} extends Component {
  render () {
    return (
      <div>
        
      </div>
    )
  }
}

export default ${componentName}
`
    }
    vscode.window.showQuickPick([
      functionalComponent,
      classComponent,
    ]).then((componentType) => {
      if (!componentType) return vscode.window.showErrorMessage('No component type selected.')
      vscode.window.showInputBox({
        prompt: 'File Name'
      }).then((fsName) => {
        if (!fsName) return vscode.window.showErrorMessage('No file name entered.')
        fsName = fsName.substr(0, 1).toUpperCase() + fsName.substr(1)
        if (!/\./.test(fsName)) fsName = `${fsName}.js`
        var componentName = fsName.split('.')[0]
        const fullPath = path.join(fsPath, fsName)
        const generate = (componentType.label === functionalComponent.label ? functionalComponent.generate : classComponent.generate)
        const componentText = generate(componentName)
        if (fs.existsSync(fullPath)) return vscode.window.showErrorMessage(`File '${fsName}' already exists.`)
        fs.writeFileSync(fullPath, componentText, 'utf8')
        vscode.window.showInformationMessage(`Created component '${componentName}'.`)
      })
    })
  });

  context.subscriptions.push(disposable);
}
exports.activate = activate;

// this method is called when your extension is deactivated
function deactivate() {
}
exports.deactivate = deactivate;