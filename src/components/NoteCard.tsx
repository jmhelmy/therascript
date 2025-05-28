"use client"; // optional if you later add interactivity

import Link from "next/link";
import styles from "./NoteCard.module.css";

export interface NoteCardProps {
  id: string;
  date: Date;
  clientInitials?: string;
  summary?: string;
}

export function NoteCard({ id, date, clientInitials, summary }: NoteCardProps) {
  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <h3 className={styles.title}>
          Session:{" "}
          {date.toLocaleDateString(undefined, {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </h3>
        <span className={styles.time}>
          {date.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
          })}
        </span>
      </div>

      {clientInitials && clientInitials !== "N/A" && (
        <p className={styles.client}>Client: {clientInitials}</p>
      )}

      <p className={styles.summary}>{summary || "No summary available."}</p>

      <Link href={`/notes/${id}`} className={styles.link}>
        View Details →
      </Link>
    </div>
  );
}
