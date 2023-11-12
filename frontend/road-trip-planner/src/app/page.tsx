import UserLocation from "../components/userLocation";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div>
        <UserLocation />
      </div>
    </main>
  );
}
