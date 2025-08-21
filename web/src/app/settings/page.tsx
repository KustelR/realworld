import ErrorMessages from "@/components/ErrorMessages";
import LogoutButton from "@/components/LogoutButton";

export default function Page() {
  return (
    <div className="settings-page">
      <div className="container page">
        <div className="row">
          <div className="col-md-6 offset-md-3 col-xs-12">
            <h1 className="text-xs-center">Your Settings</h1>
            <ErrorMessages messages={["That name is required"]} />
            <UpdateForm />
            <hr />
            <LogoutButton />
          </div>
        </div>
      </div>
    </div>
  );
}

function UpdateForm() {
  return (
    <form>
      <fieldset>
        <fieldset className="form-group">
          <input
            className="form-control"
            type="text"
            placeholder="URL of profile picture"
          />
        </fieldset>
        <fieldset className="form-group">
          <input
            className="form-control form-control-lg"
            type="text"
            placeholder="Your Name"
          />
        </fieldset>
        <fieldset className="form-group">
          <textarea
            className="form-control form-control-lg"
            rows={8}
            placeholder="Short bio about you"
          ></textarea>
        </fieldset>
        <fieldset className="form-group">
          <input
            autoComplete="off"
            className="form-control form-control-lg"
            type="text"
            placeholder="Email"
          />
        </fieldset>
        <fieldset className="form-group">
          <input
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
