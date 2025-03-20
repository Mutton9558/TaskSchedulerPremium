import "../App.css";

interface inputProps {
  type: string;
  placeholder: string;
  name: string;
  required: boolean;
}

const InputBox: React.FC<inputProps> = ({
  type,
  placeholder,
  name,
  required,
}) => {
  return (
    <>
      <input
        className="std-input"
        type={type}
        placeholder={placeholder}
        name={name}
        id={`${type === "submit" ? "submit-btn" : undefined}`}
        required={required}
        maxLength={
          name === "Username" ? 20 : name === "Password" ? 16 : undefined
        }
      />
    </>
  );
};

export default InputBox;
