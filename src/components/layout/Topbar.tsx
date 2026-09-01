"use client";
import { useState } from "react";
import Link from "next/link";

type TopbarProps = {
  onMenuClick?: () => void;
};

export function Topbar({ onMenuClick }: TopbarProps) {
  return (
    <header className="h-16 border-b bg-background/70 backdrop-blur flex items-center px-4 md:pl-72 fixed top-0 inset-x-0 z-30">
      <button className="md:hidden mr-3" onClick={onMenuClick} aria-label="Open menu">
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>
      <div className="font-semibold">Dashboard</div>
      <div className="ml-auto flex items-center gap-3">
        <Link 
          href="/linktree" 
          className="rounded-md px-3 py-1 text-sm hover:bg-muted transition-colors"
        >
          Linktree
        </Link>
        <button className="rounded-md px-3 py-1 text-sm hover:bg-muted">Help</button>
        <div className="w-8 h-8 rounded-full bg-muted" />
      </div>
    </header>
  );
}


