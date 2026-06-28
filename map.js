// Lightweight SVG map of Western Australia. Coordinates are lon/lat.
// Shape is simplified but follows the Kimberley coast, Pilbara coast, west coast and south coast more accurately than the earlier placeholder.
const WA_POLY=[
  [129.00,-14.96],[128.60,-14.82],[128.25,-14.70],[127.92,-14.35],[127.48,-14.22],[127.08,-14.52],[126.66,-13.95],[126.20,-13.86],[125.72,-13.62],[125.34,-14.05],[124.90,-14.13],[124.55,-14.55],[124.18,-14.30],[123.72,-14.95],[123.25,-15.45],[122.95,-16.05],[122.62,-16.35],[122.32,-16.72],[122.05,-16.70],[121.78,-17.18],[121.62,-17.55],[121.15,-18.02],[120.72,-18.65],[120.18,-19.26],[119.58,-19.82],[118.82,-20.22],[118.48,-20.38],[117.76,-20.38],[117.10,-20.43],[116.70,-20.52],[116.25,-20.65],[115.88,-20.84],[115.54,-21.16],[115.20,-21.53],[114.72,-21.79],[114.30,-21.90],[114.02,-21.55],[114.12,-22.18],[114.00,-22.76],[113.86,-23.35],[113.70,-24.04],[113.48,-24.62],[113.18,-25.15],[113.09,-25.70],[113.38,-26.15],[113.78,-26.48],[113.93,-26.88],[114.16,-27.37],[114.10,-27.82],[114.34,-28.32],[114.70,-28.77],[114.64,-29.18],[114.58,-29.76],[114.79,-30.26],[114.96,-30.80],[115.05,-31.32],[115.43,-31.80],[115.70,-32.38],[115.82,-32.92],[115.74,-33.34],[115.45,-33.73],[115.12,-34.37],[115.72,-34.16],[116.10,-34.55],[116.62,-34.86],[117.28,-35.03],[118.00,-34.98],[118.62,-34.70],[119.14,-34.37],[119.82,-34.08],[120.50,-33.93],[121.18,-33.91],[121.92,-33.94],[122.62,-33.90],[123.38,-33.86],[124.12,-33.84],[124.80,-33.84],[125.48,-33.85],[126.12,-33.88],[126.80,-33.90],[127.48,-33.88],[128.10,-33.78],[128.64,-33.36],[129.00,-32.98],[129.00,-14.96]
];
const bounds={minLon:112.2,maxLon:129.35,minLat:-35.35,maxLat:-13.35};
function sx(lon){return ((lon-bounds.minLon)/(bounds.maxLon-bounds.minLon))*330+15}
function sy(lat){return ((bounds.maxLat-lat)/(bounds.maxLat-bounds.minLat))*490+15}
function make(tag){return document.createElementNS('http://www.w3.org/2000/svg',tag)}
function drawMap(dep,dst,pos,aircraft,quote){
 const svg=document.getElementById('waMap'); if(!svg||!dep||!dst) return; svg.innerHTML='';
 const add=(tag,attrs,parent=svg)=>{const n=make(tag);Object.entries(attrs||{}).forEach(([k,v])=>n.setAttribute(k,v));parent.appendChild(n);return n};
 add('rect',{x:0,y:0,width:360,height:520,fill:'#051225'});
 for(let i=0;i<7;i++) add('line',{x1:15+i*55,y1:15,x2:15+i*55,y2:505,class:'wa-grid'});
 for(let i=0;i<8;i++) add('line',{x1:15,y1:15+i*65,x2:345,y2:15+i*65,class:'wa-grid'});
 add('polygon',{points:WA_POLY.map(p=>`${sx(p[0]).toFixed(1)},${sy(p[1]).toFixed(1)}`).join(' '),class:'wa-land'});
 // State borders: NT/SA line at 129E and south coast cue.
 add('path',{d:`M${sx(129)},${sy(-14.96)} L${sx(129)},${sy(-32.98)}`,class:'wa-border'});
 add('text',{x:sx(113.7),y:sy(-23.2),class:'wa-coast-label'}).textContent='INDIAN OCEAN';
 add('text',{x:sx(121.7),y:sy(-34.5),class:'wa-coast-label'}).textContent='GREAT AUSTRALIAN BIGHT';
 (window.AIRPORTS||[]).forEach(a=>{ if(a.lon>=bounds.minLon&&a.lon<=bounds.maxLon&&a.lat>=bounds.minLat&&a.lat<=bounds.maxLat) add('circle',{cx:sx(a.lon),cy:sy(a.lat),r:1.25,class:'airport-dot'}); });
 const depX=sx(dep.lon),depY=sy(dep.lat),dstX=sx(dst.lon),dstY=sy(dst.lat);
 if(pos&&pos.code!==dep.code){const posX=sx(pos.lon),posY=sy(pos.lat); add('path',{d:`M${posX.toFixed(1)},${posY.toFixed(1)} L${depX.toFixed(1)},${depY.toFixed(1)}`,class:'route-line',opacity:.45}); add('circle',{cx:posX,cy:posY,r:5,class:'marker-pos'}); add('text',{x:posX+7,y:posY-6,class:'map-label'}).textContent=pos.code;}
 const dx=dstX-depX,dy=dstY-depY; const curve=Math.max(-42,Math.min(42, -dx*0.08));
 const d=`M${depX.toFixed(1)},${depY.toFixed(1)} Q${((depX+dstX)/2+curve).toFixed(1)},${((depY+dstY)/2-24).toFixed(1)} ${dstX.toFixed(1)},${dstY.toFixed(1)}`;
 add('path',{d,class:'route-shadow'}); add('path',{id:'mainRoute',d,class:'route-line'});
 add('circle',{cx:depX,cy:depY,r:6,class:'marker-dep'}); add('circle',{cx:dstX,cy:dstY,r:7,class:'marker-dst'});
 add('text',{x:depX+8,y:depY-7,class:'map-label'}).textContent=dep.code; add('text',{x:dstX+8,y:dstY-7,class:'map-label'}).textContent=dst.code;
 const plane=add('text',{class:'plane','text-anchor':'middle','dominant-baseline':'middle'}); plane.textContent='✈';
 const anim=make('animateMotion'); anim.setAttribute('dur','5.5s'); anim.setAttribute('repeatCount','indefinite'); anim.setAttribute('rotate','auto');
 const m=make('mpath'); m.setAttributeNS('http://www.w3.org/1999/xlink','href','#mainRoute'); m.setAttribute('href','#mainRoute'); anim.appendChild(m); plane.appendChild(anim);
 document.getElementById('mapTitle').textContent=`${dep.code} → ${dst.code}`;
 const nm=quote?quote.routeNm:nmBetween(dep,dst); document.getElementById('mapNm').textContent=`${Math.round(nm)} nm`; document.getElementById('mapTime').textContent=aircraft?timeFmt(nm/aircraft.speed):'—';
}
