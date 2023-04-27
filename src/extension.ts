// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as path from 'path';
import { getVSCodeDownloadUrl } from '@vscode/test-electron/out/util';
import { TTTreeNode, testdata } from './treedata';

const cats = {
	'Coding Cat': 'https://media.giphy.com/media/JIX9t2j0ZTN9S/giphy.gif',
	'Compiling Cat': 'https://media.giphy.com/media/mlvseq9yvZhba/giphy.gif',
	'Testing Cat': 'https://media.giphy.com/media/3oriO0OEd9QIDdllqo/giphy.gif'
};

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "helloworld" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('helloworld.helloWorld', () => {
		// The code you place here will be executed every time your command is executed
		// Display a message box to the user
		vscode.window.showInformationMessage('Hello World from helloworld!');
	});

	context.subscriptions.push(disposable);

	// 追踪当前webview面板
	let currentPanel: vscode.WebviewPanel | undefined = undefined;

	let catcoding = vscode.commands.registerCommand('catCoding.start', () => {
		const columnToShowIn = vscode.window.activeTextEditor
        ? vscode.window.activeTextEditor.viewColumn
        : undefined;

		if (currentPanel) {
			// 如果我们已经有了一个面板，那就把它显示到目标列布局中
			currentPanel.reveal(columnToShowIn);
		} else {
			// 不然，创建一个新面板
			currentPanel = vscode.window.createWebviewPanel(
				'catCoding', // 只供内部使用，这个webview的标识
				'Cat Coding', // 给用户显示的面板标题
				vscode.ViewColumn.One, // 给新的webview面板一个编辑器视图
				{
					// 只允许webview加载我们插件的`media`目录下的资源
					// 为了禁止所有的本地资源，只要把localResourceRoots设为[]就好了。
					localResourceRoots: [vscode.Uri.file(path.join(context.extensionPath, 'media'))],
					// 在webview中启用脚本
					enableScripts: true,
					// 隐藏时保留上下文
					// retainContextWhenHidden: true
				} // Webview选项。我们稍后会用上
			);

			// 获取磁盘上的资源路径
			const onDiskPath = vscode.Uri.file(
				path.join(context.extensionPath, 'media', 'cat.gif')
			);

			// 获取在webview中使用的特殊URI
			const catGifSrc = onDiskPath.with({scheme: 'vscode-resource'});

			currentPanel.webview.html = getWebviewContents(catGifSrc);
	
			// currentPanel.webview.html = getWebviewContentByCat('Coding Cat');

			// 根据视图状态变动更新内容
			currentPanel.onDidChangeViewState( 
				e => {
					const panel = e.webviewPanel;
					switch (panel.viewColumn) {
						case vscode.ViewColumn.One:
							updateWebviewForCat(panel, 'Coding Cat');
							return;
						case vscode.ViewColumn.Two:
							updateWebviewForCat(panel, 'Compiling Cat');
							return;
						case vscode.ViewColumn.Three:
							updateWebviewForCat(panel, 'Testing Cat');
							return;
					}
				},
				null,
				context.subscriptions
			);

			// 处理webview中的信息
			currentPanel.webview.onDidReceiveMessage(message => {
				switch (message.command) {
					case 'alert':
						vscode.window.showErrorMessage(message.text);
						return;
				}
			}, undefined, context.subscriptions);
	
			currentPanel.onDidDispose(() => {
				currentPanel = undefined;	
			},null,context.subscriptions);
		}

		// const panel = vscode.window.createWebviewPanel(
		// 	'catCoding', // 只供内部使用，这个webview的标识
		// 	'Cat Coding', // 给用户显示的面板标题
		// 	vscode.ViewColumn.One, // 给新的webview面板一个编辑器视图
		// 	{} // Webview选项。我们稍后会用上
		// );

		// // 设置HTML内容
		// // panel.webview.html = getWebviewContent();

		// let iteration = 0;
		// const updateWebView = () => {
		// 	const cat = iteration++ % 2 ? 'Compiling Cat' : 'Coding Cat';
		// 	panel.title = cat;
		// 	panel.webview.html = getWebviewContentByCat(cat);
		// };

		// // 设置初始化内容
		// updateWebView();

		// // 每秒更新内容
		// const interval = setInterval(updateWebView, 1000);

		// // 5秒后，程序性地关闭webview面板
		// // const timeout = setTimeout(() => panel.dispose(), 5000);

		// panel.onDidDispose(() => {
		// 	// 当面板关闭时，取消webviews内容之后的更新
		// 	clearInterval(interval);
		// 	// clearTimeout(timeout);
		// },null,context.subscriptions);
	});
	context.subscriptions.push(catcoding);

	context.subscriptions.push(vscode.commands.registerCommand('catCoding.doRefactor', () => {
		if (!currentPanel) {
			return;
		}

		// 把信息发送到webview
		// 你可以发送任何序列化的JSON数据
		currentPanel.webview.postMessage({ command: 'refactor' });
	}));

	context.subscriptions.push(vscode.commands.registerCommand('data1.refresh', () => {
		vscode.window.showInformationMessage('Data1 refresh');
		const columnToShowIn = vscode.window.activeTextEditor
        ? vscode.window.activeTextEditor.viewColumn
        : undefined;

		if (currentPanel) {
			// 如果我们已经有了一个面板，那就把它显示到目标列布局中
			currentPanel.reveal(columnToShowIn);
		} else {
			// 不然，创建一个新面板
			currentPanel = vscode.window.createWebviewPanel(
				'catCoding', // 只供内部使用，这个webview的标识
				'Cat Coding', // 给用户显示的面板标题
				vscode.ViewColumn.One, // 给新的webview面板一个编辑器视图
				{
					// 只允许webview加载我们插件的`media`目录下的资源
					// 为了禁止所有的本地资源，只要把localResourceRoots设为[]就好了。
					localResourceRoots: [vscode.Uri.file(path.join(context.extensionPath, 'media'))],
					// 在webview中启用脚本
					enableScripts: true,
					// 隐藏时保留上下文
					// retainContextWhenHidden: true
				} // Webview选项。我们稍后会用上
			);

			// 获取磁盘上的资源路径
			const onDiskPath = vscode.Uri.file(
				path.join(context.extensionPath, 'media', 'cat.gif')
			);

			// 获取在webview中使用的特殊URI
			const catGifSrc = onDiskPath.with({scheme: 'vscode-resource'});

			currentPanel.webview.html = getWebviewContents(catGifSrc);
	
			// currentPanel.webview.html = getWebviewContentByCat('Coding Cat');

			// 根据视图状态变动更新内容
			currentPanel.onDidChangeViewState( 
				e => {
					const panel = e.webviewPanel;
					switch (panel.viewColumn) {
						case vscode.ViewColumn.One:
							updateWebviewForCat(panel, 'Coding Cat');
							return;
						case vscode.ViewColumn.Two:
							updateWebviewForCat(panel, 'Compiling Cat');
							return;
						case vscode.ViewColumn.Three:
							updateWebviewForCat(panel, 'Testing Cat');
							return;
					}
				},
				null,
				context.subscriptions
			);

			// 处理webview中的信息
			currentPanel.webview.onDidReceiveMessage(message => {
				switch (message.command) {
					case 'alert':
						vscode.window.showErrorMessage(message.text);
						return;
				}
			}, undefined, context.subscriptions);
	
			currentPanel.onDidDispose(() => {
				currentPanel = undefined;	
			},null,context.subscriptions);
		}
	}));

	context.subscriptions.push(vscode.commands.registerCommand('data2.refresh', () => {
		vscode.window.showInformationMessage('Data2 refresh');
	}));

	context.subscriptions.push(vscode.commands.registerCommand('vuecli:openVueApp', () => {
		// WebAppPanel.createOrShow(context.extensionUri);
		vscode.window.showInformationMessage('vuecli.openVueApp');
		
		const panel = vscode.window.createWebviewPanel(
			'vuecli', // 只供内部使用，这个webview的标识
			'umijs Dashboard', // 给用户显示的面板标题
			vscode.ViewColumn.One, // 给新的webview面板一个编辑器视图
			{
				localResourceRoots: [vscode.Uri.file(path.join(context.extensionPath, 'web'))],
				enableScripts: true,
			} // Webview选项。我们稍后会用上
		);
		panel.webview.html = getUmiContent(context, panel, "3.5.17");
		panel.onDidDispose(() => {
			vscode.window.showInformationMessage('vuecli.openVueApp Close');	
		},null,context.subscriptions);
	}));

	// 给treeView挂数据
	testTree(context);

	// 确保我们注册了一个序列化器
    vscode.window.registerWebviewPanelSerializer('catCoding', new CatCodingSerializer());
}

class CatCodingSerializer implements vscode.WebviewPanelSerializer {
	async deserializeWebviewPanel(webviewPanel: vscode.WebviewPanel, state: any) {
		// `state`是webview内调用`setState`保留住的
        console.log(`Got state: ${state}`);
		
		// 恢复我们的webview内容
        //
        // 确保我们将`webviewPanel`传递到了这里
        // 然后用事件侦听器恢复我们的内容
		webviewPanel.webview.html = getWebviewContent();
	}
}

function testTree(context: vscode.ExtensionContext) {
	var tdata = new testdata();

	tdata.root.children.push(new TTTreeNode("label001"));
	var c01 = new TTTreeNode("label002");
	tdata.root.children.push(c01);
	tdata.root.children.push(new TTTreeNode("nihao"));
	c01.children.push(new TTTreeNode("subnode"));

	let tree1 = vscode.window.registerTreeDataProvider("data1", tdata);
	let tree2 = vscode.window.registerTreeDataProvider("data2", tdata);
	context.subscriptions.push(tree1, tree2);
}

function getWebviewContent() {
	return `
		<!DOCTYPE html>
		<html lang="en">
		<head>
			<meta charset="UTF-8">
			<meta name="viewport" content="width=device-width, initial-scale=1.0">
			<title>Cat Coding</title>
		</head>
		<body>
			<img src="https://media.giphy.com/media/JIX9t2j0ZTN9S/giphy.gif" width="300" />
			<h1 id="lines-of-code-counter">0</h1>
			<a href="https://lflxp.gitee.io/" target="_self">Go to LFLXP</a>

			<script>
				const vscode = acquireVsCodeApi();
				const counter = document.getElementById('lines-of-code-counter');

				// 检查是否需要恢复状态
				const previousState = vscode.getState();

				// let count = 0;
				let count = previousState ? previousState.count : 0;
				setInterval(() => {
					counter.textContent = count++;
					
					// 更新已经保存的状态
					vscode.setState({ count });

					// Alert the extension when our cat introduces a bug
					if (Math.random() < 0.001 * count) {
						vscode.postMessage({
							command: 'alert',
							text: 'Carry on line ' + count
						})
					}
				}, 100);

				// Handle the message inside the webview
				window.addEventListener('message', event => {
					const message = event.data; // The JSON data our extension sent
					switch (message.command) {
						case 'refactor':
							count = Math.ceil(count * 0.5);
							counter.textContent = count;
							break;
					}
				});
			</script>
		</body>
		</html>
	`;
}

function getWebviewContents(cat: vscode.Uri) {
	return `
		<!DOCTYPE html>
		<html lang="en">
		<head>
			<meta charset="UTF-8">
			<meta name="viewport" content="width=device-width, initial-scale=1.0">
			<title>Cat Coding</title>
		</head>
		<body>
			<img src="${cat}" width="300" />
			<h1 id="lines-of-code-counter">0</h1>
			<a href="https://lflxp.gitee.io/" target="_self">Go to LFLXP</a>

			<script>
				const vscode = acquireVsCodeApi();
				const counter = document.getElementById('lines-of-code-counter');

				// 检查是否需要恢复状态
				const previousState = vscode.getState();

				// let count = 0;
				let count = previousState ? previousState.count : 0;
				setInterval(() => {
					counter.textContent = count++;
					
					// 更新已经保存的状态
					vscode.setState({ count });

					// Alert the extension when our cat introduces a bug
					if (Math.random() < 0.001 * count) {
						vscode.postMessage({
							command: 'alert',
							text: 'Carry on line ' + count
						})
					}
				}, 100);

				// Handle the message inside the webview
				window.addEventListener('message', event => {
					const message = event.data; // The JSON data our extension sent
					switch (message.command) {
						case 'refactor':
							count = Math.ceil(count * 0.5);
							counter.textContent = count;
							break;
					}
				});
			</script>
		</body>
		</html>
	`;
}

function getWebviewContentByCat(cat: keyof typeof cats) {
	return `
		<!DOCTYPE html>
		<html lang="en">
		<head>
			<meta charset="UTF-8">
			<meta name="viewport" content="width=device-width, initial-scale=1.0">
			<title>Cat Coding</title>
		</head>
		<body>
			<img src="${cats[cat]}" width="300" />
			<h1 id="lines-of-code-counter">0</h1>
			<a href="https://lflxp.gitee.io/" target="_self">Go to LFLXP</a>

			<script>
				const vscode = acquireVsCodeApi();
				const counter = document.getElementById('lines-of-code-counter');

				// 检查是否需要恢复状态
				const previousState = vscode.getState();

				// let count = 0;
				let count = previousState ? previousState.count : 0;
				setInterval(() => {
					counter.textContent = count++;
					
					// 更新已经保存的状态
					vscode.setState({ count });

					// Alert the extension when our cat introduces a bug
					if (Math.random() < 0.001 * count) {
						vscode.postMessage({
							command: 'alert',
							text: 'Carry on line ' + count
						})
					}
				}, 100);

				// Handle the message inside the webview
				window.addEventListener('message', event => {
					const message = event.data; // The JSON data our extension sent
					switch (message.command) {
						case 'refactor':
							count = Math.ceil(count * 0.5);
							counter.textContent = count;
							break;
					}
				});
			</script>
		</body>
		</html>
	`;
}

/**
 * 获取基于 umijs 的 webview 内容
 * @param context 扩展上下文
 * @param webviewPanel webview 面板对象
 * @param rootPath webview 所在路径，默认 web
 * @param umiVersion umi 版本
 * @returns string
 */
 export const getUmiContent = (
	context: vscode.ExtensionContext,
	webviewPanel: vscode.WebviewPanel,
	umiVersion?: string,
	rootPath = 'web'
  ) => {
	// 获取磁盘上的资源路径
	const getDiskPath = (fileName: string) => {
	  return webviewPanel.webview.asWebviewUri(
		vscode.Uri.file(path.join(context.extensionPath, rootPath, 'dist', fileName))
	  );
	};
	console.log('11111111111---------', getDiskPath('umi.5a19b5a0.css'));
	return `
	  <!DOCTYPE html><html><head>
		<meta charset="utf-8">
		<meta name="viewport" content="width=device-width, initial-scale=1.0">
		<meta http-equiv="X-UA-Compatible" content="ie=edge">
		<link rel="stylesheet" href="${getDiskPath('umi.5a19b5a0.css')}">
		</head>
		<body>
		<div id="root"></div>
		<script src="${getDiskPath('umi.c653aedf.js')}"></script>

		</body></html>
	`;
  };
  

function updateWebviewForCat(panel: vscode.WebviewPanel, catName: keyof typeof cats) {
	panel.title = catName;
	panel.webview.html = getWebviewContentByCat(catName);
}


// This method is called when your extension is deactivated
export function deactivate() {}
