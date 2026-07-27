function createViteServer() {
  const plugins: any[] = [];
  return {
    usePlugin(plugin: any) {
      plugins.push(plugin);
    },
    transformModule(id: any, code: any) {
      let result = code;
      for (const p of plugins) {
        if (p.transform) result = p.transform(result, id);
      }
      return result;
    }
  };
}

const server = createViteServer();
server.usePlugin({
  name: "vite-rc-plugin",
  transform(code: string) {
    return code.replace("__VITE_HEADER__", "RahulChaube Vite Bundler");
  },
});

console.log(server.transformModule("main.js", "const title = '__VITE_HEADER__';"));
