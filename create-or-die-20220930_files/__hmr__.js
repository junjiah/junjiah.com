// src/imba/utils.imba
function iter$__(a) {
  let v;
  return a ? (v = a.toIterable) ? v.call(a) : a : [];
}
var φ1 = Symbol.for("#type");
var φ20 = Symbol.for("#__listeners__");
function deserializeData(data, reviver = null) {
  let objects = {};
  let reg = /\$\$\d+\$\$/;
  let lookup = function(value) {
    return objects[value] || (objects[value] = reviver ? reviver(value) : {});
  };
  let parser = function(key, value) {
    if (typeof value == "string") {
      if (value[0] == "$" && reg.test(value)) {
        return lookup(value);
      }
      ;
    } else if (typeof key == "string" && key[0] == "$" && reg.test(key)) {
      let obj = lookup(key);
      Object.assign(obj, value);
      return obj;
    }
    ;
    return value;
  };
  let parsed = JSON.parse(data, parser);
  return parsed;
}
function patchManifest(prev, curr) {
  var φ7, φ6, φ11, φ18;
  let origs = {};
  let diff = {
    added: [],
    changed: [],
    removed: [],
    all: [],
    urls: {}
  };
  if (prev.assets) {
    for (let φ4 = 0, φ5 = iter$__(prev.assets), φ8 = φ5.length; φ4 < φ8; φ4++) {
      let item = φ5[φ4];
      let ref = item.originalPath || item.path;
      origs[ref] = item;
      if (item.url) {
        (φ7 = curr.urls)[φ6 = item.url] || (φ7[φ6] = item);
      }
      ;
    }
    ;
  }
  ;
  for (let φ9 = 0, φ10 = iter$__(curr.assets || []), φ12 = φ10.length; φ9 < φ12; φ9++) {
    let item = φ10[φ9];
    let ref = item.originalPath || item.path;
    let orig = origs[ref];
    if (item.url && prev.urls) {
      prev.urls[item.url] = item;
    }
    ;
    if (orig) {
      if (orig.hash != item.hash) {
        orig.invalidated = Date.now();
        orig.replacedBy = item;
        item.replaces = orig;
        diff.changed.push(item);
        diff.all.push(item);
        if (orig == prev.main) {
          diff.main = item;
        }
        ;
      }
      ;
      φ11 = origs[ref], delete origs[ref], φ11;
    } else {
      diff.added.push(item);
      diff.all.push(item);
    }
    ;
  }
  ;
  for (let φ13 = 0, φ14 = Object.keys(origs), φ15 = φ14.length, path, item; φ13 < φ15; φ13++) {
    path = φ14[φ13];
    item = origs[path];
    item.removed = Date.now();
    diff.all.push(item);
  }
  ;
  for (let φ16 = 0, φ17 = iter$__(diff.all), φ19 = φ17.length; φ16 < φ19; φ16++) {
    let item = φ17[φ16];
    let typ = diff[φ18 = item.type] || (diff[φ18] = []);
    typ.push(item);
  }
  ;
  diff.removed = Object.values(origs);
  curr.changes = diff;
  return curr;
}

// src/imba/hmr.imba
function iter$__2(a) {
  let v;
  return a ? (v = a.toIterable) ? v.call(a) : a : [];
}
var doc = globalThis.document;
var Manifest = class {
  constructor() {
    this.data = {};
  }
  get changes() {
    return this.data.changes || {};
  }
  get inputs() {
    return this.data.inputs;
  }
  get outputs() {
    return this.data.outputs;
  }
  get urls() {
    return this.data.urls;
  }
  get main() {
    return this.data.main;
  }
  init(raw) {
    return this.update(raw);
  }
  update(raw) {
    if (typeof raw == "string") {
      raw = deserializeData(raw);
    }
    ;
    this.data = patchManifest(this.data, raw);
    return this.data.changes;
  }
};
var DevTools = class {
  constructor() {
    this.start();
    this.manifest = new Manifest({});
    this.debug = false;
    this;
  }
  log(...params) {
    if (!this.debug) {
      return;
    }
    ;
    return console.log(...params);
  }
  refresh(changes) {
    let dirty = {
      css: [],
      js: []
    };
    for (let sheet of iter$__2(doc.styleSheets)) {
      let asset;
      let url = sheet.ownerNode.getAttribute("href");
      if (asset = this.manifest.urls[url]) {
        if (asset.replacedBy) {
          sheet.ownerNode.href = asset.replacedBy.url;
        }
        ;
      }
      ;
    }
    ;
    for (let el of iter$__2(doc.querySelectorAll("script[src]"))) {
      let asset1;
      if (asset1 = this.manifest.urls[el.getAttribute("src")]) {
        if (asset1.replacedBy) {
          dirty.js.push(asset1);
        }
        ;
      }
      ;
    }
    ;
    if (dirty.js.length) {
      this.log("js changed - reload?", dirty.js);
      doc.location.reload();
    }
    ;
    return this;
  }
  start() {
    var self = this;
    if (this.socket) {
      return;
    }
    ;
    this.socket = new EventSource("/__hmr__");
    this.socket.onmessage = function(e) {
      return self.log("sse.onmessage", e);
    };
    this.socket.addEventListener("paused", function(e) {
      self.log("server paused");
      return true;
    });
    this.socket.addEventListener("state", function(e) {
      let json = JSON.parse(e.data);
      return self.log("server state", json);
    });
    this.socket.addEventListener("init", function(e) {
      let json = JSON.parse(e.data);
      self.manifest.init(json);
      return self.log("hmr init", self.manifest.data);
    });
    this.socket.addEventListener("errors", function(e) {
      let json = JSON.parse(e.data);
      for (let φ12 = 0, φ2 = iter$__2(json), φ3 = φ2.length; φ12 < φ3; φ12++) {
        let item = φ2[φ12];
        console.error("error in " + item.location.file + ": " + item.location.lineText + " (" + item.text + ")");
      }
      ;
      return;
    });
    this.socket.addEventListener("manifest", function(e) {
      let json = JSON.parse(e.data);
      let changes = self.manifest.update(json);
      return self.refresh(changes);
    });
    this.socket.addEventListener("reload", function(e) {
      self.log("asked to reload by server");
      return doc.location.reload();
    });
    return this.socket.onerror = function(e) {
      return self.log("hmr disconnected", e);
    };
  }
};
globalThis.imba_devtools = new DevTools();
