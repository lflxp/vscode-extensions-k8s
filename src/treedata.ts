import  * as vscode from 'vscode';

export class TTTreeNode {
    constructor(label: string = "noname") {
        this.name = label;
    }
    name: string;
    children: TTTreeNode[] = [];
}

export class testdata implements vscode.TreeDataProvider<TTTreeNode> {
    root: TTTreeNode = new TTTreeNode("root");
    // 将数据转换为可见的vscode.TreeItem
    getTreeItem(element: TTTreeNode): vscode.TreeItem | Thenable<vscode.TreeItem> {
        // 可以在这里为treeitem指定图表和command，command会在选中的项目时出发
        if (element.children.length > 0)
            return new vscode.TreeItem(element.name,vscode.TreeItemCollapsibleState.Expanded)
        else
            // 这样没有子节点
            return new vscode.TreeItem(element.name);
    }   
    // 查询子节点
    getChildren(element?: TTTreeNode | undefined): vscode.ProviderResult<TTTreeNode[]> {
        if (element == undefined) 
            return this.root.children;
        return element?.children;
    }
}
