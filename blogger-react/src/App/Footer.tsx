import { strings } from "../localization";
import LangPicker from "../components/LangPicker";

export default function Footer() {
  return (
    <footer className="footer">
      <hr className="divider" />
      {strings.builtWithReact}
      &nbsp;
      <LangPicker />
    </footer>
  );
}
