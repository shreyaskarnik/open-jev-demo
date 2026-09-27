import type { OpenJev } from "open-jev";
import { useCallback, useState } from "react";
import TopBar from "./components/TopBar";
import type { Screen } from "./components/TopBar";
import BenchmarkScreen from "./components/benchmark/BenchmarkScreen";
import DemoScreen from "./components/demo/DemoScreen";
import InstallScreen from "./components/install/InstallScreen";
import { pageFromUrl } from "./lib/urlModel";

export default function App() {
  const [screen, setScreen] = useState<Screen>(
    () => pageFromUrl() ?? "install"
  );
  const [jev, setJev] = useState<OpenJev | null>(null);
  // Picking a model from the benchmark page returns there once it is loaded.
  const [returnTo, setReturnTo] = useState<Screen>("demo");

  const handleLoaded = useCallback(
    (instance: OpenJev) => {
      setJev(instance);
      setScreen(returnTo);
    },
    [returnTo]
  );

  const navigate = useCallback((next: Screen) => {
    setReturnTo(next === "benchmark" ? "benchmark" : "demo");
    setScreen(next);
  }, []);

  return (
    <div className="min-h-screen p-3 sm:p-6 lg:p-8">
      <main className="mx-auto flex max-w-screen-2xl flex-col gap-8 rounded-4xl bg-cream p-5 shadow-frame sm:p-8">
        <TopBar
          screen={screen}
          demoReady={jev !== null}
          runtime={jev?.runtime ?? null}
          onNavigate={navigate}
        />
        <div key={screen} className="animate-scale-in">
          {screen === "benchmark" ? (
            <BenchmarkScreen jev={jev} onInstall={() => setScreen("install")} />
          ) : screen === "demo" && jev ? (
            <DemoScreen jev={jev} />
          ) : (
            <InstallScreen onLoaded={handleLoaded} />
          )}
        </div>
      </main>
    </div>
  );
}
