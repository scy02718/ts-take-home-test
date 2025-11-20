import { useState } from "react";
import { Trash2Icon } from "lucide-react";
import { cx } from "../../lib/cx.ts";
import styles from "./insights.module.css";
import type { Insight } from "../../schemas/insight.ts";

type InsightsProps = {
  insights: Insight[];
  className?: string;
  setInsights: (insights: Insight[]) => void; // pass down from parent
};

export const Insights = ({
  insights,
  className,
  setInsights,
}: InsightsProps) => {
  const [loadingIds, setLoadingIds] = useState<number[]>([]);

  const deleteInsight = async (id: number) => {
    if (loadingIds.includes(id)) return; // prevent double-click
    setLoadingIds([...loadingIds, id]);

    try {
      const res = await fetch(`/api/insights/${id}`, {
        method: "DELETE",
      });

      if (res.ok || res.status === 204) {
        // Remove the deleted insight from state
        setInsights(insights.filter((ins) => ins.id !== id));
      } else {
        console.error(`Failed to delete insight ${id}:`, await res.text());
        alert(`Failed to delete insight ${id}`);
      }
    } catch (err) {
      console.error("Delete request error:", err);
      alert("Failed to delete insight due to network error");
    } finally {
      setLoadingIds(loadingIds.filter((x) => x !== id));
    }
  };

  return (
    <div className={cx(className)}>
      <h1 className={styles.heading}>Insights</h1>
      <div className={styles.list}>
        {insights?.length
          ? (
            insights.map(({ id, text, createdAt, brand }) => (
              <div className={styles.insight} key={id}>
                <div className={styles["insight-meta"]}>
                  <span>{brand}</span>
                  <div className={styles["insight-meta-details"]}>
                    <span>{new Date(createdAt).toLocaleString()}</span>
                    <Trash2Icon
                      className={styles["insight-delete"]}
                      onClick={() =>
                        deleteInsight(id)}
                    />
                  </div>
                </div>
                <p className={styles["insight-content"]}>{text}</p>
              </div>
            ))
          )
          : <p>We have no insight!</p>}
      </div>
    </div>
  );
};
