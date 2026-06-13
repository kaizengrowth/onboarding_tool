import Link from "next/link";

// Front door: resources visible with zero signup. Give before asking.
export default function FrontDoor() {
  return (
    <main>
      <section>
        <h1>You just got hit. Here&rsquo;s what to do right now.</h1>

        <div>
          <h2>Know Your Rights</h2>
          <p>
            WARN Act: if your employer has 100+ employees and laid off 50+, you may be owed 60
            days of notice pay.{" "}
            <a href="https://sugarlaw.org" target="_blank" rel="noopener noreferrer">
              Get a free consult from Sugar Law →
            </a>
          </p>
          <p>
            Severance agreements: you can negotiate, and signing away your rights has a deadline.
            Don&rsquo;t sign anything within the first week without reviewing it.
          </p>
        </div>

        <div>
          <h2>File for Unemployment — Today</h2>
          <p>
            Most states backdate benefits to your filing date, not your approval date. File the
            day your job ends, not when you feel ready.
          </p>
        </div>

        <div>
          <h2>Health Coverage</h2>
          <p>
            You have 60 days to elect COBRA, but the Marketplace may cost less. Compare both
            before deciding. Losing employer coverage is a qualifying life event.
          </p>
        </div>

        <div>
          <h2>Income Support</h2>
          <p>
            <a href="https://aidividend.org" target="_blank" rel="noopener noreferrer">
              AI Dividend →
            </a>
          </p>
        </div>

        <div>
          <h2>If You&rsquo;re Struggling Right Now</h2>
          <p>988 Suicide &amp; Crisis Lifeline: call or text <strong>988</strong></p>
          <p>Crisis Text Line: text HOME to <strong>741741</strong></p>
        </div>
      </section>

      <section>
        <h2>You don&rsquo;t have to figure this out alone.</h2>
        <p>
          We match people from the same layoff so you&rsquo;re in a room with people who know
          exactly what you&rsquo;re dealing with.
        </p>
        <Link href="/intake">Talk to us →</Link>
      </section>
    </main>
  );
}
