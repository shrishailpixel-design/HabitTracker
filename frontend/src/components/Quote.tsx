import { useMemo } from "react";

const quotes = [
  { text: "The secret of getting ahead is getting started.", author: "Mark Twain" },
  { text: "Small daily improvements over time lead to stunning results.", author: "Robin Sharma" },
  { text: "You don't have to be extreme, just consistent.", author: "Unknown" },
  { text: "First we make our habits, then our habits make us.", author: "Charles C. Noble" },
  { text: "The chains of habit are too weak to be felt until they are too strong to be broken.", author: "Samuel Johnson" },
  { text: "Success is the sum of small efforts repeated day in and day out.", author: "Robert Collier" },
  { text: "It does not matter how slowly you go as long as you do not stop.", author: "Confucius" },
  { text: "Motivation gets you started. Habit keeps you going.", author: "Jim Ryun" },
  { text: "Every action you take is a vote for the type of person you wish to become.", author: "James Clear" },
  { text: "Be the design of your life, not the victim of your habits.", author: "Unknown" },
];

export default function Quote() {
  const quote = useMemo(() => quotes[Math.floor(Math.random() * quotes.length)], []);

  return (
    <div className="quote">
      <p className="quote-text">"{quote.text}"</p>
      <p className="quote-author">— {quote.author}</p>
    </div>
  );
}
