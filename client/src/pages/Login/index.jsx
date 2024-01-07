import { useContext, useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Login.scss';
import AuthContext from '@/context/AuthProvider';
import InputGoogleLike from '@/components/custom/input/InputGoogleLike';

const Login = () => {
  const userRef = useRef();
  const errRef = useRef();

  const [user, setUser] = useState('');
  const [pwd, setPwd] = useState('');
  const [errMsg, setErrMsg] = useState('');
  const [success, setSuccess] = useState(false);

  // focus to email/username first loaded
  useEffect(() => {
    userRef.current.focus();
  }, []);

  useEffect(() => {
    setErrMsg('');
  }, [user, pwd]);

  return (
    <div className="w-450 mx-auto flex h-screen items-center justify-center">
      <div className="w-450 flex h-auto flex-shrink-0 flex-col items-center rounded-lg border border-solid border-gray-300 bg-white p-12 transition duration-200">
        {/* <div>Logo</div> */}
        <form className="w-full">
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
            className="my-2 w-full rounded-sm bg-green-400 p-2 font-bold capitalize text-white transition duration-200 hover:bg-green-500"
            type="button"
            onClick={() => {
              console.log('login', user, pwd);
            }}
          >
            Login
          </button>
        </form>
        {errMsg && <p>{errMsg}</p>}
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
