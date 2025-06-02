"use strict";(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[4308],{4308:function(e,t,r){r.d(t,{$Y:function(){return m},B0:function(){return uploadBytesResumable},FN:function(){return g},IX:function(){return UploadTask},Jt:function(){return getDownloadURL},UJ:function(){return FbsBlob},Ym:function(){return updateMetadata},a1:function(){return connectStorageEmulator},aF:function(){return listAll},bm:function(){return d},cF:function(){return getStorage},g6:function(){return _getChild},gE:function(){return Location},gH:function(){return invalidArgument},iH:function(){return ref},oq:function(){return deleteObject},pb:function(){return list},qm:function(){return dataFromString},sd:function(){return getMetadata},y4:function(){return invalidRootOperation}});var n,s,i,o,a=r(3991),l=r(8745),u=r(5538);/**
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
 */let c="firebasestorage.googleapis.com",h="storageBucket";/**
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
 */let StorageError=class StorageError extends l.ZR{constructor(e,t,r=0){super(prependCode(e),`Firebase Storage: ${t} (${prependCode(e)})`),this.status_=r,this.customData={serverResponse:null},this._baseMessage=this.message,Object.setPrototypeOf(this,StorageError.prototype)}get status(){return this.status_}set status(e){this.status_=e}_codeEquals(e){return prependCode(e)===this.code}get serverResponse(){return this.customData.serverResponse}set serverResponse(e){this.customData.serverResponse=e,this.customData.serverResponse?this.message=`${this._baseMessage}
${this.customData.serverResponse}`:this.message=this._baseMessage}};function prependCode(e){return"storage/"+e}function unknown(){return new StorageError(i.UNKNOWN,"An unknown error occurred, please check the error payload for server response.")}function retryLimitExceeded(){return new StorageError(i.RETRY_LIMIT_EXCEEDED,"Max retry time for operation exceeded, please try again.")}function canceled(){return new StorageError(i.CANCELED,"User canceled the upload/download.")}function cannotSliceBlob(){return new StorageError(i.CANNOT_SLICE_BLOB,"Cannot slice blob for upload. Please retry the upload.")}function invalidArgument(e){return new StorageError(i.INVALID_ARGUMENT,e)}function appDeleted(){return new StorageError(i.APP_DELETED,"The Firebase app was deleted.")}function invalidRootOperation(e){return new StorageError(i.INVALID_ROOT_OPERATION,"The operation '"+e+"' cannot be performed on a root reference, create a non-root reference using child, such as .child('file.png').")}function invalidFormat(e,t){return new StorageError(i.INVALID_FORMAT,"String does not match format '"+e+"': "+t)}function internalError(e){throw new StorageError(i.INTERNAL_ERROR,"Internal error: "+e)}(n=i||(i={})).UNKNOWN="unknown",n.OBJECT_NOT_FOUND="object-not-found",n.BUCKET_NOT_FOUND="bucket-not-found",n.PROJECT_NOT_FOUND="project-not-found",n.QUOTA_EXCEEDED="quota-exceeded",n.UNAUTHENTICATED="unauthenticated",n.UNAUTHORIZED="unauthorized",n.UNAUTHORIZED_APP="unauthorized-app",n.RETRY_LIMIT_EXCEEDED="retry-limit-exceeded",n.INVALID_CHECKSUM="invalid-checksum",n.CANCELED="canceled",n.INVALID_EVENT_NAME="invalid-event-name",n.INVALID_URL="invalid-url",n.INVALID_DEFAULT_BUCKET="invalid-default-bucket",n.NO_DEFAULT_BUCKET="no-default-bucket",n.CANNOT_SLICE_BLOB="cannot-slice-blob",n.SERVER_FILE_WRONG_SIZE="server-file-wrong-size",n.NO_DOWNLOAD_URL="no-download-url",n.INVALID_ARGUMENT="invalid-argument",n.INVALID_ARGUMENT_COUNT="invalid-argument-count",n.APP_DELETED="app-deleted",n.INVALID_ROOT_OPERATION="invalid-root-operation",n.INVALID_FORMAT="invalid-format",n.INTERNAL_ERROR="internal-error",n.UNSUPPORTED_ENVIRONMENT="unsupported-environment";/**
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
 */let Location=class Location{constructor(e,t){this.bucket=e,this.path_=t}get path(){return this.path_}get isRoot(){return 0===this.path.length}fullServerUrl(){let e=encodeURIComponent;return"/b/"+e(this.bucket)+"/o/"+e(this.path)}bucketOnlyServerUrl(){let e=encodeURIComponent;return"/b/"+e(this.bucket)+"/o"}static makeFromBucketSpec(e,t){let r;try{r=Location.makeFromUrl(e,t)}catch(t){return new Location(e,"")}if(""===r.path)return r;throw new StorageError(i.INVALID_DEFAULT_BUCKET,"Invalid default bucket '"+e+"'.")}static makeFromUrl(e,t){let r=null,n="([A-Za-z0-9.\\-_]+)",s=RegExp("^gs://"+n+"(/(.*))?$","i");function httpModify(e){e.path_=decodeURIComponent(e.path)}let o=t.replace(/[.]/g,"\\."),a=RegExp(`^https?://${o}/v[A-Za-z0-9_]+/b/${n}/o(/([^?#]*).*)?$`,"i"),l=RegExp(`^https?://${t===c?"(?:storage.googleapis.com|storage.cloud.google.com)":t}/${n}/([^?#]*)`,"i"),u=[{regex:s,indices:{bucket:1,path:3},postModify:function(e){"/"===e.path.charAt(e.path.length-1)&&(e.path_=e.path_.slice(0,-1))}},{regex:a,indices:{bucket:1,path:3},postModify:httpModify},{regex:l,indices:{bucket:1,path:2},postModify:httpModify}];for(let t=0;t<u.length;t++){let n=u[t],s=n.regex.exec(e);if(s){let e=s[n.indices.bucket],t=s[n.indices.path];t||(t=""),r=new Location(e,t),n.postModify(r);break}}if(null==r)throw new StorageError(i.INVALID_URL,"Invalid URL '"+e+"'.");return r}};let FailRequest=class FailRequest{constructor(e){this.promise_=Promise.reject(e)}getPromise(){return this.promise_}cancel(e=!1){}};function isString(e){return"string"==typeof e||e instanceof String}function isNativeBlob(e){return isNativeBlobDefined()&&e instanceof Blob}function isNativeBlobDefined(){return"undefined"!=typeof Blob&&!(0,l.UG)()}function validateNumber(e,t,r,n){if(n<t)throw invalidArgument(`Invalid value for '${e}'. Expected ${t} or greater.`);if(n>r)throw invalidArgument(`Invalid value for '${e}'. Expected ${r} or less.`)}/**
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
 */function makeUrl(e,t,r){let n=t;return null==r&&(n=`https://${t}`),`${r}://${n}/v0${e}`}function makeQueryString(e){let t=encodeURIComponent,r="?";for(let n in e)if(e.hasOwnProperty(n)){let s=t(n)+"="+t(e[n]);r=r+s+"&"}return r.slice(0,-1)}/**
 * @license
 * Copyright 2022 Google LLC
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
 */function isRetryStatusCode(e,t){let r=e>=500&&e<600,n=-1!==[408,429].indexOf(e),s=-1!==t.indexOf(e);return r||n||s}(s=o||(o={}))[s.NO_ERROR=0]="NO_ERROR",s[s.NETWORK_ERROR=1]="NETWORK_ERROR",s[s.ABORT=2]="ABORT";/**
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
 */let NetworkRequest=class NetworkRequest{constructor(e,t,r,n,s,i,o,a,l,u,c,h=!0){this.url_=e,this.method_=t,this.headers_=r,this.body_=n,this.successCodes_=s,this.additionalRetryCodes_=i,this.callback_=o,this.errorCallback_=a,this.timeout_=l,this.progressCallback_=u,this.connectionFactory_=c,this.retry=h,this.pendingConnection_=null,this.backoffId_=null,this.canceled_=!1,this.appDelete_=!1,this.promise_=new Promise((e,t)=>{this.resolve_=e,this.reject_=t,this.start_()})}start_(){let backoffDone=(e,t)=>{let r=this.resolve_,n=this.reject_,s=t.connection;if(t.wasSuccessCode)try{let e=this.callback_(s,s.getResponse());void 0!==e?r(e):r()}catch(e){n(e)}else if(null!==s){let e=unknown();e.serverResponse=s.getErrorText(),n(this.errorCallback_?this.errorCallback_(s,e):e)}else if(t.canceled){let e=this.appDelete_?appDeleted():canceled();n(e)}else{let e=retryLimitExceeded();n(e)}};this.canceled_?backoffDone(!1,new RequestEndStatus(!1,null,!0)):this.backoffId_=/**
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
 */function(e,t,r){let n=1,s=null,i=null,o=!1,a=0,l=!1;function triggerCallback(...e){l||(l=!0,t.apply(null,e))}function callWithDelay(t){s=setTimeout(()=>{s=null,e(responseHandler,2===a)},t)}function clearGlobalTimeout(){i&&clearTimeout(i)}function responseHandler(e,...t){let r;if(l){clearGlobalTimeout();return}if(e){clearGlobalTimeout(),triggerCallback.call(null,e,...t);return}let s=2===a||o;if(s){clearGlobalTimeout(),triggerCallback.call(null,e,...t);return}n<64&&(n*=2),1===a?(a=2,r=0):r=(n+Math.random())*1e3,callWithDelay(r)}let u=!1;function stop(e){!u&&(u=!0,clearGlobalTimeout(),!l&&(null!==s?(e||(a=2),clearTimeout(s),callWithDelay(0)):e||(a=1)))}return callWithDelay(0),i=setTimeout(()=>{o=!0,stop(!0)},r),stop}((e,t)=>{if(t){e(!1,new RequestEndStatus(!1,null,!0));return}let r=this.connectionFactory_();this.pendingConnection_=r;let progressListener=e=>{let t=e.loaded,r=e.lengthComputable?e.total:-1;null!==this.progressCallback_&&this.progressCallback_(t,r)};null!==this.progressCallback_&&r.addUploadProgressListener(progressListener),r.send(this.url_,this.method_,this.body_,this.headers_).then(()=>{null!==this.progressCallback_&&r.removeUploadProgressListener(progressListener),this.pendingConnection_=null;let t=r.getErrorCode()===o.NO_ERROR,n=r.getStatus();if(!t||isRetryStatusCode(n,this.additionalRetryCodes_)&&this.retry){let t=r.getErrorCode()===o.ABORT;e(!1,new RequestEndStatus(!1,null,t));return}let s=-1!==this.successCodes_.indexOf(n);e(!0,new RequestEndStatus(s,r))})},backoffDone,this.timeout_)}getPromise(){return this.promise_}cancel(e){this.canceled_=!0,this.appDelete_=e||!1,null!==this.backoffId_&&(0,this.backoffId_)(!1),null!==this.pendingConnection_&&this.pendingConnection_.abort()}};let RequestEndStatus=class RequestEndStatus{constructor(e,t,r){this.wasSuccessCode=e,this.connection=t,this.canceled=!!r}};function getBlob$1(...e){let t="undefined"!=typeof BlobBuilder?BlobBuilder:"undefined"!=typeof WebKitBlobBuilder?WebKitBlobBuilder:void 0;if(void 0!==t){let r=new t;for(let t=0;t<e.length;t++)r.append(e[t]);return r.getBlob()}if(isNativeBlobDefined())return new Blob(e);throw new StorageError(i.UNSUPPORTED_ENVIRONMENT,"This browser doesn't seem to support creating Blobs")}/**
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
 */let d={RAW:"raw",BASE64:"base64",BASE64URL:"base64url",DATA_URL:"data_url"};let StringData=class StringData{constructor(e,t){this.data=e,this.contentType=t||null}};function dataFromString(e,t){switch(e){case d.RAW:return new StringData(utf8Bytes_(t));case d.BASE64:case d.BASE64URL:return new StringData(base64Bytes_(e,t));case d.DATA_URL:return new StringData(function(e){let t=new DataURLParts(e);return t.base64?base64Bytes_(d.BASE64,t.rest):function(e){let t;try{t=decodeURIComponent(e)}catch(e){throw invalidFormat(d.DATA_URL,"Malformed data URL.")}return utf8Bytes_(t)}(t.rest)}(t),function(e){let t=new DataURLParts(e);return t.contentType}(t))}throw unknown()}function utf8Bytes_(e){let t=[];for(let r=0;r<e.length;r++){let n=e.charCodeAt(r);if(n<=127)t.push(n);else if(n<=2047)t.push(192|n>>6,128|63&n);else if((64512&n)==55296){let s=r<e.length-1&&(64512&e.charCodeAt(r+1))==56320;if(s){let s=n,i=e.charCodeAt(++r);n=65536|(1023&s)<<10|1023&i,t.push(240|n>>18,128|n>>12&63,128|n>>6&63,128|63&n)}else t.push(239,191,189)}else(64512&n)==56320?t.push(239,191,189):t.push(224|n>>12,128|n>>6&63,128|63&n)}return new Uint8Array(t)}function base64Bytes_(e,t){let r;switch(e){case d.BASE64:{let r=-1!==t.indexOf("-"),n=-1!==t.indexOf("_");if(r||n)throw invalidFormat(e,"Invalid character '"+(r?"-":"_")+"' found: is it base64url encoded?");break}case d.BASE64URL:{let r=-1!==t.indexOf("+"),n=-1!==t.indexOf("/");if(r||n)throw invalidFormat(e,"Invalid character '"+(r?"+":"/")+"' found: is it base64 encoded?");t=t.replace(/-/g,"+").replace(/_/g,"/")}}try{r=/**
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
 */function(e){if("undefined"==typeof atob)throw new StorageError(i.UNSUPPORTED_ENVIRONMENT,"base-64 is missing. Make sure to install the required polyfills. See https://firebase.google.com/docs/web/environments-js-sdk#polyfills for more information.");return atob(e)}(t)}catch(t){if(t.message.includes("polyfill"))throw t;throw invalidFormat(e,"Invalid character found")}let n=new Uint8Array(r.length);for(let e=0;e<r.length;e++)n[e]=r.charCodeAt(e);return n}let DataURLParts=class DataURLParts{constructor(e){this.base64=!1,this.contentType=null;let t=e.match(/^data:([^,]+)?,/);if(null===t)throw invalidFormat(d.DATA_URL,"Must be formatted 'data:[<mediatype>][;base64],<data>");let r=t[1]||null;null!=r&&(this.base64=function(e,t){let r=e.length>=t.length;return!!r&&e.substring(e.length-t.length)===t}(r,";base64"),this.contentType=this.base64?r.substring(0,r.length-7):r),this.rest=e.substring(e.indexOf(",")+1)}};/**
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
 */let FbsBlob=class FbsBlob{constructor(e,t){let r=0,n="";isNativeBlob(e)?(this.data_=e,r=e.size,n=e.type):e instanceof ArrayBuffer?(t?this.data_=new Uint8Array(e):(this.data_=new Uint8Array(e.byteLength),this.data_.set(new Uint8Array(e))),r=this.data_.length):e instanceof Uint8Array&&(t?this.data_=e:(this.data_=new Uint8Array(e.length),this.data_.set(e)),r=e.length),this.size_=r,this.type_=n}size(){return this.size_}type(){return this.type_}slice(e,t){if(isNativeBlob(this.data_)){let r=this.data_,n=r.webkitSlice?r.webkitSlice(e,t):r.mozSlice?r.mozSlice(e,t):r.slice?r.slice(e,t):null;return null===n?null:new FbsBlob(n)}{let r=new Uint8Array(this.data_.buffer,e,t-e);return new FbsBlob(r,!0)}}static getBlob(...e){if(isNativeBlobDefined()){let t=e.map(e=>e instanceof FbsBlob?e.data_:e);return new FbsBlob(getBlob$1.apply(null,t))}{let t=e.map(e=>isString(e)?dataFromString(d.RAW,e).data:e.data_),r=0;t.forEach(e=>{r+=e.byteLength});let n=new Uint8Array(r),s=0;return t.forEach(e=>{for(let t=0;t<e.length;t++)n[s++]=e[t]}),new FbsBlob(n,!0)}}uploadData(){return this.data_}};/**
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
 */function jsonObjectOrNull(e){var t;let r;try{r=JSON.parse(e)}catch(e){return null}return"object"!=typeof(t=r)||Array.isArray(t)?null:r}function lastComponent(e){let t=e.lastIndexOf("/",e.length-2);return -1===t?e:e.slice(t+1)}/**
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
 */function noXform_(e,t){return t}let Mapping=class Mapping{constructor(e,t,r,n){this.server=e,this.local=t||e,this.writable=!!r,this.xform=n||noXform_}};let p=null;function getMappings(){if(p)return p;let e=[];e.push(new Mapping("bucket")),e.push(new Mapping("generation")),e.push(new Mapping("metageneration")),e.push(new Mapping("name","fullPath",!0));let t=new Mapping("name");t.xform=function(e,t){return!isString(t)||t.length<2?t:lastComponent(t)},e.push(t);let r=new Mapping("size");return r.xform=function(e,t){return void 0!==t?Number(t):t},e.push(r),e.push(new Mapping("timeCreated")),e.push(new Mapping("updated")),e.push(new Mapping("md5Hash",null,!0)),e.push(new Mapping("cacheControl",null,!0)),e.push(new Mapping("contentDisposition",null,!0)),e.push(new Mapping("contentEncoding",null,!0)),e.push(new Mapping("contentLanguage",null,!0)),e.push(new Mapping("contentType",null,!0)),e.push(new Mapping("metadata","customMetadata",!0)),p=e}function fromResourceString(e,t,r){let n=jsonObjectOrNull(t);return null===n?null:function(e,t,r){let n={};n.type="file";let s=r.length;for(let e=0;e<s;e++){let s=r[e];n[s.local]=s.xform(n,t[s.server])}return Object.defineProperty(n,"ref",{get:function(){let t=n.bucket,r=n.fullPath,s=new Location(t,r);return e._makeStorageReference(s)}}),n}(e,n,r)}function toResourceString(e,t){let r={},n=t.length;for(let s=0;s<n;s++){let n=t[s];n.writable&&(r[n.server]=e[n.local])}return JSON.stringify(r)}/**
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
 */let _="prefixes",f="items";let RequestInfo=class RequestInfo{constructor(e,t,r,n){this.url=e,this.method=t,this.handler=r,this.timeout=n,this.urlParams={},this.headers={},this.body=null,this.errorHandler=null,this.progressCallback=null,this.successCodes=[200],this.additionalRetryCodes=[]}};/**
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
 */function handlerCheck(e){if(!e)throw unknown()}function metadataHandler(e,t){return function(r,n){let s=fromResourceString(e,n,t);return handlerCheck(null!==s),s}}function sharedErrorHandler(e){return function(t,r){var n,s;let o;return 401===t.getStatus()?o=t.getErrorText().includes("Firebase App Check token is invalid")?new StorageError(i.UNAUTHORIZED_APP,"This app does not have permission to access Firebase Storage on this project."):new StorageError(i.UNAUTHENTICATED,"User is not authenticated, please authenticate using Firebase Authentication and try again."):402===t.getStatus()?(n=e.bucket,o=new StorageError(i.QUOTA_EXCEEDED,"Quota for bucket '"+n+"' exceeded, please view quota on https://firebase.google.com/pricing/.")):403===t.getStatus()?(s=e.path,o=new StorageError(i.UNAUTHORIZED,"User does not have permission to access '"+s+"'.")):o=r,o.status=t.getStatus(),o.serverResponse=r.serverResponse,o}}function objectErrorHandler(e){let t=sharedErrorHandler(e);return function(r,n){let s=t(r,n);if(404===r.getStatus()){var o;o=e.path,s=new StorageError(i.OBJECT_NOT_FOUND,"Object '"+o+"' does not exist.")}return s.serverResponse=n.serverResponse,s}}function getMetadata$2(e,t,r){let n=t.fullServerUrl(),s=makeUrl(n,e.host,e._protocol),i=e.maxOperationRetryTime,o=new RequestInfo(s,"GET",metadataHandler(e,r),i);return o.errorHandler=objectErrorHandler(t),o}function metadataForUpload_(e,t,r){let n=Object.assign({},r);return n.fullPath=e.path,n.size=t.size(),!n.contentType&&(n.contentType=t&&t.type()||"application/octet-stream"),n}let ResumableUploadStatus=class ResumableUploadStatus{constructor(e,t,r,n){this.current=e,this.total=t,this.finalized=!!r,this.metadata=n||null}};function checkResumeHeader_(e,t){let r=null;try{r=e.getResponseHeader("X-Goog-Upload-Status")}catch(e){handlerCheck(!1)}return handlerCheck(!!r&&-1!==(t||["active"]).indexOf(r)),r}/**
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
 */let g={STATE_CHANGED:"state_changed"},m={RUNNING:"running",PAUSED:"paused",SUCCESS:"success",CANCELED:"canceled",ERROR:"error"};function taskStateFromInternalTaskState(e){switch(e){case"running":case"pausing":case"canceling":return m.RUNNING;case"paused":return m.PAUSED;case"success":return m.SUCCESS;case"canceled":return m.CANCELED;default:return m.ERROR}}/**
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
 */let Observer=class Observer{constructor(e,t,r){"function"==typeof e||null!=t||null!=r?(this.next=e,this.error=null!=t?t:void 0,this.complete=null!=r?r:void 0):(this.next=e.next,this.error=e.error,this.complete=e.complete)}};/**
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
 */function async(e){return(...t)=>{Promise.resolve().then(()=>e(...t))}}let XhrConnection=class XhrConnection{constructor(){this.sent_=!1,this.xhr_=new XMLHttpRequest,this.initXhr(),this.errorCode_=o.NO_ERROR,this.sendPromise_=new Promise(e=>{this.xhr_.addEventListener("abort",()=>{this.errorCode_=o.ABORT,e()}),this.xhr_.addEventListener("error",()=>{this.errorCode_=o.NETWORK_ERROR,e()}),this.xhr_.addEventListener("load",()=>{e()})})}send(e,t,r,n){if(this.sent_)throw internalError("cannot .send() more than once");if(this.sent_=!0,this.xhr_.open(t,e,!0),void 0!==n)for(let e in n)n.hasOwnProperty(e)&&this.xhr_.setRequestHeader(e,n[e].toString());return void 0!==r?this.xhr_.send(r):this.xhr_.send(),this.sendPromise_}getErrorCode(){if(!this.sent_)throw internalError("cannot .getErrorCode() before sending");return this.errorCode_}getStatus(){if(!this.sent_)throw internalError("cannot .getStatus() before sending");try{return this.xhr_.status}catch(e){return -1}}getResponse(){if(!this.sent_)throw internalError("cannot .getResponse() before sending");return this.xhr_.response}getErrorText(){if(!this.sent_)throw internalError("cannot .getErrorText() before sending");return this.xhr_.statusText}abort(){this.xhr_.abort()}getResponseHeader(e){return this.xhr_.getResponseHeader(e)}addUploadProgressListener(e){null!=this.xhr_.upload&&this.xhr_.upload.addEventListener("progress",e)}removeUploadProgressListener(e){null!=this.xhr_.upload&&this.xhr_.upload.removeEventListener("progress",e)}};let XhrTextConnection=class XhrTextConnection extends XhrConnection{initXhr(){this.xhr_.responseType="text"}};function newTextConnection(){return new XhrTextConnection}/**
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
 */let UploadTask=class UploadTask{constructor(e,t,r=null){this._transferred=0,this._needToFetchStatus=!1,this._needToFetchMetadata=!1,this._observers=[],this._error=void 0,this._uploadUrl=void 0,this._request=void 0,this._chunkMultiplier=1,this._resolve=void 0,this._reject=void 0,this._ref=e,this._blob=t,this._metadata=r,this._mappings=getMappings(),this._resumable=this._shouldDoResumable(this._blob),this._state="running",this._errorHandler=e=>{if(this._request=void 0,this._chunkMultiplier=1,e._codeEquals(i.CANCELED))this._needToFetchStatus=!0,this.completeTransitions_();else{let t=this.isExponentialBackoffExpired();if(isRetryStatusCode(e.status,[])){if(t)e=retryLimitExceeded();else{this.sleepTime=Math.max(2*this.sleepTime,1e3),this._needToFetchStatus=!0,this.completeTransitions_();return}}this._error=e,this._transition("error")}},this._metadataErrorHandler=e=>{this._request=void 0,e._codeEquals(i.CANCELED)?this.completeTransitions_():(this._error=e,this._transition("error"))},this.sleepTime=0,this.maxSleepTime=this._ref.storage.maxUploadRetryTime,this._promise=new Promise((e,t)=>{this._resolve=e,this._reject=t,this._start()}),this._promise.then(null,()=>{})}isExponentialBackoffExpired(){return this.sleepTime>this.maxSleepTime}_makeProgressCallback(){let e=this._transferred;return t=>this._updateProgress(e+t)}_shouldDoResumable(e){return e.size()>262144}_start(){"running"===this._state&&void 0===this._request&&(this._resumable?void 0===this._uploadUrl?this._createResumable():this._needToFetchStatus?this._fetchStatus():this._needToFetchMetadata?this._fetchMetadata():this.pendingTimeout=setTimeout(()=>{this.pendingTimeout=void 0,this._continueUpload()},this.sleepTime):this._oneShotUpload())}_resolveToken(e){Promise.all([this._ref.storage._getAuthToken(),this._ref.storage._getAppCheckToken()]).then(([t,r])=>{switch(this._state){case"running":e(t,r);break;case"canceling":this._transition("canceled");break;case"pausing":this._transition("paused")}})}_createResumable(){this._resolveToken((e,t)=>{let r=function(e,t,r,n,s){let i=t.bucketOnlyServerUrl(),o=metadataForUpload_(t,n,s),a={name:o.fullPath},l=makeUrl(i,e.host,e._protocol),u={"X-Goog-Upload-Protocol":"resumable","X-Goog-Upload-Command":"start","X-Goog-Upload-Header-Content-Length":`${n.size()}`,"X-Goog-Upload-Header-Content-Type":o.contentType,"Content-Type":"application/json; charset=utf-8"},c=toResourceString(o,r),h=e.maxUploadRetryTime,d=new RequestInfo(l,"POST",function(e){let t;checkResumeHeader_(e);try{t=e.getResponseHeader("X-Goog-Upload-URL")}catch(e){handlerCheck(!1)}return handlerCheck(isString(t)),t},h);return d.urlParams=a,d.headers=u,d.body=c,d.errorHandler=sharedErrorHandler(t),d}(this._ref.storage,this._ref._location,this._mappings,this._blob,this._metadata),n=this._ref.storage._makeRequest(r,newTextConnection,e,t);this._request=n,n.getPromise().then(e=>{this._request=void 0,this._uploadUrl=e,this._needToFetchStatus=!1,this.completeTransitions_()},this._errorHandler)})}_fetchStatus(){let e=this._uploadUrl;this._resolveToken((t,r)=>{let n=function(e,t,r,n){let s=e.maxUploadRetryTime,i=new RequestInfo(r,"POST",function(e){let t=checkResumeHeader_(e,["active","final"]),r=null;try{r=e.getResponseHeader("X-Goog-Upload-Size-Received")}catch(e){handlerCheck(!1)}r||handlerCheck(!1);let s=Number(r);return handlerCheck(!isNaN(s)),new ResumableUploadStatus(s,n.size(),"final"===t)},s);return i.headers={"X-Goog-Upload-Command":"query"},i.errorHandler=sharedErrorHandler(t),i}(this._ref.storage,this._ref._location,e,this._blob),s=this._ref.storage._makeRequest(n,newTextConnection,t,r);this._request=s,s.getPromise().then(e=>{this._request=void 0,this._updateProgress(e.current),this._needToFetchStatus=!1,e.finalized&&(this._needToFetchMetadata=!0),this.completeTransitions_()},this._errorHandler)})}_continueUpload(){let e=262144*this._chunkMultiplier,t=new ResumableUploadStatus(this._transferred,this._blob.size()),r=this._uploadUrl;this._resolveToken((n,s)=>{let o;try{o=function(e,t,r,n,s,o,a,l){let u=new ResumableUploadStatus(0,0);if(a?(u.current=a.current,u.total=a.total):(u.current=0,u.total=n.size()),n.size()!==u.total)throw new StorageError(i.SERVER_FILE_WRONG_SIZE,"Server recorded incorrect upload file size, please retry the upload.");let c=u.total-u.current,h=c;s>0&&(h=Math.min(h,s));let d=u.current,p=d+h,_="";_=0===h?"finalize":c===h?"upload, finalize":"upload";let f={"X-Goog-Upload-Command":_,"X-Goog-Upload-Offset":`${u.current}`},g=n.slice(d,p);if(null===g)throw cannotSliceBlob();let m=t.maxUploadRetryTime,b=new RequestInfo(r,"POST",function(e,r){let s;let i=checkResumeHeader_(e,["active","final"]),a=u.current+h,l=n.size();return s="final"===i?metadataHandler(t,o)(e,r):null,new ResumableUploadStatus(a,l,"final"===i,s)},m);return b.headers=f,b.body=g.uploadData(),b.progressCallback=l||null,b.errorHandler=sharedErrorHandler(e),b}(this._ref._location,this._ref.storage,r,this._blob,e,this._mappings,t,this._makeProgressCallback())}catch(e){this._error=e,this._transition("error");return}let a=this._ref.storage._makeRequest(o,newTextConnection,n,s,!1);this._request=a,a.getPromise().then(e=>{this._increaseMultiplier(),this._request=void 0,this._updateProgress(e.current),e.finalized?(this._metadata=e.metadata,this._transition("success")):this.completeTransitions_()},this._errorHandler)})}_increaseMultiplier(){let e=262144*this._chunkMultiplier;2*e<33554432&&(this._chunkMultiplier*=2)}_fetchMetadata(){this._resolveToken((e,t)=>{let r=getMetadata$2(this._ref.storage,this._ref._location,this._mappings),n=this._ref.storage._makeRequest(r,newTextConnection,e,t);this._request=n,n.getPromise().then(e=>{this._request=void 0,this._metadata=e,this._transition("success")},this._metadataErrorHandler)})}_oneShotUpload(){this._resolveToken((e,t)=>{let r=function(e,t,r,n,s){let i=t.bucketOnlyServerUrl(),o={"X-Goog-Upload-Protocol":"multipart"},a=function(){let e="";for(let t=0;t<2;t++)e+=Math.random().toString().slice(2);return e}();o["Content-Type"]="multipart/related; boundary="+a;let l=metadataForUpload_(t,n,s),u=toResourceString(l,r),c="--"+a+"\r\nContent-Type: application/json; charset=utf-8\r\n\r\n"+u+"\r\n--"+a+"\r\nContent-Type: "+l.contentType+"\r\n\r\n",h=FbsBlob.getBlob(c,n,"\r\n--"+a+"--");if(null===h)throw cannotSliceBlob();let d={name:l.fullPath},p=makeUrl(i,e.host,e._protocol),_=e.maxUploadRetryTime,f=new RequestInfo(p,"POST",metadataHandler(e,r),_);return f.urlParams=d,f.headers=o,f.body=h.uploadData(),f.errorHandler=sharedErrorHandler(t),f}(this._ref.storage,this._ref._location,this._mappings,this._blob,this._metadata),n=this._ref.storage._makeRequest(r,newTextConnection,e,t);this._request=n,n.getPromise().then(e=>{this._request=void 0,this._metadata=e,this._updateProgress(this._blob.size()),this._transition("success")},this._errorHandler)})}_updateProgress(e){let t=this._transferred;this._transferred=e,this._transferred!==t&&this._notifyObservers()}_transition(e){if(this._state!==e)switch(e){case"canceling":case"pausing":this._state=e,void 0!==this._request?this._request.cancel():this.pendingTimeout&&(clearTimeout(this.pendingTimeout),this.pendingTimeout=void 0,this.completeTransitions_());break;case"running":let t="paused"===this._state;this._state=e,t&&(this._notifyObservers(),this._start());break;case"paused":case"error":case"success":this._state=e,this._notifyObservers();break;case"canceled":this._error=canceled(),this._state=e,this._notifyObservers()}}completeTransitions_(){switch(this._state){case"pausing":this._transition("paused");break;case"canceling":this._transition("canceled");break;case"running":this._start()}}get snapshot(){let e=taskStateFromInternalTaskState(this._state);return{bytesTransferred:this._transferred,totalBytes:this._blob.size(),state:e,metadata:this._metadata,task:this,ref:this._ref}}on(e,t,r,n){let s=new Observer(t||void 0,r||void 0,n||void 0);return this._addObserver(s),()=>{this._removeObserver(s)}}then(e,t){return this._promise.then(e,t)}catch(e){return this.then(null,e)}_addObserver(e){this._observers.push(e),this._notifyObserver(e)}_removeObserver(e){let t=this._observers.indexOf(e);-1!==t&&this._observers.splice(t,1)}_notifyObservers(){this._finishPromise();let e=this._observers.slice();e.forEach(e=>{this._notifyObserver(e)})}_finishPromise(){if(void 0!==this._resolve){let e=!0;switch(taskStateFromInternalTaskState(this._state)){case m.SUCCESS:async(this._resolve.bind(null,this.snapshot))();break;case m.CANCELED:case m.ERROR:let t=this._reject;async(t.bind(null,this._error))();break;default:e=!1}e&&(this._resolve=void 0,this._reject=void 0)}}_notifyObserver(e){let t=taskStateFromInternalTaskState(this._state);switch(t){case m.RUNNING:case m.PAUSED:e.next&&async(e.next.bind(e,this.snapshot))();break;case m.SUCCESS:e.complete&&async(e.complete.bind(e))();break;case m.CANCELED:case m.ERROR:default:e.error&&async(e.error.bind(e,this._error))()}}resume(){let e="paused"===this._state||"pausing"===this._state;return e&&this._transition("running"),e}pause(){let e="running"===this._state;return e&&this._transition("pausing"),e}cancel(){let e="running"===this._state||"pausing"===this._state;return e&&this._transition("canceling"),e}};/**
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
 */let Reference=class Reference{constructor(e,t){this._service=e,t instanceof Location?this._location=t:this._location=Location.makeFromUrl(t,e.host)}toString(){return"gs://"+this._location.bucket+"/"+this._location.path}_newRef(e,t){return new Reference(e,t)}get root(){let e=new Location(this._location.bucket,"");return this._newRef(this._service,e)}get bucket(){return this._location.bucket}get fullPath(){return this._location.path}get name(){return lastComponent(this._location.path)}get storage(){return this._service}get parent(){let e=/**
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
 */function(e){if(0===e.length)return null;let t=e.lastIndexOf("/");if(-1===t)return"";let r=e.slice(0,t);return r}(this._location.path);if(null===e)return null;let t=new Location(this._location.bucket,e);return new Reference(this._service,t)}_throwIfRoot(e){if(""===this._location.path)throw invalidRootOperation(e)}};async function listAllHelper(e,t,r){let n=await list$1(e,{pageToken:r});t.prefixes.push(...n.prefixes),t.items.push(...n.items),null!=n.nextPageToken&&await listAllHelper(e,t,n.nextPageToken)}function list$1(e,t){null!=t&&"number"==typeof t.maxResults&&validateNumber("options.maxResults",1,1e3,t.maxResults);let r=t||{},n=function(e,t,r,n,s){var i;let o={};t.isRoot?o.prefix="":o.prefix=t.path+"/",r&&r.length>0&&(o.delimiter=r),n&&(o.pageToken=n),s&&(o.maxResults=s);let a=t.bucketOnlyServerUrl(),l=makeUrl(a,e.host,e._protocol),u=e.maxOperationRetryTime,c=new RequestInfo(l,"GET",(i=t.bucket,function(t,r){let n=function(e,t,r){let n=jsonObjectOrNull(r);return null===n?null:function(e,t,r){let n={prefixes:[],items:[],nextPageToken:r.nextPageToken};if(r[_])for(let s of r[_]){let r=s.replace(/\/$/,""),i=e._makeStorageReference(new Location(t,r));n.prefixes.push(i)}if(r[f])for(let s of r[f]){let r=e._makeStorageReference(new Location(t,s.name));n.items.push(r)}return n}(e,t,n)}(e,i,r);return handlerCheck(null!==n),n}),u);return c.urlParams=o,c.errorHandler=sharedErrorHandler(t),c}(e.storage,e._location,"/",r.pageToken,r.maxResults);return e.storage.makeRequestWithTokens(n,newTextConnection)}function _getChild$1(e,t){let r=function(e,t){let r=t.split("/").filter(e=>e.length>0).join("/");return 0===e.length?r:e+"/"+r}(e._location.path,t),n=new Location(e._location.bucket,r);return new Reference(e.storage,n)}function extractBucket(e,t){let r=null==t?void 0:t[h];return null==r?null:Location.makeFromBucketSpec(r,e)}let FirebaseStorageImpl=class FirebaseStorageImpl{constructor(e,t,r,n,s){this.app=e,this._authProvider=t,this._appCheckProvider=r,this._url=n,this._firebaseVersion=s,this._bucket=null,this._host=c,this._protocol="https",this._appId=null,this._deleted=!1,this._maxOperationRetryTime=12e4,this._maxUploadRetryTime=6e5,this._requests=new Set,null!=n?this._bucket=Location.makeFromBucketSpec(n,this._host):this._bucket=extractBucket(this._host,this.app.options)}get host(){return this._host}set host(e){this._host=e,null!=this._url?this._bucket=Location.makeFromBucketSpec(this._url,e):this._bucket=extractBucket(e,this.app.options)}get maxUploadRetryTime(){return this._maxUploadRetryTime}set maxUploadRetryTime(e){validateNumber("time",0,Number.POSITIVE_INFINITY,e),this._maxUploadRetryTime=e}get maxOperationRetryTime(){return this._maxOperationRetryTime}set maxOperationRetryTime(e){validateNumber("time",0,Number.POSITIVE_INFINITY,e),this._maxOperationRetryTime=e}async _getAuthToken(){if(this._overrideAuthToken)return this._overrideAuthToken;let e=this._authProvider.getImmediate({optional:!0});if(e){let t=await e.getToken();if(null!==t)return t.accessToken}return null}async _getAppCheckToken(){let e=this._appCheckProvider.getImmediate({optional:!0});if(e){let t=await e.getToken();return t.token}return null}_delete(){return this._deleted||(this._deleted=!0,this._requests.forEach(e=>e.cancel()),this._requests.clear()),Promise.resolve()}_makeStorageReference(e){return new Reference(this,e)}_makeRequest(e,t,r,n,s=!0){if(this._deleted)return new FailRequest(appDeleted());{let i=function(e,t,r,n,s,i,o=!0){let a=makeQueryString(e.urlParams),l=e.url+a,u=Object.assign({},e.headers);return t&&(u["X-Firebase-GMPID"]=t),null!==r&&r.length>0&&(u.Authorization="Firebase "+r),u["X-Firebase-Storage-Version"]="webjs/"+(null!=i?i:"AppManager"),null!==n&&(u["X-Firebase-AppCheck"]=n),new NetworkRequest(l,e.method,u,e.body,e.successCodes,e.additionalRetryCodes,e.handler,e.errorHandler,e.timeout,e.progressCallback,s,o)}(e,this._appId,r,n,t,this._firebaseVersion,s);return this._requests.add(i),i.getPromise().then(()=>this._requests.delete(i),()=>this._requests.delete(i)),i}}async makeRequestWithTokens(e,t){let[r,n]=await Promise.all([this._getAuthToken(),this._getAppCheckToken()]);return this._makeRequest(e,t,r,n).getPromise()}};let b="@firebase/storage",R="0.11.2",T="storage";function uploadBytesResumable(e,t,r){var n;return(n=e=(0,l.m9)(e))._throwIfRoot("uploadBytesResumable"),new UploadTask(n,new FbsBlob(t),r)}function getMetadata(e){return function(e){e._throwIfRoot("getMetadata");let t=getMetadata$2(e.storage,e._location,getMappings());return e.storage.makeRequestWithTokens(t,newTextConnection)}(e=(0,l.m9)(e))}function updateMetadata(e,t){return function(e,t){e._throwIfRoot("updateMetadata");let r=function(e,t,r,n){let s=t.fullServerUrl(),i=makeUrl(s,e.host,e._protocol),o=toResourceString(r,n),a=e.maxOperationRetryTime,l=new RequestInfo(i,"PATCH",metadataHandler(e,n),a);return l.headers={"Content-Type":"application/json; charset=utf-8"},l.body=o,l.errorHandler=objectErrorHandler(t),l}(e.storage,e._location,t,getMappings());return e.storage.makeRequestWithTokens(r,newTextConnection)}(e=(0,l.m9)(e),t)}function list(e,t){return list$1(e=(0,l.m9)(e),t)}function listAll(e){return function(e){let t={prefixes:[],items:[]};return listAllHelper(e,t).then(()=>t)}(e=(0,l.m9)(e))}function getDownloadURL(e){return function(e){e._throwIfRoot("getDownloadURL");let t=function(e,t,r){let n=t.fullServerUrl(),s=makeUrl(n,e.host,e._protocol),i=e.maxOperationRetryTime,o=new RequestInfo(s,"GET",function(t,n){let s=fromResourceString(e,n,r);return handlerCheck(null!==s),function(e,t,r,n){let s=jsonObjectOrNull(t);if(null===s||!isString(s.downloadTokens))return null;let i=s.downloadTokens;if(0===i.length)return null;let o=encodeURIComponent,a=i.split(","),l=a.map(t=>{let s=e.bucket,i=e.fullPath,a="/b/"+o(s)+"/o/"+o(i),l=makeUrl(a,r,n),u=makeQueryString({alt:"media",token:t});return l+u});return l[0]}(s,n,e.host,e._protocol)},i);return o.errorHandler=objectErrorHandler(t),o}(e.storage,e._location,getMappings());return e.storage.makeRequestWithTokens(t,newTextConnection).then(e=>{if(null===e)throw new StorageError(i.NO_DOWNLOAD_URL,"The given file does not have any download URLs.");return e})}(e=(0,l.m9)(e))}function deleteObject(e){return function(e){e._throwIfRoot("deleteObject");let t=function(e,t){let r=t.fullServerUrl(),n=makeUrl(r,e.host,e._protocol),s=e.maxOperationRetryTime,i=new RequestInfo(n,"DELETE",function(e,t){},s);return i.successCodes=[200,204],i.errorHandler=objectErrorHandler(t),i}(e.storage,e._location);return e.storage.makeRequestWithTokens(t,newTextConnection)}(e=(0,l.m9)(e))}function ref(e,t){return function(e,t){if(!(t&&/^[A-Za-z]+:\/\//.test(t)))return function refFromPath(e,t){if(e instanceof FirebaseStorageImpl){if(null==e._bucket)throw new StorageError(i.NO_DEFAULT_BUCKET,"No default bucket found. Did you set the '"+h+"' property when initializing the app?");let r=new Reference(e,e._bucket);return null!=t?refFromPath(r,t):r}return void 0!==t?_getChild$1(e,t):e}(e,t);if(e instanceof FirebaseStorageImpl)return new Reference(e,t);throw invalidArgument("To use ref(service, url), the first argument must be a Storage instance.")}(e=(0,l.m9)(e),t)}function _getChild(e,t){return _getChild$1(e,t)}function getStorage(e=(0,a.getApp)(),t){e=(0,l.m9)(e);let r=(0,a._getProvider)(e,T),n=r.getImmediate({identifier:t}),s=(0,l.P0)("storage");return s&&connectStorageEmulator(n,...s),n}function connectStorageEmulator(e,t,r,n={}){!function(e,t,r,n={}){e.host=`${t}:${r}`,e._protocol="http";let{mockUserToken:s}=n;s&&(e._overrideAuthToken="string"==typeof s?s:(0,l.Sg)(s,e.app.options.projectId))}(e,t,r,n)}(0,a._registerComponent)(new u.wA(T,function(e,{instanceIdentifier:t}){let r=e.getProvider("app").getImmediate(),n=e.getProvider("auth-internal"),s=e.getProvider("app-check-internal");return new FirebaseStorageImpl(r,n,s,t,a.SDK_VERSION)},"PUBLIC").setMultipleInstances(!0)),(0,a.registerVersion)(b,R,""),(0,a.registerVersion)(b,R,"esm2017")}}]);