"use client";

import ErrorMessages from "@/components/ErrorMessages";
import LogoutButton from "@/components/LogoutButton";
import fetchFromAPI from "@/lib/req/fetchClient";
import { setCookie } from "cookies-next";
import { useState } from "react";

export default function Page() {
  const [errors, setErrors] = useState<string[]>([]);
  return (
    <div className="settings-page">
      <div className="container page">
        <div className="row">
          <div className="col-md-6 offset-md-3 col-xs-12">
            <h1 className="text-xs-center">Your Settings</h1>
            <ErrorMessages messages={errors} />
            <UpdateForm
              onSubmit={async (username, image, bio, email, password) => {
                const user = {
                  username,
                  image,
                  bio,
                  email,
                  password,
                };
                const userPatch = Object.fromEntries(
                  Object.entries(user).filter((entry) =>
                    Boolean(entry ? entry[1] : false),
                  ),
                );
                const response = await fetchFromAPI(`/user`, {
                  method: "PUT",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ user: userPatch }),
                });
                if (response.ok) {
                  const responseUser = (await response.json()).user;
                  setCookie("Authorization", `Token ${responseUser.token}`);
                  window.location.href = `/profile/${responseUser.username}`;
                } else {
                  const responseFail: FailedRequestBody = await response.json();
                  const errors: string[] = JSON.parse(
                    responseFail.detail.replaceAll("'", `"`),
                  );
                  setErrors(errors);
                }
              }}
            />
            <hr />
            <LogoutButton />
          </div>
        </div>
      </div>
    </div>
  );
}

function UpdateForm(props: {
  onSubmit: (
    name: string,
    image: string,
    bio: string,
    email: string,
    password: string,
  ) => void;
}) {
  const { onSubmit } = props;

  const [image, setImage] = useState("");
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(name, image, bio, email, password);
      }}
    >
      <fieldset>
        <fieldset className="form-group">
          <input
            onChange={(e) => {
              setImage(e.target.value);
            }}
            className="form-control"
            type="text"
            placeholder="URL of profile picture"
          />
        </fieldset>
        <fieldset className="form-group">
          <input
            onChange={(e) => {
              setName(e.target.value);
            }}
            className="form-control form-control-lg"
            type="text"
            placeholder="Your Name"
          />
        </fieldset>
        <fieldset className="form-group">
          <textarea
            onChange={(e) => {
              setBio(e.target.value);
            }}
            className="form-control form-control-lg"
            rows={8}
            placeholder="Short bio about you"
          ></textarea>
        </fieldset>
        <fieldset className="form-group">
          <input
            onChange={(e) => {
              setEmail(e.target.value);
            }}
            autoComplete="off"
            className="form-control form-control-lg"
            type="text"
            placeholder="Email"
          />
        </fieldset>
        <fieldset className="form-group">
          <input
            onChange={(e) => {
              setPassword(e.target.value);
            }}
            autoComplete="new-password"
            className="form-control form-control-lg"
            type="password"
            placeholder="New Password"
          />
        </fieldset>
        <button className="btn btn-lg btn-primary pull-xs-right">
          Update Settings
        </button>
      </fieldset>
    </form>
  );
}
