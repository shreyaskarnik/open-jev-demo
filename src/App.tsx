import type { OpenJev } from "open-jev";
import { useCallback, useState } from "react";
import TopBar from "./components/TopBar";
import type { Screen } from "./components/TopBar";
import DemoScreen from "./components/demo/DemoScreen";
import InstallScreen from "./components/install/InstallScreen";

export default function App() {
  const [screen, setScreen] = useState<Screen>("install");
  const [jev, setJev] = useState<OpenJev | null>(null);

  const handleLoaded = useCallback((instance: OpenJev) => {
    setJev(instance);
    setScreen("demo");
  }, []);

  return (
    <div className="min-h-screen p-3 sm:p-6 lg:p-8">
      <main className="mx-auto flex max-w-screen-2xl flex-col gap-8 rounded-4xl bg-cream p-5 shadow-frame sm:p-8">
        <TopBar
          screen={screen}
          demoReady={jev !== null}
          runtime={jev?.runtime ?? null}
          onNavigate={setScreen}
        />
        <div key={screen} className="animate-scale-in">
          {screen === "demo" && jev ? (
            <DemoScreen jev={jev} />
          ) : (
            <InstallScreen onLoaded={handleLoaded} />
          )}
        </div>
      </main>
    </div>
  );
}
