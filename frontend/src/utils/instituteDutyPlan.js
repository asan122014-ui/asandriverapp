export function assignmentSignature(data) {
  if (!data?.children?.length) return '';
  return JSON.stringify({driver:data.driverId,children:data.children.map(child=>[child._id,child.name,child.assignedRouteName,child.pickupLocation,child.pickupTime,child.eveningPickup]).sort((a,b)=>String(a[0]).localeCompare(String(b[0]))),routes:[...(data.homeRoutes||[]),...(data.stopRoutes||[])].map(route=>[route.routeId,route.revision,route.pickupStops?.map(stop=>[stop.id,stop.pickupTime]),route.dropStops?.map(stop=>[stop.id,stop.dropTime])])});
}
export function orderDutyStudents(students, routes, evening = false) {
  const ids=routes.flatMap(route=>(evening?route.dropStops:route.pickupStops)||[]).flatMap(stop=>(stop.students||[]).map(child=>String(child.id || child._id)));
  const rank=new Map(ids.map((id,index)=>[id,index]));
  return [...students].sort((a,b)=>(rank.get(String(a._id))??Infinity)-(rank.get(String(b._id))??Infinity));
}
