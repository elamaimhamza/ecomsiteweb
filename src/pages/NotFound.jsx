import React from "react";
import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div>
      Not found <Link to={"/"}>Go to home page</Link>
    </div>
  );
}
