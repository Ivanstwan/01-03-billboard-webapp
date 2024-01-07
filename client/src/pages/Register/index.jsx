import { useContext, useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthContext from '@/context/AuthProvider';
import InputGoogleLike from '@/components/custom/input/InputGoogleLike';

const Register = () => {
  const userRef = useRef();

  const [user, setUser] = useState('');
  const [errMsg, setErrMsg] = useState('');
  const [success, setSuccess] = useState(false);

  // focus to email/username first loaded
  useEffect(() => {
    userRef.current.focus();
  }, []);

  useEffect(() => {
    setErrMsg('');
  }, [user]);

  return (
    <div className="w-450 mx-auto flex h-screen items-center justify-center">
      <div className="w-450 flex h-auto flex-shrink-0 flex-col items-center rounded-lg border border-solid border-gray-300 bg-white p-12 transition duration-200">
        {/* <div>Logo</div> */}
        <form className="w-full">
          <div className="pb-6 text-2xl font-semibold">Register</div>
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
          <button
            className="my-2 w-full rounded-sm bg-green-400 p-2 font-bold capitalize text-white transition duration-200 hover:bg-green-500"
            type="button"
            onClick={() => {
              console.log('register', user);
            }}
          >
            Register
          </button>
        </form>
        {errMsg && <p>{errMsg}</p>}
        <span className="pt-8 text-base">
          Already have an account? go{' '}
          <Link to="/login" className="font-semibold">
            Sign In
          </Link>
        </span>
      </div>
    </div>
  );
};

export default Register;
