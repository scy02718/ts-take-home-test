import { useState } from "react";
import { BRANDS } from "../../lib/consts.ts";
import { Button } from "../button/button.tsx";
import { Modal, type ModalProps } from "../modal/modal.tsx";
import styles from "./add-insight.module.css";
import type { Insight } from "../../schemas/insight.ts";

type AddInsightProps = ModalProps & {
  onCreated: (newInsight: Insight) => void;
};

export const AddInsight = ({ onCreated, ...modalProps }: AddInsightProps) => {
  const [brand, setBrand] = useState<number>(BRANDS[0].id);
  const [text, setText] = useState("");

  const addInsight = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await fetch("/api/insights", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ brand, text }),
      });

      if (!res.ok) throw new Error("Failed to add insight");

      const newInsight: Insight = await res.json();
      onCreated(newInsight);
      modalProps.onClose?.();
    } catch (err) {
      console.error(err);
      alert("Failed to add insight");
    }
  };

  return (
    <Modal {...modalProps}>
      <h1 className={styles.heading}>Add a new insight</h1>
      <form className={styles.form} onSubmit={addInsight}>
        <label className={styles.field}>
          Brand
          <select
            className={styles["field-input"]}
            value={brand}
            onChange={(e) => setBrand(Number(e.target.value))}
          >
            {BRANDS.map(({ id, name }) => (
              <option key={id} value={id}>
                {name}
              </option>
            ))}
          </select>
        </label>
        <label className={styles.field}>
          Insight
          <textarea
            className={styles["field-input"]}
            rows={5}
            placeholder="Something insightful..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
        </label>
        <Button className={styles.submit} type="submit" label="Add insight" />
      </form>
    </Modal>
  );
};
