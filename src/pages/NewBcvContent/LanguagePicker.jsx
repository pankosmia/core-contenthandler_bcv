import { PanLanguagePicker } from "pankosmia-rcl";
export default function LanguagePicker({ setCurrentLanguage, currentLanguage, setIsValid }) {

    return (
        <PanLanguagePicker
            currentLanguage={currentLanguage}
            setCurrentLanguage={setCurrentLanguage}
            setIsValid={setIsValid}
        />
    )
}