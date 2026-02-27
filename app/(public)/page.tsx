// this page should be used only as a splash page to decide where a user should be navigated to
// when logged in --> to /heists
// when not logged in --> to /login

import { Clock8 } from "lucide-react";

export default function Home() {
  return (
    <div className="center-content">
      <div className="page-content">
        <h1>
          P<Clock8 className="logo" strokeWidth={2.75} />
          cket Heist
        </h1>
        <div>Tiny missions. Big office mischief.</div>
        <p>
          Welcome to Pocket Heist — the ultimate app for plotting harmless office capers with your crew. Assign sneaky
          missions, track your progress, and rise through the ranks of cubicle mischief. Whether it&apos;s swapping desk
          supplies or orchestrating a surprise coffee run, every heist counts.
        </p>
      </div>
    </div>
  );
}
