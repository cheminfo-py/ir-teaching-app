"use strict";onmessage=function(a){var b=a.data.message;a.data.message=JSON.parse(b),postMessage(a.data)};
