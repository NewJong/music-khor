import { useEffect, useState } from "react";

export default function Greeting() {
  const [greeting, setGreeting] = useState("");

  useEffect(() => {
    const hours = new Date().getHours();
    if (hours >= 5 && hours < 12) {
      setGreeting("Good Morning 🌅");
    } else if (hours >= 12 && hours < 18) {
      setGreeting("Good Afternoon ☀️");
    } else if (hours >= 18 && hours < 22) {
      setGreeting("Good Evening 🌇");
    } else {
      setGreeting("Good Night 🌙");
    }
  }, []);

  return (
    <h1
      className="text-3xl font-bold text-black"
      style={{ textShadow: "2px 2px 4px rgba(0, 0, 0, 0.5)" }}
    >
      {greeting}
    </h1>
  );
}
