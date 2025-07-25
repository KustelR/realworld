import Link from "next/link";

export default function Page() {
  return (
    <div className="auth-page">
      <div className="container page">
        <div className="row">
          <div className="col-md-6 offset-md-3 col-xs-12">
            <h1 className="text-xs-center">Sign up</h1>
            <p className="text-xs-center">
              <Link href="/login">Have an account?</Link>
            </p>

            <ErrorMessages messages={["That email is already taken"]} />
            <AuthForm />
          </div>
        </div>
      </div>
    </div>
  );
}

function ErrorMessages(props: { messages: string[] }) {
  const { messages } = props;
  return (
    <ul className="error-messages">
      {messages.map((message, index) => (
        <li key={index}>{message}</li>
      ))}
    </ul>
  );
}

type AuthData = {
  username: string;
  email: string;
  password: string;
};

function AuthForm(props: { onSubmit?: (data: AuthData) => void } = {}) {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const data: AuthData = {
          username: formData.get("username") as string,
          email: formData.get("email") as string,
          password: formData.get("password") as string,
        };
        props.onSubmit?.(data);
      }}
    >
      <fieldset className="form-group">
        <input
          className="form-control form-control-lg"
          type="text"
          placeholder="Username"
        />
      </fieldset>
      <fieldset className="form-group">
        <input
          className="form-control form-control-lg"
          type="text"
          placeholder="Email"
        />
      </fieldset>
      <fieldset className="form-group">
        <input
          className="form-control form-control-lg"
          type="password"
          placeholder="Password"
        />
      </fieldset>
      <button className="btn btn-lg btn-primary pull-xs-right">Sign up</button>
    </form>
  );
}
