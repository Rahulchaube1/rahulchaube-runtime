interface ReactElement {
  type: string;
  props: Record<string, any>;
  children: (ReactElement | string)[];
}

function createElement(type: string, props: Record<string, any> = {}, ...children: (ReactElement | string)[]): ReactElement {
  return { type, props, children };
}

function renderToString(element: ReactElement | string): string {
  if (typeof element === "string") return element;
  const inner = element.children.map(renderToString).join("");
  return `<${element.type}>${inner}</${element.type}>`;
}

const App = () => createElement("div", {}, createElement("h1", {}, "React Compatibility"), createElement("p", {}, "RahulChaube SSR"));
const html = renderToString(App());
console.log(html);
