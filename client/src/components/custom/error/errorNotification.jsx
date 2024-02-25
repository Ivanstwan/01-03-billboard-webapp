import { useErrorContext } from '@/context/ErrorProvider';
import './style.css';

const ErrorNotification = () => {
  const { errors, addError, removeError } = useErrorContext();

  return errors ? (
    <div className="pointer-events-none fixed bottom-[2rem] right-0 z-50 flex flex-col items-end gap-2 p-8 transition-all">
      {errors.map((error) => {
        switch (error.variant) {
          case 'red':
            return (
              <div className="animation-try">
                <div className="flex rounded-md border border-solid bg-red-600 px-6 py-4 shadow-lg">
                  <div className="grid gap-1">
                    <div className="text-lg font-semibold text-white [&+div]:text-sm">
                      {error.title || 'Error'}
                    </div>
                    {error.text && (
                      <div className="text-base text-white opacity-90">
                        {error.text}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );

          case 'green':
            return (
              <div className="animation-try">
                <div className="flex rounded-md border border-solid bg-green-600 px-6 py-4 shadow-lg">
                  <div className="grid gap-1">
                    <div className="text-lg font-semibold text-white [&+div]:text-sm">
                      {error.title || 'Error'}
                    </div>
                    {error.text && (
                      <div className="text-base text-white opacity-90">
                        {error.text}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );

          case 'normal':
          default:
            return (
              <div className="animation-try">
                <div className="flex rounded-md border border-solid bg-white px-6 py-4 shadow-lg">
                  <div className="grid gap-1">
                    <div className="text-lg font-semibold [&+div]:text-sm">
                      {error.title}
                    </div>
                    {error.text && (
                      <div className="text-base opacity-90">{error.text}</div>
                    )}
                  </div>
                </div>
              </div>
            );
        }
      })}
    </div>
  ) : (
    <></>
  );
};

export default ErrorNotification;
