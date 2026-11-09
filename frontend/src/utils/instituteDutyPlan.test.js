import test from 'node:test';
import assert from 'node:assert/strict';
import {assignmentSignature,orderDutyStudents} from './instituteDutyPlan.js';
const routes=[{routeId:'r',revision:1,pickupStops:[{id:'home-a',students:[{id:'a'},{id:'b'}]},{id:'home-c',students:[{id:'c'}]}],dropStops:[{id:'home-c',students:[{id:'c'}]},{id:'home-a',students:[{id:'a'},{id:'b'}]}]}];
test('institute morning and return guidance preserve management order and keep siblings together',()=>{
 const students=[{_id:'c'},{_id:'b'},{_id:'a'},{_id:'new'}];
 assert.deepEqual(orderDutyStudents(students,routes).map(s=>s._id),['a','b','c','new']);
 assert.deepEqual(orderDutyStudents(students,routes,true).map(s=>s._id),['c','a','b','new']);
 assert.deepEqual(students.map(s=>s._id),['c','b','a','new']);
});
test('assignment reminder changes on student / route updates, not routine refreshes',()=>{
 const data={driverId:'demo',children:[{_id:'a',name:'A',assignedRouteName:'R',pickupTime:'07:50'}],homeRoutes:routes};
 assert.equal(assignmentSignature(data),assignmentSignature({...data,updatedAt:Date.now()}));
 assert.notEqual(assignmentSignature(data),assignmentSignature({...data,homeRoutes:[{...routes[0],revision:2}]}));
 assert.notEqual(assignmentSignature(data),assignmentSignature({...data,children:[{...data.children[0],pickupTime:'08:00'}]}));
 assert.equal(assignmentSignature({children:[]}), '');
});
