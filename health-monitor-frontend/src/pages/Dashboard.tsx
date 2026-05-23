import { Container, Row, Col } from "react-bootstrap"
import { useEffect, useState } from "react"
import { io } from "socket.io-client"

import HealthCard from "../components/HealthCard"
import ECGChart from "../components/ECGChart"
import HealthScore from "../components/HealthScore"
import TrendChart from "../components/TrendChart"
import DeviceStatus from "../components/DeviceStatus"

const socket = io("http://localhost:5000")

function Dashboard(){

const [data,setData] = useState({
hr:0,
spo2:0,
temp:0,
height:0,
sys:0,
dia:0,
pulse:0
})

const [history,setHistory] = useState({
hr:[],
spo2:[],
temp:[],
pulse:[]
})

useEffect(()=>{

socket.on("sensorData",(msg:any)=>{

const value=parseFloat(msg.value)

setData(prev=>{
const d={...prev}

if(msg.topic==="health/hr") d.hr=value
if(msg.topic==="health/spo2") d.spo2=value
if(msg.topic==="health/temp") d.temp=value
if(msg.topic==="health/height") d.height=value
if(msg.topic==="health/sys") d.sys=value
if(msg.topic==="health/dia") d.dia=value
if(msg.topic==="health/pulse") d.pulse=value

return d
})

setHistory(prev=>{

const h={...prev}

if(msg.topic==="health/hr")
h.hr=[...prev.hr,value].slice(-30)

if(msg.topic==="health/spo2")
h.spo2=[...prev.spo2,value].slice(-30)

if(msg.topic==="health/temp")
h.temp=[...prev.temp,value].slice(-30)

if(msg.topic==="health/pulse")
h.pulse=[...prev.pulse,value].slice(-30)

return h
})

})

},[])

return(

<Container fluid className="dashboard">

{/* FLOATING MEDICAL BACKGROUND ICONS */}

<div className="floating-icons">

<svg className="icon-float ecg-icon" viewBox="0 0 200 100">
<polyline
points="0,50 40,50 50,30 60,70 70,20 80,50 200,50"
fill="none"
stroke="#0077ff"
strokeWidth="3"
/>
</svg>

<svg className="icon-float cross-icon" viewBox="0 0 100 100">
<rect x="40" y="10" width="20" height="80" fill="#00c853"/>
<rect x="10" y="40" width="80" height="20" fill="#00c853"/>
</svg>

<svg className="icon-float stetho-icon" viewBox="0 0 100 100">
<circle cx="30" cy="70" r="10" stroke="#0077ff" strokeWidth="4" fill="none"/>
<path d="M30 60 V30 C30 20 40 20 40 30 V60" stroke="#0077ff" strokeWidth="4" fill="none"/>
<circle cx="70" cy="70" r="8" fill="#0077ff"/>
</svg>

</div>


{/* HEADER */}

<div className="header">

<h1 className="title">
Health Monitoring System
</h1>

{/* ECG HEADER ANIMATION */}

<div className="ecg-header-container">

<svg className="ecg-header" viewBox="0 0 600 100">

<polyline
points="
0,50
40,50
60,20
80,80
100,30
120,50
200,50
240,50
260,20
280,80
300,30
320,50
400,50
440,50
460,20
480,80
500,30
520,50
600,50
"
fill="none"
stroke="#00ffa6"
strokeWidth="3"
/>

</svg>

</div>

<DeviceStatus/>

</div>


{/* AI SCORE + TREND */}

<Row className="dashboard-top">

<Col md={3}>

<HealthScore data={data}/>

</Col>

<Col md={9}>

<div className="trend-panel">

<h4>24 Hour Trend</h4>

<div className="trend-chart">

<TrendChart history={history}/>

</div>

</div>

</Col>

</Row>


{/* HEALTH CARDS */}

<Row className="cards-grid">

<Col md={3}>
<HealthCard title="Heart Rate" value={data.hr} unit="bpm" icon="heart" history={history.hr}/>
</Col>

<Col md={3}>
<HealthCard title="SpO2" value={data.spo2} unit="%" icon="oxygen" history={history.spo2}/>
</Col>

<Col md={3}>
<HealthCard title="Temperature" value={data.temp} unit="°C" icon="temp" history={history.temp}/>
</Col>

<Col md={3}>
<HealthCard title="Pulse" value={data.pulse} unit="bpm" icon="pulse" history={history.pulse}/>
</Col>

<Col md={3}>
<HealthCard title="Height" value={data.height} unit="cm" icon="height" history={[]}/>
</Col>

<Col md={3}>
<HealthCard title="Systolic BP" value={data.sys} unit="mmHg" icon="bp" history={[]}/>
</Col>

<Col md={3}>
<HealthCard title="Diastolic BP" value={data.dia} unit="mmHg" icon="bp" history={[]}/>
</Col>

</Row>


{/* ECG MONITOR PANEL */}

<Row className="mt-5">

<Col md={12}>

<div className="ecg-panel">

<ECGChart heartRate={data.hr}/>

</div>

</Col>

</Row>

</Container>

)

}

export default Dashboard