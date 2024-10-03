import Link from "next/link";

export default function Home() {

  return (
    <div>
      <main>
        <h1>Home page</h1>
        <Link href="/components">View Components</Link>
      </main>
    </div>
  );
}
