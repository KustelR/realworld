"use client";

import ErrorMessages from "@/components/ErrorMessages";
import Link from "next/link";

export default function Page() {
  return (
    <div className="auth-page">
      <div className="container page">
        <div className="row">
          <div className="col-md-6 offset-md-3 col-xs-12">
            <h1 className="text-xs-center">Sign in</h1>
            <p className="text-xs-center">
              <Link href="/register">Need an account?</Link>
            </p>
            <ErrorMessages messages={["That email is already taken"]} />
            <LoginForm onSubmit={(data) => console.log(data)} />
          </div>
        </div>
      </div>
    </div>
  );
}

type LoginData = {
  login: string;
  password: string;
};

function LoginForm(props: { onSubmit: (data: LoginData) => void }) {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const data: LoginData = {
          login: formData.get("login") as string,
          password: formData.get("password") as string,
        };
        props.onSubmit(data);
      }}
    >
      <fieldset className="form-group">
        <input
          className="form-control form-control-lg"
          type="text"
          name="login"
          placeholder="Email"
        />
      </fieldset>
      <fieldset className="form-group">
        <input
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
