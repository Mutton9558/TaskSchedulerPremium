import "../App.css";

interface inputProps {
  type: string;
  placeholder: string;
  name: string;
}

const InputBox: React.FC<inputProps> = ({ type, placeholder, name }) => {
  return (
    <>
      <input
        className="std-input"
        type={type}
        placeholder={placeholder}
        name={name}
        id={`${type === "submit" ? "submit-btn" : ""}`}
      />
    </>
  );
};

export default InputBox;
