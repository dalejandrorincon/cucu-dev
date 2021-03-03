import React, { useRef, useEffect } from 'react'
import ReactFlagsSelect from 'react-flags-select';
import 'react-flags-select/css/react-flags-select.css';
import { useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next';

export default function LanguageSelector() {
	const { t, i18n } = useTranslation();
	const location = useLocation();
	const userFlag = useRef<any>();

	useEffect(() => {
		if (location.pathname == "/es") {
			i18n.changeLanguage("ES")
			userFlag.current?.updateSelected("ES")
			localStorage.setItem('lang', "ES")
		}

		if (location.pathname == "/en") {
			i18n.changeLanguage("US")
			userFlag.current?.updateSelected("US")
			localStorage.setItem('lang', "US")
		}
	}, [userFlag.current]);

	const onSelectFlag = (flag) =>{
		localStorage.setItem('lang', flag)	
		i18n.changeLanguage(flag)	
  	}

	return (
		<ReactFlagsSelect
            ref={userFlag}
            countries={["US", "ES"]}
            customLabels={{"US": "English","ES": "Español"}} 
            onSelect={(flag)=>{onSelectFlag(flag)}}
            defaultCountry={ localStorage.getItem("lang") ? localStorage.getItem("lang") : "US" }
        />
	)
}

