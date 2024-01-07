import './InputGoogleLike.scss';

const InputGoogleLike = ({
  label,
  value,
  onChange,
  type = 'text',
  name,
  myRef,
}) => {
  return (
    <div className="googlelike-input">
      <input
        type={type}
        placeholder=" "
        value={value}
        onChange={onChange}
        name={name}
        ref={myRef}
      />
      <div className="googlelike-input--label">{label}</div>
    </div>
  );
};

export default InputGoogleLike;
