import { useState, useRef, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import InputGoogleLike from '@/components/custom/input/InputGoogleLike';
import { registerUser } from '@/api/authApi';
import { useErrorContext } from '@/context/ErrorProvider';

const RegisterPhase2 = () => {
  const navigate = useNavigate();
  const pwdRef = useRef();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const token = params.get('token');

  const { errors, addError, removeError } = useErrorContext();

  const [pwd, setPwd] = useState('');
  const [success, setSuccess] = useState(false);

  // focus to email/username first loaded
  useEffect(() => {
    pwdRef.current.focus();
  }, []);

  const handleSubmit = async () => {
    // will disabled the register button
    setSuccess(true);

    const passwordRegex = /^.{8,64}$/;

    if (!passwordRegex.test(pwd)) {
      addError({
        title: 'Password Not Valid',
        text: 'Please enter a password between 8 and 64 characters.',
        variant: 'red',
      });
      // will enabled the register button
      setSuccess(false);
      return;
    }

    try {
      const result = await registerUser(pwd, token);

      if (result.status !== 200) {
        // add error message
        addError({
          title: 'Failed!',
          text: 'Sorry we failed to register your email.',
          variant: 'red',
        });
        return;
      }

      // add success message
      addError({
        title: 'Success!',
        text: 'Account created.',
        variant: 'green',
      });
      return navigate('/login');
    } catch (error) {
      // add error message
      addError({
        title: 'Failed!',
        text: 'Sorry we failed to register your email.',
        variant: 'red',
      });
    }
  };

  return (
    <div className="w-450 mx-auto flex h-screen items-center justify-center">
      <div className="w-450 flex h-auto flex-shrink-0 flex-col items-center rounded-lg border border-solid border-gray-300 bg-white p-12 transition duration-200">
        {/* <div>Logo</div> */}
        <form className="w-full">
          <div className="pb-6 text-2xl font-semibold">Set your password</div>
          <div className="py-2">
            <InputGoogleLike
              type="password"
              myRef={pwdRef}
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
            onClick={handleSubmit}
            disabled={success}
          >
            Set Password
          </button>
        </form>
      </div>
    </div>
  );
};

export default RegisterPhase2;
