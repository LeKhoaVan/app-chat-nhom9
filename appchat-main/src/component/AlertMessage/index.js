

function AlertMessage( {info }) {
	return info === null ? null : (
		//<Alert variant={info.type}>{info.message}</Alert>
		<>
			<p>{info.message}</p>
		</>
		
	)
}

export default AlertMessage;