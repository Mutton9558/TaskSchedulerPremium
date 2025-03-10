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
        id={`${type === "submit" ? "submit-btn" : ""}`}
        required={required}
      />
    </>
  );
};

export default InputBox;
