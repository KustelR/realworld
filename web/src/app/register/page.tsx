"use client";

import { getCookie, setCookie } from "cookies-next";

import ErrorMessages from "@/components/ErrorMessages";
import fetchClient from "@/lib/req/fetchClient";
import Link from "next/link";
import { FormEvent, useState } from "react";

interface RegistrationResult {
  user: {
    email: string;
    username: string;
    image: string;
    bio: string;
    token: string;
  };
}

export default function Page() {
  const [errors, setErrors] = useState<string[]>([]);
  return (
    <div className="auth-page">
      <div className="container page">
        <div className="row">
          <div className="col-md-6 offset-md-3 col-xs-12">
            <h1 className="text-xs-center">Sign up</h1>
            <p className="text-xs-center">
              <Link href="/login">Have an account?</Link>
            </p>
            <ErrorMessages messages={errors} />
            <AuthForm
              onSubmit={async (data) => {
                const response = await fetchClient("/users/", {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({ user: data }),
                });
                const result = await response.json();
                if (response.ok) {
                  setCookie("Authorization", `Token ${result.user.token}`);
                  window.location.href = `/profile/${result.user.username}`;
                } else {
                  const errorMessage = (result.detail as string).replaceAll(
                    `'`,
                    `"`,
                  );
                  console.log(errorMessage);
                  setErrors(JSON.parse(errorMessage));
                }
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

type AuthData = {
  username: string;
  email: string;
  password: string;
};

function AuthForm(props: { onSubmit?: (data: AuthData) => void } = {}) {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  return (
    <form
      onSubmit={(e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        props.onSubmit?.({
          username,
          email,
          password,
        });
      }}
    >
      <fieldset className="form-group">
        <input
          onChange={(e) => setUsername(e.target.value)}
          className="form-control form-control-lg"
          type="text"
          placeholder="Username"
        />
      </fieldset>
      <fieldset className="form-group">
        <input
          onChange={(e) => setEmail(e.target.value)}
          className="form-control form-control-lg"
          type="text"
          placeholder="Email"
        />
      </fieldset>
      <fieldset className="form-group">
        <input
          onChange={(e) => setPassword(e.target.value)}
          className="form-control form-control-lg"
          type="password"
          placeholder="Password"
        />
      </fieldset>
      <button className="btn btn-lg btn-primary pull-xs-right">Sign up</button>
    </form>
  );
}
