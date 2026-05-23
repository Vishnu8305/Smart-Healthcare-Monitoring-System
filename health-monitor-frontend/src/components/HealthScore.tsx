function HealthScore({data}:any){

let score=100

if(data.spo2<95) score-=20
if(data.hr>100 || data.hr<60) score-=10
if(data.sys>140) score-=10

return(

<div className="health-score">

<h2>AI Health Score</h2>

<h1>{score}</h1>

<p>{score>80?"Healthy":"Monitor Patient"}</p>

</div>

)

}

export default HealthScore