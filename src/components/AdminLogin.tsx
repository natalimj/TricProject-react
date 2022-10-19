import { Component } from "react";
import { Navigate } from "react-router-dom";
import '../style/AdminLogin.css';
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";

import AuthService from "../services/auth.service";
import Constants from "../util/Constants";

type Props = {};

type State = {
  redirect: string | null,
  username: string,
  password: string,
  loading: boolean,
  message: string,
  overrider: boolean
};

export default class Login extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.handleLogin = this.handleLogin.bind(this);

    this.state = {
      redirect: null,
      username: "",
      password: "",
      loading: false,
      message: "",
      overrider: false,
    };
  }

  componentDidMount() {
    const currentUser = AuthService.getCurrentUser();

    if (currentUser) {
      console.log("SEEING IT AS CURRECT USER")
      this.setState({ redirect: "/admin" });
    };
  }

  componentWillUnmount() {
    window.location.reload();
  }

  validationSchema() {
    return Yup.object().shape({
      username: Yup.string().required("This field is required!"),
      password: Yup.string().required("This field is required!"),
    });
  }

  handleLogin(formValue: { username: string; password: string }) {
    const { username, password } = formValue;

    this.setState({
      message: "",
      loading: true
    });


    AuthService.login(username, password).then(
      () => {
        this.setState({
          redirect: "/admin",
          overrider: true
        });
      },
      error => {
        const resMessage =
          (error.response &&
            error.response.data &&
            error.response.data.message) ||
          error.message ||
          error.toString();

        this.setState({
          loading: false,
          message: resMessage
        });
      }
    );
  }

  render() {
    if (this.state.redirect && this.state.overrider) {
      this.setState({overrider: false});
      return <Navigate to={this.state.redirect} />
    }

    const { loading, message } = this.state;

    const initialValues = {
      username: "",
      password: "",
    };

    return (
      <div className="admin-login">
        <img
          /*todo: change to app logo*/
          src="//ssl.gstatic.com/accounts/ui/avatar_2x.png"
          alt="profile-img"
          className="admin-login__image"
        />
        <Formik
          initialValues={initialValues}
          validationSchema={this.validationSchema}
          onSubmit={this.handleLogin}>
          <Form className="admin-login__form">
            <div className="admin-login__login-field">
              <label htmlFor="username" className="admin-login__login-label">{Constants.USERNAME_FIELD}</label>
              <Field name="username" type="text" className="admin-login__field" e2e-id="usernameAdmin"/>
              <ErrorMessage
                name="username"
                component="div"
                className="admin-login__error-message"
              />
            </div>
            <div className="admin-login__login-field">
              <label htmlFor="password" className="admin-login__login-label">{Constants.PASSWORD_FIELD}</label>
              <Field name="password" type="password" className="admin-login__field" e2e-id="passwordAdmin"/>
              <ErrorMessage
                name="password"
                component="div"
                className="admin-login__error-message"
              />
            </div>
            <div className="admin-login__login-field">
              <button type="submit" className="admin-login__submit-button" disabled={loading} e2e-id="login">
                <span className="admin-login__submit__button--text">{Constants.SUBMIT_BUTTON}</span>
              </button>
            </div>
            {message && (
              <div className="admin-login__message-body">
                <div className="admin-login__error-message" role="alert">
                  {message}
                </div>
              </div>
            )}
          </Form>
        </Formik>
      </div>
    );
  }
}