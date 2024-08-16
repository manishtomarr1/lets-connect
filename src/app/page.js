import Image from "next/image";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-8 bg-gray-100">
      {/* Hero Section */}
      <section className="flex flex-col items-center text-center">
        <div className="relative w-full h-80 lg:h-96">
          <Image
            src="/assests/home.png"
            alt="Let's Connect"
            layout="fill"
            objectFit="cover"
            className="rounded-lg shadow-lg"
          />
        </div>
        <h1 className="mt-8 text-4xl font-bold text-gray-800">Let's Connect</h1>
        <p className="mt-4 max-w-2xl text-lg text-gray-600">
          Welcome to Let's Connect, the ultimate platform for making connections and building friendships. Whether you’re here to find new buddies, keep in touch with friends, or engage in meaningful conversations, we’ve got you covered. Start connecting today!
        </p>
      </section>

      {/* Features Section */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-12 text-center">
        <div className="group rounded-lg border border-transparent p-6 transition-colors hover:border-gray-300 hover:bg-white shadow-lg">
          <h2 className="text-2xl font-semibold text-gray-800 mb-3">
            Easy to Use
            <span className="inline-block transition-transform group-hover:translate-x-1">
              &rarr;
            </span>
          </h2>
          <p className="text-gray-600">
            Our user-friendly interface ensures you can start connecting with friends in no time.
          </p>
        </div>

        <div className="group rounded-lg border border-transparent p-6 transition-colors hover:border-gray-300 hover:bg-white shadow-lg">
          <h2 className="text-2xl font-semibold text-gray-800 mb-3">
            Real-time Chat
            <span className="inline-block transition-transform group-hover:translate-x-1">
              &rarr;
            </span>
          </h2>
          <p className="text-gray-600">
            Stay connected with your friends through real-time messaging, anywhere, anytime.
          </p>
        </div>

        <div className="group rounded-lg border border-transparent p-6 transition-colors hover:border-gray-300 hover:bg-white shadow-lg">
          <h2 className="text-2xl font-semibold text-gray-800 mb-3">
            Secure
            <span className="inline-block transition-transform group-hover:translate-x-1">
              &rarr;
            </span>
          </h2>
          <p className="text-gray-600">
            Your privacy is our priority. We ensure your data is protected with top-notch security.
          </p>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="mt-16 flex flex-col items-center">
        <a
          href="/signup"
          className="px-8 py-4 text-lg font-semibold text-white bg-blue-500 rounded-lg shadow hover:bg-blue-600 transition-colors"
        >
          Get Started
        </a>
      </section>
    </main>
  );
}
