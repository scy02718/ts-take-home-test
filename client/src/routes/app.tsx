import { useEffect, useState } from "react";
import { Header } from "../components/header/header.tsx";
import { Insights } from "../components/insights/insights.tsx";
import styles from "./app.module.css";
import type { Insight } from "../schemas/insight.ts";

export const App = () => {
  const [insights, setInsights] = useState<Insight[]>([]);

  useEffect(() => {
    const fetchInsights = async () => {
      const res = await fetch("/api/insights");
      const data = await res.json();
      setInsights(data);
    };
    fetchInsights();
  }, []);

  return (
    <main className={styles.main}>
      <Header
        onCreated={(newInsight) => setInsights([...insights, newInsight])}
      />
      <Insights
        insights={insights}
        setInsights={setInsights}
        className={styles.insights}
      />
    </main>
  );
};
