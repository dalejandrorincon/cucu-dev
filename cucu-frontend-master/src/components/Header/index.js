

import React, { useState, useEffect } from "react";
import { Container, Nav, Navbar } from "react-bootstrap";
import {
	NavDropdown,
	Alert,
} from "react-bootstrap";
import { logout } from "../../utils/session";
import { Link, useHistory, useLocation } from "react-router-dom";
import Notifications from "../Notifications/";
import { useTranslation } from 'react-i18next';

import ReactFlagsSelect from 'react-flags-select';
import 'react-flags-select/css/react-flags-select.css';

export default function Header() {

	const history = useHistory();
	const [options, setOptions] = useState(null);
	const [profileLink, setProfileLink] = useState(null);
	const location = useLocation()
	const { t, i18n } = useTranslation();
	  
	const onSelectFlag = (flag) =>{
		localStorage.setItem('lang', flag)	
		i18n.changeLanguage(flag)	
		getOptions()
	}

	const getOptions = () => {

		let role = localStorage.getItem("role")
		let content
		let link

		//console.log(role)

		switch (role) {
			case "1":
				link = null
				break;
			case "2":
				link = 
				<NavDropdown.Item
					onClick={() => history.push("/profile-translator-edit") }>
					<Link>{t('menu.profile')}</Link>
				</NavDropdown.Item>
				break;
			default:
				link =
				<NavDropdown.Item
					onClick={() => history.push("/profile-client")}>
					<Link>{t('menu.profile')}</Link>
				</NavDropdown.Item>
		}

		setProfileLink(link)



		switch (role) {
			case "1":
				content = null
				break;
			case "2":
				content =

					<>
						<Nav.Link className="item-menu" href="/services">
						<p className="text-item-menu">{t('menu.requests')}</p>
						</Nav.Link>
						<Nav.Link className="item-menu" href="/transactions">
						<p className="text-item-menu">{t('menu.transactions')}</p>
						</Nav.Link>
						<Nav.Link className="item-menu" href="/availabilities">
						<p className="text-item-menu">{t('menu.schedule')}</p>
						</Nav.Link>
					</>
				break;
			default:
				content =
					<>
						<Nav.Link className="item-menu" href="/translators">
							<p className="text-item-menu">{t('menu.translators')}</p>
						</Nav.Link>
						<Nav.Link className="item-menu" href="/services">
							<p className="text-item-menu">{t('menu.my-requests')}</p>
						</Nav.Link>
					</>
		}	
		setOptions(content)

	}

	useEffect(() => {
		getOptions()
	}, []);

	return (
		<>
		{ localStorage.getItem("approved") == "0" && localStorage.getItem("role") =="2"  ?                
            <Alert variant="danger" className="alert-approved">
                {t('must-fill-profile')}
            </Alert>
            :null
		}
		<nav className="navbar navbar-expand-md layout">
			<Container>
				<Navbar expand="lg">
				<Link className="navbar-brand" to="/">
					<img src="/assets/images/logo.png" alt="logo" />
				</Link>
				<Navbar.Toggle aria-controls="basic-navbar-nav" />
  				<Navbar.Collapse id="basic-navbar-nav">
				  	<Nav defaultActiveKey={location.pathname} className="	 mr-auto">
						{options}
						<Nav.Link className="item-menu mobile-item" href={ localStorage.getItem("role")=="2" ? "/profile-translator-edit" : "/profile-client" }>
							<p className="text-item-menu">{t('menu.profile')}</p>
						</Nav.Link>
						<Nav.Link 
							className="item-menu mobile-item"
							onClick={() => {
								logout();
								history.push("/");
							}}
						>
							<p>
								{t('menu.log-out')}
							</p>
						</Nav.Link>
					</Nav>
				</Navbar.Collapse>
				<ReactFlagsSelect
					countries={["US", "ES"]}
					customLabels={{"US": "English","ES": "Español"}} 
					onSelect={(flag)=>{onSelectFlag(flag)}}
					defaultCountry={ localStorage.getItem("lang") ? localStorage.getItem("lang") : "US" }
				/>
				<ul className="navbar-nav">
					<li className="nav-item ">
						<Notifications></Notifications>
					</li>
				</ul>
				<ul className="navbar-nav desktop-item">
					<img
						src={ localStorage.getItem("image_url") &&  localStorage.getItem("image_url")!="null"?
							localStorage.getItem("image_url"):
							"/assets/images/no_avatar_default.png"}
						className="ico-user"
					/>
					<NavDropdown
						title={localStorage.getItem("userName")}
						id="nav-dropdown"
					>
						{profileLink}
						
						<NavDropdown.Item
							onClick={() => {
								logout();
								history.push("/");
							}}>
							<Link>
								{t('menu.log-out')}
                        	</Link>
						</NavDropdown.Item>
					</NavDropdown>
					
				</ul>
				</Navbar>
			</Container>
		</nav>
		</>
	);
}

