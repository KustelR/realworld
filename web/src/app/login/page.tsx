"use client";

import ErrorMessages from "@/components/ErrorMessages";
import fetchClient from "@/lib/req/fetchClient";
import { setCookie } from "cookies-next";
import Link from "next/link";
import { useRef, useState } from "react";

export default function Page() {
  const [errors, setErrors] = useState<string[]>([]);
  return (
    <div className="auth-page">
      <div className="container page">
        <div className="row">
          <div className="col-md-6 offset-md-3 col-xs-12">
            <h1 className="text-xs-center">Sign in</h1>
            <p className="text-xs-center">
              <Link href="/register">Need an account?</Link>
            </p>
            <ErrorMessages messages={errors} />
            <LoginForm
              onSubmit={async (data) => {
                let user: User & AuthActionResult;
                try {
                  user = (await login(data.email, data.password)).user;
                } catch (e) {
                  if (!(e instanceof Error)) throw e;
                  setErrors([e.message]);
                  return;
                }
                if (user) {
                  setCookie("Authorization", `Token ${user.token}`);
                  window.location.href = `/profile/${user.username}`;
                }
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

type LoginData = {
  email: string;
  password: string;
};

function LoginForm(props: { onSubmit: (data: LoginData) => void }) {
  const email = useRef<HTMLInputElement | null>(null);
  const password = useRef<HTMLInputElement | null>(null);
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        const emailValue = email?.current?.value;
        const passwordValue = password?.current?.value;
        const data: LoginData = {
          email: emailValue ?? "",
          password: passwordValue ?? "",
        };
        props.onSubmit(data);
      }}
    >
      <fieldset className="form-group">
        <input
          ref={email}
          className="form-control form-control-lg"
          type="text"
          name="login"
          placeholder="Email"
        />
      </fieldset>
      <fieldset className="form-group">
        <input
          ref={password}
          className="form-control form-control-lg"
          type="password"
          name="password"
          placeholder="Password"
        />
      </fieldset>
      <button className="btn btn-lg btn-primary pull-xs-right">Sign in</button>
    </form>
  );
}

async function login(
  email: string,
  password: string,
): Promise<{ user: User & AuthActionResult }> {
  const response = await fetchClient("/users/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ user: { email, password } }),
  });
  if (!response.ok) {
    const message = (await response.json()).detail;
    throw new Error(message);
  }
  return response.json();
}
