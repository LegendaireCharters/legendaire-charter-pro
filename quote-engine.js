function toRad(d){return d*Math.PI/180}
function nmBetween(a,b){const R=3440.065;const dLat=toRad(b.lat-a.lat),dLon=toRad(b.lon-a.lon);const x=Math.sin(dLat/2)**2+Math.cos(toRad(a.lat))*Math.cos(toRad(b.lat))*Math.sin(dLon/2)**2;return R*2*Math.atan2(Math.sqrt(x),Math.sqrt(1-x))*1.01}
function money(n){return '$'+Math.round(n).toLocaleString('en-AU')}
function timeFmt(h){const hr=Math.floor(h),min=Math.round((h-hr)*60);return hr?`${hr}h ${min}m`:`${min}m`}
function quoteRef(){return 'QUO-'+String(Date.now()).slice(-6)}
function calcQuote({dep,dst,pos,aircraft,pax,returnFlight,flatLanding,paxLanding,waitingFee,margin}){
  const routeNm=nmBetween(dep,dst); const routeLegs=returnFlight?2:1;
  const positioningNm=(pos&&pos.code!==dep.code)?nmBetween(pos,dep):0;
  const totalNm=routeNm*routeLegs+positioningNm;
  const hours=totalNm/aircraft.speed;
  const landings=(returnFlight?2:1) + (positioningNm>0?1:0);
  const landingCost=landings*Number(flatLanding||0) + (Number(paxLanding||0)*Number(pax||0)*landings);
  const charter=hours*aircraft.rate;
  const subtotal=charter+landingCost+Number(waitingFee||0);
  const marginAmt=subtotal*(Number(margin||0)/100);
  const gst=(subtotal+marginAmt)*0.10;
  const total=subtotal+marginAmt+gst;
  return {routeNm,totalNm,positioningNm,hours,landings,landingCost,charter,subtotal,marginAmt,gst,total,perPax:total/Math.max(1,pax)};
}
function recommendAircraft({dep,dst,pax,returnFlight}){
 const scored=window.AIRCRAFT.filter(a=>a.pax>=pax).map(a=>{const q=calcQuote({dep,dst,pos:dep,aircraft:a,pax,returnFlight,flatLanding:200,paxLanding:0,waitingFee:0,margin:15}); return {...a,est:q.total,hrs:q.hours}}).sort((a,b)=>a.est-b.est);
 return scored[0]||window.AIRCRAFT[0];
}
