(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[7928],{8323:function(e,r,t){Promise.resolve().then(t.bind(t,3354))},3354:function(e,r,t){"use strict";t.r(r),t.d(r,{default:function(){return DebugTokenPage}});var n=t(7437),o=t(2265),i=t(3991);function DebugTokenPage(){return(0,o.useEffect)(()=>{let fetchToken=async()=>{let{getAuth:e}=await Promise.all([t.e(5315),t.e(3955)]).then(t.bind(t,8153)),r=e(),n=r.currentUser;if(!n){console.log("⚠️ No user is signed in.");return}let o=await n.getIdToken();console.log("\uD83D\uDD25 Firebase ID Token:",o)};fetchToken()},[]),(0,n.jsx)("div",{children:"Debugging Firebase token... check the console."})}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */(0,i.registerVersion)("firebase","9.23.0","app"),(0,i.getApps)().length||(0,i.initializeApp)({apiKey:"AIzaSyB8XOlU5pDZV0FWvnRLk3520uYEgwbVmac",authDomain:"therascript-45b62.firebaseapp.com",projectId:"therascript-45b62",storageBucket:"therascript-45b62.appspot.com",messagingSenderId:"64757237031",appId:"1:64757237031:web:c541b0cf649c0d88fb5502"})},622:function(e,r,t){"use strict";/**
 * @license React
 * react-jsx-runtime.production.min.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var n=t(2265),o=Symbol.for("react.element"),i=Symbol.for("react.fragment"),s=Object.prototype.hasOwnProperty,a=n.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner,c={key:!0,ref:!0,__self:!0,__source:!0};function q(e,r,t){var n,i={},u=null,f=null;for(n in void 0!==t&&(u=""+t),void 0!==r.key&&(u=""+r.key),void 0!==r.ref&&(f=r.ref),r)s.call(r,n)&&!c.hasOwnProperty(n)&&(i[n]=r[n]);if(e&&e.defaultProps)for(n in r=e.defaultProps)void 0===i[n]&&(i[n]=r[n]);return{$$typeof:o,type:e,key:u,ref:f,props:i,_owner:a.current}}r.Fragment=i,r.jsx=q,r.jsxs=q},7437:function(e,r,t){"use strict";e.exports=t(622)}},function(e){e.O(0,[3991,2971,2472,1744],function(){return e(e.s=8323)}),_N_E=e.O()}]);