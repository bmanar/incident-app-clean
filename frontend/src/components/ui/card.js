import React from "react";
import "./card.css";

export function Card({ children, style }) {
  return (
    <div className="custom-card" style={style}>
      {children}
    </div>
  );
}

export function CardContent({ children, style }) {
  return (
    <div className="custom-card-content" style={style}>
      {children}
    </div>
  );
}
