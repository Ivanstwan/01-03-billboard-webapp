import { useContext, useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import './Login.scss';
import AuthContext from '@/context/AuthProvider';
import InputGoogleLike from '@/components/custom/input/InputGoogleLike';
import { emailRegex } from '@/constant/regex';
import { useErrorContext } from '@/context/ErrorProvider';
import { login } from '@/api/authApi';

const Login = () => {
  // Redirect to intended page, after login
  // e.g. accessing /home -> login -> redirect to /home again
  const location = useLocation();
  const { from } = location.state || { from: { pathname: '/' } };

  // To set context auth after login
  const { setAuth } = useContext(AuthContext);
  const navigate = useNavigate();
  const userRef = useRef();

  // For adding error message
  const { errors, addError, removeError } = useErrorContext();

  const [user, setUser] = useState('');
  const [pwd, setPwd] = useState('');
  const [success, setSuccess] = useState(false);

  // focus to email/username first loaded
  useEffect(() => {
    userRef.current.focus();
  }, []);

  const handleLogin = async () => {
    // will disabled the register button
    setSuccess(true);

    if (!pwd || !user) {
      addError({
        title: 'Email/Password field empty',
        text: 'Please enter email or password.',
        variant: 'red',
      });
      // will enabled the register button
      setSuccess(false);
      return;
    }

    if (!emailRegex.test(user)) {
      addError({
        title: 'Email Not Valid',
        text: 'Please enter valid email.',
        variant: 'red',
      });
      // will enabled the login button
      setSuccess(false);
      return;
    }

    try {
      const result = await login(user, pwd);

      if (result.status === 401) {
        // add error message
        addError({
          title: 'Failed to login',
          text: 'Username/password wrong.',
          variant: 'red',
        });
        // will enabled the login button
        setSuccess(false);
        return;
      }

      if (result.status !== 200) {
        // add error message
        addError({
          title: 'Failed!',
          text: 'Sorry failed to login.',
          variant: 'red',
        });
        // will enabled the login button
        setSuccess(false);
        return;
      }

      const { username, email, img, accessToken } = result.data;

      // set access token in local storage
      localStorage.setItem('access_token', accessToken);

      setAuth({ username, email, img });
      // add success message
      addError({
        title: 'Success!',
        text: 'Login successful.',
        variant: 'green',
      });

      // If user redirected to 'login', because accessing private route, after login redirect back to that route
      if (from.pathname !== '/') {
        return navigate(from.pathname);
      }
      return navigate('/listing');
    } catch (error) {
      // add error message
      addError({
        title: 'Failed!',
        text: 'Sorry failed to login.',
        variant: 'red',
      });
      // will enabled the login button
      setSuccess(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleLogin();
    }
  };

  return (
    <div className="w-450 mx-auto flex h-screen items-center justify-center">
      <div className="w-450 flex h-auto flex-shrink-0 flex-col items-center rounded-lg border border-solid border-gray-300 bg-white p-12 transition duration-200">
        {/* <div>Logo</div> */}
        <form className="w-full" onKeyDown={handleKeyDown}>
          <div className="pb-6 text-2xl font-semibold">Sign in</div>
          <div className="py-2">
            <InputGoogleLike
              type="email"
              myRef={userRef}
              onChange={(e) => setUser(e.target.value)}
              value={user}
              label="Email"
              name="email"
            />
          </div>
          <div className="py-2">
            <InputGoogleLike
              type="password"
              onChange={(e) => setPwd(e.target.value)}
              value={pwd}
              label="Password"
              name="password"
            />
          </div>
          <button
            className={
              success
                ? 'my-2 w-full rounded-sm bg-slate-400 p-2 font-bold capitalize text-white transition duration-200'
                : 'my-2 w-full rounded-sm bg-green-400 p-2 font-bold capitalize text-white transition duration-200 hover:bg-green-500'
            }
            type="button"
            onClick={handleLogin}
            disabled={success}
          >
            Login
          </button>
        </form>
        <span className="pt-8 text-base">
          Don&apos;t have an account? go{' '}
          <Link to="/register" className="font-semibold">
            Register
          </Link>
        </span>
      </div>
    </div>
  );
};

export default Login;
