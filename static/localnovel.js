(function() {
  // 接受插件给webview初始化进度条
  window.addEventListener('message', event => {
    const message = event.data;
    console.log('message: ', message);
    switch (message.command) {
      case 'goProgress':
        window.scrollTo(0, document.body.scrollHeight * message.progress);
        break;
      default:
        console.error('插件向webview发送了未知消息');
        break;
    }
  });

  // webview将滚动条进度通知给插件
  const vscode = acquireVsCodeApi();
  let preProgress = 0;
  const timmer = setInterval(() => {
    const currentProgress = window.scrollY / document.body.scrollHeight;
    // 如果滚动条没动 则不发消息
    if (preProgress !== currentProgress) {
      preProgress = currentProgress;
      console.log(window.scrollY, document.body.scrollHeight);
      vscode.postMessage({
        command: 'updateProgress',
        progress: preProgress
      });
    }
  }, 1000);
}());
