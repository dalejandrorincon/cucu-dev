
import React, { useEffect, useState } from "react";
import { AlertList, Alert, AlertContainer } from "react-bs-notifier";

export function NotifierGenerator(props) {
	const [position, setPosition] = React.useState("bottom-right");
	const [alerts, setAlerts] = React.useState([]);
	const [alertTimeout, setAlertTimeout] = React.useState(5000);
	const [newMessage, setNewMessage] = React.useState(
		"This is a test of the Emergency Broadcast System. This is only a test."
	);

	const generate = React.useCallback(
		alert => {
			setAlerts(alerts => [
				...alerts,
				{
					id: new Date().getTime(),
					type: alert.type,
					headline: alert.message,
					message: ""
				}
			]);
		},
		[newMessage]
	);

	const onDismissed = React.useCallback(alert => {
		setAlerts(alerts => {
			const idx = alerts.indexOf(alert);
			if (idx < 0) return alerts;
			return [...alerts.slice(0, idx), ...alerts.slice(idx + 1)];
		});
	}, []);

    const clearAlerts = React.useCallback(() => setAlerts([]), []);
    
    useEffect(() => {
        if(props.alert.type && props.alert.message){
            generate(props.alert)
        }
	}, [
		props.alert,
	]);

	return (
		<>
			<AlertList
				position={position}
				alerts={alerts}
				timeout={alertTimeout}
				dismissTitle="Begone!"
				onDismiss={onDismissed}
			/>
		</>
	);
}
