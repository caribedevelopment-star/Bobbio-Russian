"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

type Props={className?:string;active:boolean;phase:"idle"|"closing"|"opening"};

function beam(a:THREE.Vector3,b:THREE.Vector3,w:number,mat:THREE.Material){const d=b.clone().sub(a);const m=new THREE.Mesh(new THREE.BoxGeometry(w,w,d.length()),mat);m.position.copy(a).add(b).multiplyScalar(.5);m.quaternion.setFromUnitVectors(new THREE.Vector3(0,0,1),d.clone().normalize());return m;}
function segment(a:THREE.Vector3,b:THREE.Vector3,mat:THREE.LineBasicMaterial){return new THREE.Line(new THREE.BufferGeometry().setFromPoints([a,b]),mat);}

function sectionFrame(width:number,height:number,z:number,index:number,mats:{steel:THREE.Material;gold:THREE.Material;ivory:THREE.Material;blue:THREE.Material}){
  const g=new THREE.Group();g.position.z=z;
  const hw=width/2,base=-height/2,eave=height*.18,ridge=height/2;
  const structural=index%3===0?mats.gold:index%2?mats.steel:mats.ivory;
  g.add(beam(new THREE.Vector3(-hw,base,0),new THREE.Vector3(-hw,eave,0),.045,structural));
  g.add(beam(new THREE.Vector3(hw,base,0),new THREE.Vector3(hw,eave,0),.045,structural));
  g.add(beam(new THREE.Vector3(-hw,eave,0),new THREE.Vector3(0,ridge,0),.04,index%2?mats.gold:mats.ivory));
  g.add(beam(new THREE.Vector3(0,ridge,0),new THREE.Vector3(hw,eave,0),.04,index%2?mats.ivory:mats.blue));
  g.add(beam(new THREE.Vector3(-hw,base,0),new THREE.Vector3(hw,base,0),.025,mats.steel));
  if(index%2===0){g.add(beam(new THREE.Vector3(-hw,base,0),new THREE.Vector3(hw,eave,0),.017,mats.blue));g.add(beam(new THREE.Vector3(hw,base,0),new THREE.Vector3(-hw,eave,0),.014,mats.gold));}
  return g;
}

export default function RouteTransitionCanvas({className,active,phase}:Props){
  const mount=useRef<HTMLDivElement>(null);const activeRef=useRef(active);const phaseRef=useRef(phase);activeRef.current=active;phaseRef.current=phase;
  useEffect(()=>{
    const host=mount.current;if(!host)return;
    const compact=window.matchMedia("(max-width:700px)").matches;const reduced=window.matchMedia("(prefers-reduced-motion:reduce)").matches;
    const scene=new THREE.Scene();scene.fog=new THREE.FogExp2(0x050709,compact?.085:.055);
    const camera=new THREE.PerspectiveCamera(compact?54:44,1,.1,60);camera.position.set(0,.05,compact?9.6:10.2);
    const renderer=new THREE.WebGLRenderer({antialias:!compact,alpha:true,powerPreference:"high-performance"});renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,compact?1.2:1.55));renderer.setClearColor(0x050709,0);renderer.outputColorSpace=THREE.SRGBColorSpace;host.appendChild(renderer.domElement);

    const world=new THREE.Group(),frames=new THREE.Group(),rails=new THREE.Group(),drawings=new THREE.Group(),streaks=new THREE.Group();world.add(frames,rails,drawings,streaks);scene.add(world);
    const steel=new THREE.MeshStandardMaterial({color:0x667178,metalness:.78,roughness:.3,transparent:true,opacity:.36});
    const gold=new THREE.MeshStandardMaterial({color:0xd6c28f,metalness:.6,roughness:.27,transparent:true,opacity:.58,emissive:0x302713,emissiveIntensity:.18});
    const ivory=new THREE.MeshStandardMaterial({color:0xe7dfcf,metalness:.24,roughness:.42,transparent:true,opacity:.28});
    const blue=new THREE.MeshStandardMaterial({color:0x7eabba,metalness:.44,roughness:.36,transparent:true,opacity:.28});
    const faint=new THREE.LineBasicMaterial({color:0xe7dfcf,transparent:true,opacity:.09});const warm=new THREE.LineBasicMaterial({color:0xd6c28f,transparent:true,opacity:.22});const cool=new THREE.LineBasicMaterial({color:0x7eabba,transparent:true,opacity:.14});

    const zs=[-11,-9.1,-7.2,-5.3,-3.4,-1.5,.4,2.3,4.2];const frameList:THREE.Group[]=[];
    zs.forEach((z,i)=>{const perspective=1-i*.018;const f=sectionFrame((compact?4.8:7)*perspective,(compact?7.4:4.7)*perspective,z,i,{steel,gold,ivory,blue});f.rotation.z=(i-4)*.0035;frames.add(f);frameList.push(f);});
    const hw=compact?2.16:3.15,base=compact?-3.25:-2.0,eave=compact?1.25:.85,ridge=compact?3.3:2.25;
    [[-hw,base],[hw,base],[-hw,eave],[hw,eave],[0,ridge]].forEach(([x,y],i)=>rails.add(beam(new THREE.Vector3(x,y,zs[0]),new THREE.Vector3(x,y,zs[zs.length-1]),i===4?.018:.014,i===4?gold:i%2?steel:ivory)));

    // floor drawing grid travelling into depth
    for(let i=0;i<9;i+=1){const x=-hw+(i/8)*hw*2;drawings.add(segment(new THREE.Vector3(x,base+.02,-11.5),new THREE.Vector3(x,base+.02,4.8),i===4?warm.clone():faint.clone()));}
    for(let i=0;i<12;i+=1){const z=-11+(i/11)*16;drawings.add(segment(new THREE.Vector3(-hw,base+.02,z),new THREE.Vector3(hw,base+.02,z),i%4===0?cool.clone():faint.clone()));}
    // section planes and pythagorean setout
    for(let i=0;i<4;i+=1){const plane=new THREE.Mesh(new THREE.PlaneGeometry(compact?4.5:6.6,compact?6.8:4.3,12,8),new THREE.MeshBasicMaterial({color:i%2?0x7eabba:0xd6c28f,wireframe:true,transparent:true,opacity:.025,side:THREE.DoubleSide}));plane.position.set((i%2?-.18:.18),0,-8+i*3.3);plane.rotation.y=(i-1.5)*.015;drawings.add(plane);const size=1.1+i*.28;const tri=new THREE.Line(new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(-size*.5,-size*.35,0),new THREE.Vector3(size*.5,-size*.35,0),new THREE.Vector3(size*.5,size*.4,0),new THREE.Vector3(-size*.5,-size*.35,0)]),i%2?cool.clone():warm.clone());tri.position.set(i%2?-1.5:1.4,.2+i*.24,-9+i*3.1);drawings.add(tri);}

    // speed streaks, architectural rather than star particles
    for(let i=0;i<(compact?34:68);i+=1){const x=((i*37)%100/100-.5)*(compact?4.6:7.2),y=((i*61)%100/100-.5)*(compact?6.6:4.6),z=-11+((i*17)%100/100)*15.5,len=.16+((i*29)%100/100)*.5;streaks.add(segment(new THREE.Vector3(x,y,z),new THREE.Vector3(x,y,z+len),i%5===0?warm.clone():faint.clone()));}

    scene.add(new THREE.HemisphereLight(0xe7dfcf,0x050709,.66));const key=new THREE.PointLight(0xd6c28f,8.5,18,2);key.position.set(2.7,3.2,5.5);scene.add(key);const fill=new THREE.PointLight(0x7eabba,4.2,15,2);fill.position.set(-3.4,-.8,3.2);scene.add(fill);
    let energy=0,raf=0;const clock=new THREE.Clock();
    const resize=()=>{const w=host.clientWidth||window.innerWidth,h=host.clientHeight||window.innerHeight;renderer.setSize(w,h,false);camera.aspect=w/Math.max(1,h);camera.updateProjectionMatrix();};resize();const ro=new ResizeObserver(resize);ro.observe(host);
    const animate=()=>{
      const t=clock.getElapsedTime(),target=activeRef.current?1:0;energy+=(target-energy)*(phaseRef.current==="closing"?.065:.052);const e=energy*energy*(3-2*energy),closing=phaseRef.current==="closing",opening=phaseRef.current==="opening";
      const travel=closing?e:opening?1-e:0;
      camera.position.z+=( (compact?9.6:10.2)-travel*(compact?4.6:5.7)-camera.position.z)*.085;camera.position.x=Math.sin(e*Math.PI)*(compact?.06:.28);camera.position.y=.05+Math.sin(e*Math.PI)*.12;camera.fov+=( (compact?54:44)+travel*(compact?8:13)-camera.fov)*.06;camera.updateProjectionMatrix();camera.lookAt(0,.05,-3.2);
      world.position.z=travel*2.3;world.rotation.y=Math.sin(t*.18)*.009+travel*.028;world.rotation.x=Math.sin(t*.21)*.005;
      frameList.forEach((f,i)=>{f.position.x=Math.sin(t*.37+i*.71)*(reduced?0:.018);f.scale.setScalar(1+travel*(i%3===0?.015:.005)+Math.sin(t*.3+i)*(reduced?0:.002));});
      drawings.position.z=travel*.8;streaks.scale.z=1+travel*5.5;streaks.position.z=travel*1.4;
      renderer.domElement.style.opacity=String(Math.min(1,energy*1.6));renderer.render(scene,camera);raf=requestAnimationFrame(animate);
    };animate();
    return()=>{cancelAnimationFrame(raf);ro.disconnect();scene.traverse(o=>{const m=o as THREE.Mesh;if(m.geometry)m.geometry.dispose();if(m.material){(Array.isArray(m.material)?m.material:[m.material]).forEach(mat=>mat.dispose());}});renderer.dispose();renderer.domElement.remove();};
  },[]);
  return <div ref={mount} className={className} aria-hidden="true"/>;
}
