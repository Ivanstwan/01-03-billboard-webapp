import { useErrorContext } from '@/context/ErrorProvider';
import './style.css';

const ErrorNotification = () => {
  const { errors, addError, removeError } = useErrorContext();

  return errors ? (
    <div className="fixed bottom-0 right-0 flex flex-col items-end p-8">
      <div
        onClick={() => addError('new messagege lorem' + Date.now())}
        className="fixed left-0 top-20 cursor-pointer"
      >
        <span>add error</span>
      </div>
      {errors.map((error) => {
        return (
          <div className="animation-try flex">
            <span className="border border-solid border-red-500 p-4">
              {error.message}
            </span>
          </div>
        );
      })}
    </div>
  ) : (
    <></>
  );
};

export default ErrorNotification;
