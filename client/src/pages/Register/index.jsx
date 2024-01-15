import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import InputGoogleLike from '@/components/custom/input/InputGoogleLike';
import { useErrorContext } from '@/context/ErrorProvider';
import { emailRegex } from '@/constant/regex';
import { register } from '@/api/authApi';

const Register = () => {
  const userRef = useRef();

  const { errors, addError, removeError } = useErrorContext();

  const [user, setUser] = useState('');
  const [success, setSuccess] = useState(false);

  // focus to email/username first loaded
  useEffect(() => {
    userRef.current.focus();
  }, []);

  const handleSubmit = async () => {
    // will disabled the register button
    setSuccess(true);

    if (!emailRegex.test(user)) {
      addError({
        title: 'Email Not Valid',
        text: 'Please enter valid email.',
        variant: 'red',
      });
      // will enabled the register button
      setSuccess(false);
      return;
    }

    try {
      const result = await register(user);

      if (result.status !== 200) {
        // add error message
        addError({
          title: 'Failed!',
          text: 'Sorry we failed to register your email.',
          variant: 'red',
        });
        setSuccess(false);
        return;
      }

      // add success message
      addError({
        title: 'Success!',
        text: 'Check your email to create password.',
        variant: 'green',
      });
    } catch (error) {
      // add error message
      addError({
        title: 'Failed!',
        text: 'Sorry we failed to register your email.',
        variant: 'red',
      });
      setSuccess(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="w-450 mx-auto flex h-screen items-center justify-center">
      <div className="w-450 flex h-auto flex-shrink-0 flex-col items-center rounded-lg border border-solid border-gray-300 bg-white p-12 transition duration-200">
        {/* <div>Logo</div> */}
        <form className="w-full" onKeyDown={handleKeyDown}>
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
            className={
              success
                ? 'my-2 w-full rounded-sm bg-slate-400 p-2 font-bold capitalize text-white transition duration-200'
                : 'my-2 w-full rounded-sm bg-green-400 p-2 font-bold capitalize text-white transition duration-200 hover:bg-green-500'
            }
            type="button"
            onClick={handleSubmit}
            disabled={success}
          >
            Register
          </button>
        </form>
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
