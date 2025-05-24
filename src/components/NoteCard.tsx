// src/components/NoteCard.tsx
"use client"; // Keep this if you plan to add client-side interactions later, otherwise optional for purely presentational

import Link from "next/link";

export interface NoteCardProps {
  id: string;
  date: Date; // Assuming this is a JS Date object
  clientInitials?: string; // Made optional
  summary?: string;      // Made optional
}

export function NoteCard({ id, date, clientInitials, summary }: NoteCardProps) {
  return (
    <div className="p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 ease-in-out border border-slate-200">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-3">
        <h3 className="text-lg font-semibold text-[#009DA3] mb-1 sm:mb-0">
          Session: {date.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
        </h3>
        <span className="text-xs text-slate-500 pt-1">
          {date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })}
        </span>
      </div>

      {clientInitials && clientInitials !== 'N/A' && (
        <p className="mb-2 text-sm text-slate-600">
          Client: {clientInitials}
        </p>
      )}
      <p className="text-sm leading-relaxed text-slate-700 line-clamp-3 mb-4">
        {summary || "No summary available."}
      </p>

      <Link
        href={`/notes/${id}`}
        className="inline-block text-sm font-medium text-[#009DA3] hover:text-[#007c80] transition-colors duration-150"
      >
        View Details &rarr;
      </Link>
    </div>
  );
}