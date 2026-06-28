const WA_POLY=[ [113.1,-35.0],[115.0,-34.3],[116.1,-34.6],[117.2,-35.0],[118.2,-34.8],[119.5,-34.1],[121.0,-33.9],[123.0,-33.9],[125.0,-33.9],[127.0,-33.9],[129.0,-31.7],[129.0,-14.9],[128.4,-14.7],[127.8,-14.4],[127.2,-14.6],[126.5,-14.1],[125.8,-13.8],[125.1,-14.4],[124.5,-14.2],[123.7,-15.2],[123.0,-16.2],[122.4,-16.6],[122.0,-17.7],[121.5,-17.4],[120.8,-18.6],[119.8,-19.7],[118.6,-20.4],[116.8,-20.4],[115.8,-20.8],[115.3,-21.5],[114.6,-21.8],[114.0,-21.5],[114.2,-22.5],[113.8,-23.6],[113.5,-24.6],[113.2,-25.5],[113.5,-26.2],[114.0,-26.8],[114.2,-27.8],[114.8,-28.9],[114.6,-30.0],[115.0,-31.2],[115.6,-32.4],[115.8,-33.3],[115.1,-34.4],[113.1,-35.0] ];
const bounds={minLon:112.0,maxLon:129.5,minLat:-35.5,maxLat:-13.3};
function sx(lon){return ((lon-bounds.minLon)/(bounds.maxLon-bounds.minLon))*330+15}
function sy(lat){return ((bounds.maxLat-lat)/(bounds.maxLat-bounds.minLat))*490+15}
function drawMap(dep,dst,pos,aircraft,quote){
 const svg=document.getElementById('waMap'); if(!svg) return; svg.innerHTML=''; const ns='http://www.w3.org/2000/svg'; const el=t=>document.createElementNS(ns,t); const add=(t,attrs,parent=svg)=>{const n=el(t);Object.entries(attrs||{}).forEach(([k,v])=>n.setAttribute(k,v));parent.appendChild(n);return n};
 for(let i=0;i<7;i++){add('line',{x1:15+i*55,y1:15,x2:15+i*55,y2:505,class:'wa-grid'});}
 for(let i=0;i<8;i++){add('line',{x1:15,y1:15+i*65,x2:345,y2:15+i*65,class:'wa-grid'});}
 add('polygon',{points:WA_POLY.map(p=>`${sx(p[0]).toFixed(1)},${sy(p[1]).toFixed(1)}`).join(' '),class:'wa-land'});
 window.AIRPORTS.forEach(a=>add('circle',{cx:sx(a.lon),cy:sy(a.lat),r:1.3,class:'airport-dot'}));
 const depX=sx(dep.lon),depY=sy(dep.lat),dstX=sx(dst.lon),dstY=sy(dst.lat);
 if(pos&&pos.code!==dep.code){const posX=sx(pos.lon),posY=sy(pos.lat); add('path',{d:`M${posX},${posY} L${depX},${depY}`,class:'route-line',opacity:.45}); add('circle',{cx:posX,cy:posY,r:5,class:'marker-pos'}); add('text',{x:posX+7,y:posY-6,class:'map-label'}).textContent=pos.code;}
 const d=`M${depX},${depY} Q${(depX+dstX)/2-24},${(depY+dstY)/2-18} ${dstX},${dstY}`;
 add('path',{d,class:'route-shadow'}); const route=add('path',{id:'mainRoute',d,class:'route-line'});
 add('circle',{cx:depX,cy:depY,r:6,class:'marker-dep'}); add('circle',{cx:dstX,cy:dstY,r:7,class:'marker-dst'});
 add('text',{x:depX+8,y:depY-7,class:'map-label'}).textContent=dep.code; add('text',{x:dstX+8,y:dstY-7,class:'map-label'}).textContent=dst.code;
 const plane=add('text',{class:'plane','text-anchor':'middle','dominant-baseline':'middle'}); plane.textContent='✈'; const anim=el('animateMotion'); anim.setAttribute('dur','5.5s');anim.setAttribute('repeatCount','indefinite');anim.setAttribute('rotate','auto'); const m=el('mpath'); m.setAttributeNS('http://www.w3.org/1999/xlink','href','#mainRoute'); m.setAttribute('href','#mainRoute'); anim.appendChild(m); plane.appendChild(anim);
 document.getElementById('mapTitle').textContent=`${dep.code} → ${dst.code}`; document.getElementById('mapNm').textContent=`${Math.round(quote?quote.routeNm:nmBetween(dep,dst))} nm`; document.getElementById('mapTime').textContent=aircraft?timeFmt((quote?quote.routeNm:nmBetween(dep,dst))/aircraft.speed):'—';
}
