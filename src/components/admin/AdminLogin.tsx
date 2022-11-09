import { useState, useEffect } from "react";
import '../../style/AdminLogin.css';
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import Constants from "../../util/Constants";
import axios from "axios";
import { useAppDispatch } from '../../app/hooks';
import { loginAdmin } from '../../reducers/adminSlice';
import TricLogo from '../../util/icons/TRIC.svg';

type State = {
  redirect: string | null,
  username: string,
  password: string,
  loading: boolean,
  message: string,
  overrider: boolean
};

const Login = () => {
  const API_URL = Constants.BASE_URL + 'api/auth/';
  const [state, setState] = useState<State>({
    redirect: null,
    username: "",
    password: "",
    loading: false,
    message: "",
    overrider: false,
  });
  const dispatch = useAppDispatch();

  const validationSchema = () => {
    return Yup.object().shape({
      username: Yup.string().required("This field is required!"),
      password: Yup.string().required("This field is required!"),
    });
  }

  const login = (username: string, password: string) => {
    return axios
      .post(API_URL + "signin", {
        username,
        password
      })
      .then(response => {
        if (response.data.accessToken) {
          dispatch(loginAdmin(response.data))
        }
        return response.data;
      });
  }

  const handleLogin = (formValue: { username: string; password: string }) => {
    const { username, password } = formValue;

    setState({ ...state, message: "", loading: true });
    login(username, password).then(
      () => {
        setState({ ...state, redirect: "/admin", overrider: true });
      },
      error => {
        const resMessage =
          (error.response &&
            error.response.data &&
            error.response.data.message) ||
          error.message ||
          error.toString();
        setState({ ...state, loading: false, message: resMessage });
      }
    );
  }
  
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const cacheImages = async (srcArray) => {
    const promises = await srcArray.map((src) => {
      return new Promise(function (resolve, reject) {
        const img = new Image();
        img.src = src;

      });
    });
    await Promise.all(promises);
    setIsLoading(false);
  };

  useEffect(() => {
    if (state.redirect && state.overrider) {
      setState({ ...state, overrider: false });
      window.location.href = state.redirect ?? '/admin';
    }
  }, [state])

  useEffect(() => {
    const imgs = [
      TricLogo
    ]

    cacheImages(imgs);
  }, []);

  const { loading, message } = state;
  const initialValues = {
    username: "",
    password: "",
  };

  return (
    <div className="admin-login">
      <div className="admin-login__image">
        {isLoading ? (<></> ) : 
        (<img
          src={TricLogo}
          alt="Tric logo" />)
          }
      </div>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleLogin}>
        <Form className="admin-login__form">
          <div className="admin-login__login-field">
            <label htmlFor="username" className="admin-login__login-label">{Constants.USERNAME_FIELD}</label>
            <Field name="username" type="text" className="admin-login__field" e2e-id="usernameAdmin" />
            <ErrorMessage
              name="username"
              component="div"
              className="admin-login__error-message"
            />
          </div>
          <div className="admin-login__login-field">
            <label htmlFor="password" className="admin-login__login-label">{Constants.PASSWORD_FIELD}</label>
            <Field name="password" type="password" className="admin-login__field" e2e-id="passwordAdmin" />
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

export default Login;