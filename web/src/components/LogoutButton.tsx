"use client";

import { deleteCookie } from "cookies-next";

export default function LogoutButton() {
  return (
    <button
      className="btn btn-outline-danger"
      onClick={async () => {
        deleteCookie("Authorization");
        window.location.href = "/";
      }}
    >
      Or click here to logout.
    </button>
  );
}
