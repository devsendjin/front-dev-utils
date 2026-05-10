import { createRoot } from "react-dom/client";
import "./";

export const Playground = () => {
  llog("test");

  return (
    <div>
      <h1>Playground</h1>
    </div>
  );
};

const main = () => {
  llog("test");

  const root = document.getElementById("root");

  if (!root) return;

  createRoot(root).render(<Playground />);
};

main();
