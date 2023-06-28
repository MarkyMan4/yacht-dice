import"./style.c0ed6924.js";let f=sessionStorage.getItem("roomId"),a=sessionStorage.getItem("nickname"),i="",c=!1,y=document.getElementById("roll-btn"),g=document.getElementById("p1-upper-sum"),I=document.getElementById("p2-upper-sum"),E=document.getElementById("p1-total"),T=document.getElementById("p2-total"),s=document.getElementById("message-text"),B=document.getElementById("rolls-left-text"),u=document.getElementById("play-again-btn");u.addEventListener("click",e=>x());const p=["aces","deuces","threes","fours","fives","sixes","fourOfAKind","fullHouse","smallStraight","largeStraight","chance","yacht"];let d=new WebSocket(`wss://yachtdiceservice.xyz/ws/${f}`);d.onmessage=e=>{let t=JSON.parse(e.data);if(c||(L(t),c=!0),$(t),h(t),t.winner.trim()!=""){t.winner==="tie"?s.innerHTML="tie":s.innerHTML=`${t.winner} wins!`,s.style.color="blue",u.style.display="block";return}N(t),k(t),y.disabled=t.turn!==i||t.rollsLeft<=0,B.innerHTML=`rolls left: ${t.rollsLeft}`,t.turn===i&&t.rollsLeft<3?S(t.scoreCard[i]):v(t.scoreCard[i])};d.onopen=e=>{d.send(JSON.stringify({eventType:"name",payload:{name:a}}))};y.addEventListener("click",()=>{let e={eventType:"roll"};d.send(JSON.stringify(e))});function L(e){document.getElementById("waiting-text")&&document.getElementById("waiting-text").remove(),document.getElementById("game").style.visibility="visible",i=e.p1.nickname===a?"p1":"p2",document.getElementById("you-title").innerHTML=`You are ${i}`,document.getElementById("p1-head").innerHTML=`p1<br>${e.p1.nickname}`,document.getElementById("p2-head").innerHTML=`p2<br>${e.p2.nickname}`}function $(e){m("p1",e.scoreCard.p1),m("p2",e.scoreCard.p2),g.innerHTML=e.upperTotals.p1,I.innerHTML=e.upperTotals.p2,E.innerHTML=e.totals.p1,T.innerHTML=e.totals.p2}function m(e,t){let l=Object.keys(t);l.forEach(n=>{document.getElementById(`${e}-${n}`).innerHTML=t[n],document.getElementById(`${e}-${n}`).className="scored-cell"}),p.forEach(n=>{l.includes(n)||(document.getElementById(`${e}-${n}`).innerHTML="")})}function k(e){Object.keys(e.scoreHints).forEach(t=>{document.getElementById(`${e.turn}-${t}`).innerHTML=e.scoreHints[t],document.getElementById(`${e.turn}-${t}`).className="unscored-cell"})}function S(e){let t=Object.keys(e);p.forEach(l=>{t.includes(l)||(document.getElementById(`${i}-${l}`).onclick=H,document.getElementById(`${i}-${l}`).className="selectable-cell")})}function v(e){let t=Object.keys(e);p.forEach(l=>{document.getElementById(`${i}-${l}`).onclick=null,t.includes(l)||(document.getElementById(`${i}-${l}`).className="unscored-cell")})}function H(e){let t=e.target.id.split("-"),n={eventType:"score",payload:{category:t[t.length-1]}};d.send(JSON.stringify(n))}function M(e){let t=e.target.id.split("-"),n={eventType:"keep",payload:{die:parseInt(t[t.length-1])}};d.send(JSON.stringify(n))}function b(e){let t=e.target.id.split("-"),n={eventType:"unkeep",payload:{die:parseInt(t[t.length-1])}};d.send(JSON.stringify(n))}function h(e){let t="";for(let n=0;n<e.diceInPlay.length;n++){let r=e.diceInPlay[n];t+=`<div id="die-in-play-${n}" class="die-in-play">${r}</div>`}document.getElementById("dice-in-play").innerHTML=t;let l="";for(let n=0;n<e.diceKept.length;n++){let r=e.diceKept[n];l+=`<div id="die-kept-${n}" class="die-kept">${r}</div>`}if(document.getElementById("dice-kept").innerHTML=l,!(e.rollsLeft>=3)&&e.turn===i){let n=document.getElementsByClassName("die-in-play");for(let o of n)o.addEventListener("click",M);let r=document.getElementsByClassName("die-kept");for(let o of r)o.addEventListener("click",b)}}function N(e){e.turn===i?s.innerHTML="your turn":s.innerHTML=`${e.turn} is rolling...`,s.style.color="red"}function x(){u.style.display="none",c=!1,s.innerHTML="";let e={eventType:"restart"};d.send(JSON.stringify(e))}