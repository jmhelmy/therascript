"use strict";(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[8105],{9366:function(e,t,n){n.d(t,{Z:function(){return u}});var r=n(8745),i=n(5538),a=n(3991),o=n(6914);/**
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
 */let FirebaseAppImpl=class FirebaseAppImpl{constructor(e,t){this._delegate=e,this.firebase=t,(0,a._addComponent)(e,new i.wA("app-compat",()=>this,"PUBLIC")),this.container=e.container}get automaticDataCollectionEnabled(){return this._delegate.automaticDataCollectionEnabled}set automaticDataCollectionEnabled(e){this._delegate.automaticDataCollectionEnabled=e}get name(){return this._delegate.name}get options(){return this._delegate.options}delete(){return new Promise(e=>{this._delegate.checkDestroyed(),e()}).then(()=>(this.firebase.INTERNAL.removeApp(this.name),(0,a.deleteApp)(this._delegate)))}_getService(e,t=a._DEFAULT_ENTRY_NAME){var n;this._delegate.checkDestroyed();let r=this._delegate.container.getProvider(e);return r.isInitialized()||(null===(n=r.getComponent())||void 0===n?void 0:n.instantiationMode)!=="EXPLICIT"||r.initialize(),r.getImmediate({identifier:t})}_removeServiceInstance(e,t=a._DEFAULT_ENTRY_NAME){this._delegate.container.getProvider(e).clearInstance(t)}_addComponent(e){(0,a._addComponent)(this._delegate,e)}_addOrOverwriteComponent(e){(0,a._addOrOverwriteComponent)(this._delegate,e)}toJSON(){return{name:this.name,automaticDataCollectionEnabled:this.automaticDataCollectionEnabled,options:this.options}}};let s=new r.LL("app-compat","Firebase",{"no-app":"No Firebase App '{$appName}' has been created - call Firebase App.initializeApp()","invalid-app-argument":"firebase.{$appName}() takes either no argument or a Firebase App instance."}),l=/**
 * @license
 * Copyright 2019 Google LLC
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
 */function createFirebaseNamespace(){let e=/**
 * @license
 * Copyright 2019 Google LLC
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
 */function(e){let t={},n={__esModule:!0,initializeApp:function(i,o={}){let s=a.initializeApp(i,o);if((0,r.r3)(t,s.name))return t[s.name];let l=new e(s,n);return t[s.name]=l,l},app,registerVersion:a.registerVersion,setLogLevel:a.setLogLevel,onLog:a.onLog,apps:null,SDK_VERSION:a.SDK_VERSION,INTERNAL:{registerComponent:function(t){let i=t.name,o=i.replace("-compat","");if(a._registerComponent(t)&&"PUBLIC"===t.type){let serviceNamespace=(e=app())=>{if("function"!=typeof e[o])throw s.create("invalid-app-argument",{appName:i});return e[o]()};void 0!==t.serviceProps&&(0,r.ZB)(serviceNamespace,t.serviceProps),n[o]=serviceNamespace,e.prototype[o]=function(...e){let n=this._getService.bind(this,i);return n.apply(this,t.multipleInstances?e:[])}}return"PUBLIC"===t.type?n[o]:null},removeApp:function(e){delete t[e]},useAsService:function(e,t){return"serverAuth"===t?null:t},modularAPIs:a}};function app(e){if(e=e||a._DEFAULT_ENTRY_NAME,!(0,r.r3)(t,e))throw s.create("no-app",{appName:e});return t[e]}return n.default=n,Object.defineProperty(n,"apps",{get:function(){return Object.keys(t).map(e=>t[e])}}),app.App=e,n}(FirebaseAppImpl);return e.INTERNAL=Object.assign(Object.assign({},e.INTERNAL),{createFirebaseNamespace,extendNamespace:function(t){(0,r.ZB)(e,t)},createSubscribe:r.ne,ErrorFactory:r.LL,deepExtend:r.ZB}),e}(),d=new o.Yd("@firebase/app-compat");/**
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
 */if((0,r.jU)()&&void 0!==self.firebase){d.warn(`
    Warning: Firebase is already defined in the global scope. Please make sure
    Firebase library is only loaded once.
  `);let e=self.firebase.SDK_VERSION;e&&e.indexOf("LITE")>=0&&d.warn(`
    Warning: You are trying to load Firebase while using Firebase Performance standalone script.
    You should load Firebase Performance with this instance of Firebase to avoid loading duplicate code.
    `)}let u=l;(0,a.registerVersion)("@firebase/app-compat","0.2.13",void 0)},8199:function(e,t,n){n.d(t,{Z:function(){return r.Z}});var r=n(9366);/**
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
 */r.Z.registerVersion("firebase","9.23.0","app-compat")},8003:function(e,t,n){var r,i=n(9366),a=n(3871),o=n(8745);n(3991),n(6914);var s=n(5538);/**
 * @license
 * Copyright 2021 Google LLC
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
 */function _cordovaWindow(){return window}async function _generateHandlerUrl(e,t,n){var r;let{BuildInfo:i}=_cordovaWindow();(0,a.as)(t.sessionId,"AuthEvent did not contain a session ID");let o=await computeSha256(t.sessionId),s={};return(0,a.at)()?s.ibi=i.packageName:(0,a.au)()?s.apn=i.packageName:(0,a.av)(e,"operation-not-supported-in-this-environment"),i.displayName&&(s.appDisplayName=i.displayName),s.sessionId=o,(0,a.aw)(e,n,t.type,void 0,null!==(r=t.eventId)&&void 0!==r?r:void 0,s)}async function _validateOrigin(e){let{BuildInfo:t}=_cordovaWindow(),n={};(0,a.at)()?n.iosBundleId=t.packageName:(0,a.au)()?n.androidPackageName=t.packageName:(0,a.av)(e,"operation-not-supported-in-this-environment"),await (0,a.ax)(e,n)}async function _waitForAppResume(e,t,n){let{cordova:r}=_cordovaWindow(),cleanup=()=>{};try{await new Promise((i,o)=>{let s=null;function authEventSeen(){var e;i();let t=null===(e=r.plugins.browsertab)||void 0===e?void 0:e.close;"function"==typeof t&&t(),"function"==typeof(null==n?void 0:n.close)&&n.close()}function resumed(){s||(s=window.setTimeout(()=>{o((0,a.az)(e,"redirect-cancelled-by-user"))},2e3))}function visibilityChanged(){(null==document?void 0:document.visibilityState)==="visible"&&resumed()}t.addPassiveListener(authEventSeen),document.addEventListener("resume",resumed,!1),(0,a.au)()&&document.addEventListener("visibilitychange",visibilityChanged,!1),cleanup=()=>{t.removePassiveListener(authEventSeen),document.removeEventListener("resume",resumed,!1),document.removeEventListener("visibilitychange",visibilityChanged,!1),s&&window.clearTimeout(s)}})}finally{cleanup()}}async function computeSha256(e){let t=function(e){if((0,a.as)(/[0-9a-zA-Z]+/.test(e),"Can only convert alpha-numeric strings"),"undefined"!=typeof TextEncoder)return new TextEncoder().encode(e);let t=new ArrayBuffer(e.length),n=new Uint8Array(t);for(let t=0;t<e.length;t++)n[t]=e.charCodeAt(t);return n}(e),n=await crypto.subtle.digest("SHA-256",t),r=Array.from(new Uint8Array(n));return r.map(e=>e.toString(16).padStart(2,"0")).join("")}let CordovaAuthEventManager=class CordovaAuthEventManager extends a.aB{constructor(){super(...arguments),this.passiveListeners=new Set,this.initPromise=new Promise(e=>{this.resolveInialized=e})}addPassiveListener(e){this.passiveListeners.add(e)}removePassiveListener(e){this.passiveListeners.delete(e)}resetRedirect(){this.queuedRedirectEvent=null,this.hasHandledPotentialRedirect=!1}onEvent(e){return this.resolveInialized(),this.passiveListeners.forEach(t=>t(e)),super.onEvent(e)}async initialized(){await this.initPromise}};async function _getAndRemoveEvent(e){let t=await storage()._get(persistenceKey(e));return t&&await storage()._remove(persistenceKey(e)),t}function storage(){return(0,a.aC)(a.b)}function persistenceKey(e){return(0,a.aD)("authEvent",e.config.apiKey,e.name)}function searchParamsOrEmpty(e){if(!(null==e?void 0:e.includes("?")))return{};let[t,...n]=e.split("?");return(0,o.zd)(n.join("?"))}let l=class{constructor(){this._redirectPersistence=a.a,this._shouldInitProactively=!0,this.eventManagers=new Map,this.originValidationPromises={},this._completeRedirectFn=a.aE,this._overrideRedirectResult=a.aF}async _initialize(e){let t=e._key(),n=this.eventManagers.get(t);return n||(n=new CordovaAuthEventManager(e),this.eventManagers.set(t,n),this.attachCallbackListeners(e,n)),n}_openPopup(e){(0,a.av)(e,"operation-not-supported-in-this-environment")}async _openRedirect(e,t,n,r){!function(e){var t,n,r,i,o,s,l,d,u,c;let p=_cordovaWindow();(0,a.aA)("function"==typeof(null===(t=null==p?void 0:p.universalLinks)||void 0===t?void 0:t.subscribe),e,"invalid-cordova-configuration",{missingPlugin:"cordova-universal-links-plugin-fix"}),(0,a.aA)(void 0!==(null===(n=null==p?void 0:p.BuildInfo)||void 0===n?void 0:n.packageName),e,"invalid-cordova-configuration",{missingPlugin:"cordova-plugin-buildInfo"}),(0,a.aA)("function"==typeof(null===(o=null===(i=null===(r=null==p?void 0:p.cordova)||void 0===r?void 0:r.plugins)||void 0===i?void 0:i.browsertab)||void 0===o?void 0:o.openUrl),e,"invalid-cordova-configuration",{missingPlugin:"cordova-plugin-browsertab"}),(0,a.aA)("function"==typeof(null===(d=null===(l=null===(s=null==p?void 0:p.cordova)||void 0===s?void 0:s.plugins)||void 0===l?void 0:l.browsertab)||void 0===d?void 0:d.isAvailable),e,"invalid-cordova-configuration",{missingPlugin:"cordova-plugin-browsertab"}),(0,a.aA)("function"==typeof(null===(c=null===(u=null==p?void 0:p.cordova)||void 0===u?void 0:u.InAppBrowser)||void 0===c?void 0:c.open),e,"invalid-cordova-configuration",{missingPlugin:"cordova-plugin-inappbrowser"})}(e);let i=await this._initialize(e);await i.initialized(),i.resetRedirect(),(0,a.aG)(),await this._originValidation(e);let o=function(e,t,n=null){return{type:t,eventId:n,urlResponse:null,sessionId:function(){let e=[],t="1234567890abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";for(let n=0;n<20;n++){let n=Math.floor(Math.random()*t.length);e.push(t.charAt(n))}return e.join("")}(),postBody:null,tenantId:e.tenantId,error:(0,a.az)(e,"no-auth-event")}}(e,n,r);await storage()._set(persistenceKey(e),o);let s=await _generateHandlerUrl(e,o,t),l=await function(e){let{cordova:t}=_cordovaWindow();return new Promise(n=>{t.plugins.browsertab.isAvailable(r=>{let i=null;r?t.plugins.browsertab.openUrl(e):i=t.InAppBrowser.open(e,(0,a.ay)()?"_blank":"_system","location=yes"),n(i)})})}(s);return _waitForAppResume(e,i,l)}_isIframeWebStorageSupported(e,t){throw Error("Method not implemented.")}_originValidation(e){let t=e._key();return this.originValidationPromises[t]||(this.originValidationPromises[t]=_validateOrigin(e)),this.originValidationPromises[t]}attachCallbackListeners(e,t){let{universalLinks:n,handleOpenURL:r,BuildInfo:i}=_cordovaWindow(),o=setTimeout(async()=>{await _getAndRemoveEvent(e),t.onEvent(generateNoEvent())},500),universalLinksCb=async n=>{clearTimeout(o);let r=await _getAndRemoveEvent(e),i=null;r&&(null==n?void 0:n.url)&&(i=function(e,t){var n,r;let i=function(e){let t=searchParamsOrEmpty(e),n=t.link?decodeURIComponent(t.link):void 0,r=searchParamsOrEmpty(n).link,i=t.deep_link_id?decodeURIComponent(t.deep_link_id):void 0,a=searchParamsOrEmpty(i).link;return a||i||r||n||e}(t);if(i.includes("/__/auth/callback")){let t=searchParamsOrEmpty(i),o=t.firebaseError?function(e){try{return JSON.parse(e)}catch(e){return null}}(decodeURIComponent(t.firebaseError)):null,s=null===(r=null===(n=null==o?void 0:o.code)||void 0===n?void 0:n.split("auth/"))||void 0===r?void 0:r[1],l=s?(0,a.az)(s):null;return l?{type:e.type,eventId:e.eventId,tenantId:e.tenantId,error:l,urlResponse:null,sessionId:null,postBody:null}:{type:e.type,eventId:e.eventId,tenantId:e.tenantId,sessionId:e.sessionId,urlResponse:i,postBody:null}}return null}(r,n.url)),t.onEvent(i||generateNoEvent())};void 0!==n&&"function"==typeof n.subscribe&&n.subscribe(null,universalLinksCb);let s=`${i.packageName.toLowerCase()}://`;_cordovaWindow().handleOpenURL=async e=>{if(e.toLowerCase().startsWith(s)&&universalLinksCb({url:e}),"function"==typeof r)try{r(e)}catch(e){console.error(e)}}}};function generateNoEvent(){return{type:"unknown",eventId:null,sessionId:null,urlResponse:null,postBody:null,tenantId:null,error:(0,a.az)("no-auth-event")}}function _getCurrentScheme(){var e;return(null===(e=null==self?void 0:self.location)||void 0===e?void 0:e.protocol)||null}function _isAndroidOrIosCordovaScheme(e=(0,o.z$)()){return!!(("file:"===_getCurrentScheme()||"ionic:"===_getCurrentScheme()||"capacitor:"===_getCurrentScheme())&&e.toLowerCase().match(/iphone|ipad|ipod|android/))}function _isWebStorageSupported(){try{let e=self.localStorage,t=a.aL();if(e){if(e.setItem(t,"1"),e.removeItem(t),function(e=(0,o.z$)()){return(0,o.w1)()&&(null==document?void 0:document.documentMode)===11||function(e=(0,o.z$)()){return/Edge\/\d+/.test(e)}(e)}())return(0,o.hl)();return!0}}catch(e){return _isWorker()&&(0,o.hl)()}return!1}function _isWorker(){return void 0!==n.g&&"WorkerGlobalScope"in n.g&&"importScripts"in n.g}function _isPopupRedirectSupported(){return("http:"===_getCurrentScheme()||"https:"===_getCurrentScheme()||(0,o.ru)()||_isAndroidOrIosCordovaScheme())&&!((0,o.b$)()||(0,o.UG)())&&_isWebStorageSupported()&&!_isWorker()}function _isLikelyCordova(){return _isAndroidOrIosCordovaScheme()&&"undefined"!=typeof document}async function _isCordova(){return!!_isLikelyCordova()&&new Promise(e=>{let t=setTimeout(()=>{e(!1)},1e3);document.addEventListener("deviceready",()=>{clearTimeout(t),e(!0)})})}/**
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
 */let d={LOCAL:"local",NONE:"none",SESSION:"session"},u=a.aA,c="persistence";async function _savePersistenceForRedirect(e){await e._initializationPromise;let t=getSessionStorageIfAvailable(),n=a.aD(c,e.config.apiKey,e.name);t&&t.setItem(n,e._getPersistence())}function getSessionStorageIfAvailable(){var e;try{return(null===(e="undefined"!=typeof window?window:null)||void 0===e?void 0:e.sessionStorage)||null}catch(e){return null}}/**
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
 */let p=a.aA;let CompatPopupRedirectResolver=class CompatPopupRedirectResolver{constructor(){this.browserResolver=a.aC(a.k),this.cordovaResolver=a.aC(l),this.underlyingResolver=null,this._redirectPersistence=a.a,this._completeRedirectFn=a.aE,this._overrideRedirectResult=a.aF}async _initialize(e){return await this.selectUnderlyingResolver(),this.assertedUnderlyingResolver._initialize(e)}async _openPopup(e,t,n,r){return await this.selectUnderlyingResolver(),this.assertedUnderlyingResolver._openPopup(e,t,n,r)}async _openRedirect(e,t,n,r){return await this.selectUnderlyingResolver(),this.assertedUnderlyingResolver._openRedirect(e,t,n,r)}_isIframeWebStorageSupported(e,t){this.assertedUnderlyingResolver._isIframeWebStorageSupported(e,t)}_originValidation(e){return this.assertedUnderlyingResolver._originValidation(e)}get _shouldInitProactively(){return _isLikelyCordova()||this.browserResolver._shouldInitProactively}get assertedUnderlyingResolver(){return p(this.underlyingResolver,"internal-error"),this.underlyingResolver}async selectUnderlyingResolver(){if(this.underlyingResolver)return;let e=await _isCordova();this.underlyingResolver=e?this.cordovaResolver:this.browserResolver}};function credentialFromObject(e){let t;let{_tokenResponse:n}=e instanceof o.ZR?e.customData:e;if(!n)return null;if(!(e instanceof o.ZR)&&"temporaryProof"in n&&"phoneNumber"in n)return a.P.credentialFromResult(e);let r=n.providerId;if(!r||r===a.p.PASSWORD)return null;switch(r){case a.p.GOOGLE:t=a.V;break;case a.p.FACEBOOK:t=a.U;break;case a.p.GITHUB:t=a.W;break;case a.p.TWITTER:t=a.Z;break;default:let{oauthIdToken:i,oauthAccessToken:s,oauthTokenSecret:l,pendingToken:d,nonce:u}=n;if(!s&&!l&&!i&&!d)return null;if(d){if(r.startsWith("saml."))return a.aO._create(r,d);return a.L._fromParams({providerId:r,signInMethod:r,pendingToken:d,idToken:i,accessToken:s})}return new a.X(r).credential({idToken:i,accessToken:s,rawNonce:u})}return e instanceof o.ZR?t.credentialFromError(e):t.credentialFromResult(e)}function convertCredential(e,t){return t.catch(t=>{throw t instanceof o.ZR&&function(e,t){var n;let r=null===(n=t.customData)||void 0===n?void 0:n._tokenResponse;if((null==t?void 0:t.code)==="auth/multi-factor-auth-required")t.resolver=new MultiFactorResolver(e,a.aq(e,t));else if(r){let e=credentialFromObject(t);e&&(t.credential=e,t.tenantId=r.tenantId||void 0,t.email=r.email||void 0,t.phoneNumber=r.phoneNumber||void 0)}}(e,t),t}).then(e=>{let t=e.operationType,n=e.user;return{operationType:t,credential:credentialFromObject(e),additionalUserInfo:a.ao(e),user:User.getOrCreate(n)}})}async function convertConfirmationResult(e,t){let n=await t;return{verificationId:n.verificationId,confirm:t=>convertCredential(e,n.confirm(t))}}let MultiFactorResolver=class MultiFactorResolver{constructor(e,t){this.resolver=t,this.auth=e.wrapped()}get session(){return this.resolver.session}get hints(){return this.resolver.hints}resolveSignIn(e){return convertCredential(this.auth.unwrap(),this.resolver.resolveSignIn(e))}};/**
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
 */let User=class User{constructor(e){this._delegate=e,this.multiFactor=a.ar(e)}static getOrCreate(e){return User.USER_MAP.has(e)||User.USER_MAP.set(e,new User(e)),User.USER_MAP.get(e)}delete(){return this._delegate.delete()}reload(){return this._delegate.reload()}toJSON(){return this._delegate.toJSON()}getIdTokenResult(e){return this._delegate.getIdTokenResult(e)}getIdToken(e){return this._delegate.getIdToken(e)}linkAndRetrieveDataWithCredential(e){return this.linkWithCredential(e)}async linkWithCredential(e){return convertCredential(this.auth,a.a0(this._delegate,e))}async linkWithPhoneNumber(e,t){return convertConfirmationResult(this.auth,a.l(this._delegate,e,t))}async linkWithPopup(e){return convertCredential(this.auth,a.d(this._delegate,e,CompatPopupRedirectResolver))}async linkWithRedirect(e){return await _savePersistenceForRedirect(a.aH(this.auth)),a.g(this._delegate,e,CompatPopupRedirectResolver)}reauthenticateAndRetrieveDataWithCredential(e){return this.reauthenticateWithCredential(e)}async reauthenticateWithCredential(e){return convertCredential(this.auth,a.a1(this._delegate,e))}reauthenticateWithPhoneNumber(e,t){return convertConfirmationResult(this.auth,a.r(this._delegate,e,t))}reauthenticateWithPopup(e){return convertCredential(this.auth,a.e(this._delegate,e,CompatPopupRedirectResolver))}async reauthenticateWithRedirect(e){return await _savePersistenceForRedirect(a.aH(this.auth)),a.h(this._delegate,e,CompatPopupRedirectResolver)}sendEmailVerification(e){return a.ae(this._delegate,e)}async unlink(e){return await a.an(this._delegate,e),this}updateEmail(e){return a.aj(this._delegate,e)}updatePassword(e){return a.ak(this._delegate,e)}updatePhoneNumber(e){return a.u(this._delegate,e)}updateProfile(e){return a.ai(this._delegate,e)}verifyBeforeUpdateEmail(e,t){return a.af(this._delegate,e,t)}get emailVerified(){return this._delegate.emailVerified}get isAnonymous(){return this._delegate.isAnonymous}get metadata(){return this._delegate.metadata}get phoneNumber(){return this._delegate.phoneNumber}get providerData(){return this._delegate.providerData}get refreshToken(){return this._delegate.refreshToken}get tenantId(){return this._delegate.tenantId}get displayName(){return this._delegate.displayName}get email(){return this._delegate.email}get photoURL(){return this._delegate.photoURL}get providerId(){return this._delegate.providerId}get uid(){return this._delegate.uid}get auth(){return this._delegate.auth}};User.USER_MAP=new WeakMap;/**
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
 */let h=a.aA;let Auth=class Auth{constructor(e,t){if(this.app=e,t.isInitialized()){this._delegate=t.getImmediate(),this.linkUnderlyingAuth();return}let{apiKey:n}=e.options;h(n,"invalid-api-key",{appName:e.name}),h(n,"invalid-api-key",{appName:e.name});let r="undefined"!=typeof window?CompatPopupRedirectResolver:void 0;this._delegate=t.initialize({options:{persistence:function(e,t){let n=function(e,t){let n=getSessionStorageIfAvailable();if(!n)return[];let r=a.aD(c,e,t),i=n.getItem(r);switch(i){case d.NONE:return[a.N];case d.LOCAL:return[a.i,a.a];case d.SESSION:return[a.a];default:return[]}}(e,t);if("undefined"==typeof self||n.includes(a.i)||n.push(a.i),"undefined"!=typeof window)for(let e of[a.b,a.a])n.includes(e)||n.push(e);return n.includes(a.N)||n.push(a.N),n}(n,e.name),popupRedirectResolver:r}}),this._delegate._updateErrorMap(a.D),this.linkUnderlyingAuth()}get emulatorConfig(){return this._delegate.emulatorConfig}get currentUser(){return this._delegate.currentUser?User.getOrCreate(this._delegate.currentUser):null}get languageCode(){return this._delegate.languageCode}set languageCode(e){this._delegate.languageCode=e}get settings(){return this._delegate.settings}get tenantId(){return this._delegate.tenantId}set tenantId(e){this._delegate.tenantId=e}useDeviceLanguage(){this._delegate.useDeviceLanguage()}signOut(){return this._delegate.signOut()}useEmulator(e,t){a.I(this._delegate,e,t)}applyActionCode(e){return a.a5(this._delegate,e)}checkActionCode(e){return a.a6(this._delegate,e)}confirmPasswordReset(e,t){return a.a4(this._delegate,e,t)}async createUserWithEmailAndPassword(e,t){return convertCredential(this._delegate,a.a8(this._delegate,e,t))}fetchProvidersForEmail(e){return this.fetchSignInMethodsForEmail(e)}fetchSignInMethodsForEmail(e){return a.ad(this._delegate,e)}isSignInWithEmailLink(e){return a.ab(this._delegate,e)}async getRedirectResult(){h(_isPopupRedirectSupported(),this._delegate,"operation-not-supported-in-this-environment");let e=await a.j(this._delegate,CompatPopupRedirectResolver);return e?convertCredential(this._delegate,Promise.resolve(e)):{credential:null,user:null}}addFrameworkForLogging(e){!/**
 * @license
 * Copyright 2017 Google LLC
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
 */function(e,t){(0,a.aH)(e)._logFramework(t)}(this._delegate,e)}onAuthStateChanged(e,t,n){let{next:r,error:i,complete:a}=wrapObservers(e,t,n);return this._delegate.onAuthStateChanged(r,i,a)}onIdTokenChanged(e,t,n){let{next:r,error:i,complete:a}=wrapObservers(e,t,n);return this._delegate.onIdTokenChanged(r,i,a)}sendSignInLinkToEmail(e,t){return a.aa(this._delegate,e,t)}sendPasswordResetEmail(e,t){return a.a3(this._delegate,e,t||void 0)}async setPersistence(e){let t;switch(!function(e,t){if(u(Object.values(d).includes(t),e,"invalid-persistence-type"),(0,o.b$)()){u(t!==d.SESSION,e,"unsupported-persistence-type");return}if((0,o.UG)()){u(t===d.NONE,e,"unsupported-persistence-type");return}if(_isWorker()){u(t===d.NONE||t===d.LOCAL&&(0,o.hl)(),e,"unsupported-persistence-type");return}u(t===d.NONE||_isWebStorageSupported(),e,"unsupported-persistence-type")}(this._delegate,e),e){case d.SESSION:t=a.a;break;case d.LOCAL:let n=await a.aC(a.i)._isAvailable();t=n?a.i:a.b;break;case d.NONE:t=a.N;break;default:return a.av("argument-error",{appName:this._delegate.name})}return this._delegate.setPersistence(t)}signInAndRetrieveDataWithCredential(e){return this.signInWithCredential(e)}signInAnonymously(){return convertCredential(this._delegate,a._(this._delegate))}signInWithCredential(e){return convertCredential(this._delegate,a.$(this._delegate,e))}signInWithCustomToken(e){return convertCredential(this._delegate,a.a2(this._delegate,e))}signInWithEmailAndPassword(e,t){return convertCredential(this._delegate,a.a9(this._delegate,e,t))}signInWithEmailLink(e,t){return convertCredential(this._delegate,a.ac(this._delegate,e,t))}signInWithPhoneNumber(e,t){return convertConfirmationResult(this._delegate,a.s(this._delegate,e,t))}async signInWithPopup(e){return h(_isPopupRedirectSupported(),this._delegate,"operation-not-supported-in-this-environment"),convertCredential(this._delegate,a.c(this._delegate,e,CompatPopupRedirectResolver))}async signInWithRedirect(e){return h(_isPopupRedirectSupported(),this._delegate,"operation-not-supported-in-this-environment"),await _savePersistenceForRedirect(this._delegate),a.f(this._delegate,e,CompatPopupRedirectResolver)}updateCurrentUser(e){return this._delegate.updateCurrentUser(e)}verifyPasswordResetCode(e){return a.a7(this._delegate,e)}unwrap(){return this._delegate}_delete(){return this._delegate._delete()}linkUnderlyingAuth(){this._delegate.wrapped=()=>this}};function wrapObservers(e,t,n){let r=e;"function"!=typeof e&&({next:r,error:t,complete:n}=e);let i=r;return{next:e=>i(e&&User.getOrCreate(e)),error:t,complete:n}}Auth.Persistence=d;/**
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
 */let PhoneAuthProvider=class PhoneAuthProvider{constructor(){this.providerId="phone",this._delegate=new a.P(i.Z.auth().unwrap())}static credential(e,t){return a.P.credential(e,t)}verifyPhoneNumber(e,t){return this._delegate.verifyPhoneNumber(e,t)}unwrap(){return this._delegate}};PhoneAuthProvider.PHONE_SIGN_IN_METHOD=a.P.PHONE_SIGN_IN_METHOD,PhoneAuthProvider.PROVIDER_ID=a.P.PROVIDER_ID;/**
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
 */let g=a.aA;(r=i.Z).INTERNAL.registerComponent(new s.wA("auth-compat",e=>{let t=e.getProvider("app-compat").getImmediate(),n=e.getProvider("auth");return new Auth(t,n)},"PUBLIC").setServiceProps({ActionCodeInfo:{Operation:{EMAIL_SIGNIN:a.A.EMAIL_SIGNIN,PASSWORD_RESET:a.A.PASSWORD_RESET,RECOVER_EMAIL:a.A.RECOVER_EMAIL,REVERT_SECOND_FACTOR_ADDITION:a.A.REVERT_SECOND_FACTOR_ADDITION,VERIFY_AND_CHANGE_EMAIL:a.A.VERIFY_AND_CHANGE_EMAIL,VERIFY_EMAIL:a.A.VERIFY_EMAIL}},EmailAuthProvider:a.Q,FacebookAuthProvider:a.U,GithubAuthProvider:a.W,GoogleAuthProvider:a.V,OAuthProvider:a.X,SAMLAuthProvider:a.Y,PhoneAuthProvider:PhoneAuthProvider,PhoneMultiFactorGenerator:a.m,RecaptchaVerifier:class{constructor(e,t,n=i.Z.app()){var r;g(null===(r=n.options)||void 0===r?void 0:r.apiKey,"invalid-api-key",{appName:n.name}),this._delegate=new a.R(e,t,n.auth()),this.type=this._delegate.type}clear(){this._delegate.clear()}render(){return this._delegate.render()}verify(){return this._delegate.verify()}},TwitterAuthProvider:a.Z,Auth,AuthCredential:a.J,Error:o.ZR}).setInstantiationMode("LAZY").setMultipleInstances(!1)),r.registerVersion("@firebase/auth-compat","0.4.2")},44:function(e,t,n){function __rest(e,t){var n={};for(var r in e)Object.prototype.hasOwnProperty.call(e,r)&&0>t.indexOf(r)&&(n[r]=e[r]);if(null!=e&&"function"==typeof Object.getOwnPropertySymbols)for(var i=0,r=Object.getOwnPropertySymbols(e);i<r.length;i++)0>t.indexOf(r[i])&&Object.prototype.propertyIsEnumerable.call(e,r[i])&&(n[r[i]]=e[r[i]]);return n}n.d(t,{_T:function(){return __rest}}),"function"==typeof SuppressedError&&SuppressedError}}]);