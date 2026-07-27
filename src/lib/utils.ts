import {type ClassValue,clsx} from "clsx"
import {twMerge} from "tailwind-merge"
export function cn(...i:ClassValue[]){return twMerge(clsx(i))}
export function formatDate(d:string|Date){return new Intl.DateTimeFormat("en-US",{month:"short",day:"numeric",year:"numeric"}).format(new Date(d))}
export function formatXP(x:number){return x>=1000?`${(x/1000).toFixed(1)}k`:x.toString()}
export function truncate(s:string,l:number){return s.length<=l?s:s.slice(0,l)+"..."}
export function getLevel(xp:number):{name:string;level:number;progress:number}{
  const L=[{name:"Novice",min:0},{name:"Reader",min:500},{name:"Scholar",min:1500},{name:"Thinker",min:3500},{name:"Strategist",min:7000},{name:"Mentor",min:12000},{name:"Master",min:20000}]
  for(let i=L.length-1;i>=0;i--){if(xp>=L[i].min){const n=L[i].min,next=L[i+1]?.min||n+5000;return{name:L[i].name,level:i+1,progress:xp>=next?1:(xp-n)/(next-n)}}}
  return{name:"Novice",level:1,progress:0}
}
