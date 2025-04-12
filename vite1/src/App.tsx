import { Suspense, useEffect, useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import { init, loadRemote } from "@module-federation/runtime";

init({
  name: "app1",
  remotes: [
    {
      type: "module",
      name: "app2",
      entry: "http://localhost:3002/remoteEntry.js",
    },
  ],
});

type UseDynamicImportProps = {
  module: string;
  scope: string;
};

function useDynamicImport({ module, scope }: UseDynamicImportProps) {
  const [component, setComponent] = useState(null);

  useEffect(() => {
    if (!module || !scope) return;

    const loadComponent = async () => {
      try {
        const { default: Component } = await loadRemote(`${scope}/${module}`);
        setComponent(() => Component);
      } catch (error) {
        console.error(`Error loading remote module ${scope}/${module}:`, error);
      }
    };

    loadComponent();
  }, [module, scope]);

  return component;
}

function App() {
  const [count, setCount] = useState(0);
  const [{ module, scope }, setSystem] = useState<any>({});

  const setApp2 = () => {
    setSystem({
      scope: "app2",
      module: "button",
    });
  };

  const Component = useDynamicImport({ module, scope }) as any;

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>

      <button onClick={setApp2}>Load App 2 Widget</button>
      <div style={{ marginTop: "2em" }}>
        <Suspense fallback="Loading System">
          {Component ? (
            <Component onClick={() => alert("Clicked")}>Test</Component>
          ) : null}
        </Suspense>
      </div>
    </>
  );
}

export default App;
