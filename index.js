// Generated by CoffeeScript 1.10.0
(function() {
  var Himesama, IDKey, _, activeElement, addressKey, createElement, createTextNode, getByAttribute, getElementById, himesamaKeys, isParentOf, makeStyleString, querySelector, querySelectorAll, ref, removeChildren,
    indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  _ = require('lodash');

  himesamaKeys = require('./himesama-keys');

  ref = require('./himesama-doc'), createTextNode = ref.createTextNode, getElementById = ref.getElementById, createElement = ref.createElement, querySelectorAll = ref.querySelectorAll, activeElement = ref.activeElement, querySelector = ref.querySelector;

  makeStyleString = require('./style-to-string');

  addressKey = 'himesama-address';

  IDKey = 'himesama-id';

  getByAttribute = function(key, value) {
    return querySelector('[' + key + '="' + value + '"]');
  };

  isParentOf = function(a, b) {
    if (a !== b) {
      return !_.reduce(a, function(sum, char, ci) {
        return sum && (char === b[ci]);
      });
    } else {
      return true;
    }
  };

  removeChildren = function(addresses) {
    addresses = _.map(addresses, function(id) {
      var address, node;
      node = getByAttribute(IDKey, id);
      address = node.getAttribute(addressKey);
      return [address, id];
    });
    addresses = _.filter(addresses, function(address0) {
      return _.reduce(addresses, function(sum, address1) {
        return sum && isParentOf(address0[0], address1[0]);
      });
    });
    return _.map(addresses, function(address) {
      return address[1];
    });
  };

  module.exports = Himesama = {
    el: function(type) {
      return function() {
        var args, attributes, innerHTML, output;
        args = _.toArray(arguments);
        attributes = args[0];
        innerHTML = args.slice(1);
        output = createElement(type);
        if (attributes != null) {
          _.forEach(_.keys(attributes), (function(_this) {
            return function(key) {
              var attribute, style;
              attribute = attributes[key];
              switch (key) {
                case 'className':
                  return output.setAttribute('class', attribute);
                case 'eventListeners':
                  return _.forEach(_.keys(attribute), function(event) {
                    var act;
                    act = attribute[event];
                    return output.addEventListener(event, act);
                  });
                case 'style':
                  style = makeStyleString(attribute);
                  return output.setAttribute('style', style);
                default:
                  return output.setAttribute(key, attribute);
              }
            };
          })(this));
        }
        innerHTML = _.flatten(innerHTML);
        _.forEach(innerHTML, function(child, ci) {
          var id;
          if (child != null) {
            if (_.isString(child)) {
              child = createTextNode(child);
            }
            if (child.isHimesama) {
              id = child.id;
              child = child.render();
              child.setAttribute(IDKey, id);
            }
            return output.appendChild(child);
          }
        });
        return output;
      };
    },
    Render: function(root, mountPoint) {
      var rendering;
      if (mountPoint != null) {
        this.MountPoint = mountPoint;
      }
      if (root != null) {
        this.Root = root;
      }
      rendering = this.Root.render();
      rendering.setAttribute(IDKey, this.Root.id);
      this.allocateAddress(rendering, '.0');
      return this.MountPoint.appendChild(rendering);
    },
    allocateAddress: function(el, address) {
      el.setAttribute(addressKey, address);
      return _.forEach(el.children, (function(_this) {
        return function(child, ci) {
          return _this.allocateAddress(child, address + '.' + ci);
        };
      })(this));
    },
    getIndex: function(id) {
      var ci, output;
      output = '';
      ci = id.length - 1;
      while (id[ci] !== '.') {
        output = id[ci] + output;
        ci--;
      }
      return output;
    },
    Rerender: function(stateKey) {
      var addresses;
      addresses = removeChildren(this.rerendees[stateKey]);
      return _.forEach(addresses, (function(_this) {
        return function(id) {
          return _this.RerenderThis(id);
        };
      })(this));
    },
    RerenderThis: function(id) {
      var activeAddress, activeEl, address, index, node, parent, rendering, toFocus;
      node = getByAttribute(IDKey, id);
      if (node != null) {
        address = node.getAttribute(addressKey);
        index = this.getIndex(address);
        parent = node.parentElement;
        activeEl = document.activeElement;
        activeAddress = activeEl.getAttribute(addressKey);
        if (activeEl.type === 'text') {
          this.textStart = activeEl.selectionStart;
          this.textEnd = activeEl.selectionEnd;
        }
        node.remove();
        rendering = this.components[id].render();
        rendering.setAttribute(IDKey, id);
        this.allocateAddress(rendering, address);
        parent.insertBefore(rendering, parent.childNodes[index]);
        toFocus = getByAttribute(addressKey, activeAddress);
        toFocus.focus();
        if (toFocus.type === 'text') {
          return toFocus.setSelectionRange(this.textStart, this.textEnd);
        }
      }
    },
    getRender: function() {
      return this.Render.bind(this);
    },
    initState: function(state) {
      this.state = state;
      return this.rerendees = _.mapValues(state, function() {
        return [];
      });
    },
    getState: function() {
      return this.state;
    },
    setState: function(newValue) {
      return _.forEach(_.keys(newValue), (function(_this) {
        return function(key) {
          _this.state[key] = newValue[key];
          return _this.Rerender(key);
        };
      })(this));
    },
    components: {},
    Component: function(c) {
      _.forEach(_.keys(c), function(key) {
        if (indexOf.call(himesamaKeys, key) < 0) {
          if (_.isFunction(c[key])) {
            return c[key] = c[key].bind(c);
          }
        }
      });
      c.id = (Math.random().toString(36)).slice(2);
      this.components[c.id] = c;
      _.forEach(c.needs, (function(_this) {
        return function(need) {
          return _this.rerendees[need].push(c.id);
        };
      })(this));
      c.isHimesama = true;
      c.setState = this.setState.bind(Himesama);
      c.state = this.getState();
      return c;
    },
    Doc: require('./himesama-doc')
  };

}).call(this);
