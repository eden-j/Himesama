// Generated by CoffeeScript 1.10.0
(function() {
  var Diff, Merge, Render, _, adoptId, allocateIds, eitherAreText, handleCustom, hk, max, mergeChildren, min, replaceNode;

  _ = require('lodash');

  Diff = require('./diff');

  Render = require('./render');

  min = Math.min, max = Math.max;

  allocateIds = require('./allocate-ids');

  eitherAreText = function(model, draft) {
    if (model.type === 'himesama-text') {
      return true;
    }
    if (draft.type === 'himesama-text') {
      return true;
    }
  };

  hk = 'himesama-id';

  adoptId = function(model, draft) {
    draft.attributes[hk] = model.attributes[hk];
    return draft;
  };

  handleCustom = function(vo) {
    if (vo.type === 'custom') {
      return vo.children[0];
    }
    return vo;
  };

  replaceNode = function(model, draft) {
    var children, i, parent;
    i = model.index;
    parent = model.parent;
    children = parent.children;
    return children[i] = draft;
  };

  module.exports = Merge = function(model, draft) {
    model = handleCustom(model);
    draft = handleCustom(draft);
    if (eitherAreText(model, draft)) {
      if (model.type !== 'himesama-text') {
        replaceNode(model, draft);
        return Render.nodeToText(model, draft);
      } else {
        if (draft.type === 'himesama-text') {
          if (!Diff.strings(model, draft)) {
            model.content = draft.content;
            return Render.text(model, draft);
          }
        } else {
          replaceNode(model, draft);
          return Render.textToNode(model, draft);
        }
      }
    } else {
      draft = adoptId(model, draft);
      if (!Diff.nodes(model, draft)) {
        model.attributes = draft.attributes;
        model.type = draft.type;
        Render.node(model, draft);
      }
      return mergeChildren(model, draft);
    }
  };

  mergeChildren = function(model, draft) {
    var dChildren, dl, f, mChildren, ml, s;
    mChildren = model.children;
    dChildren = draft.children;
    ml = mChildren.length;
    dl = dChildren.length;
    f = min(ml, dl);
    _.times(f, (function(_this) {
      return function(fi) {
        var dChild, mChild;
        mChild = mChildren[fi];
        dChild = dChildren[fi];
        dChild.parent = mChild.parent;
        return Merge(mChild, dChild);
      };
    })(this));
    s = max(ml, dl);
    if (ml > dl) {
      return _.times(s - f, (function(_this) {
        return function() {
          var mChild;
          mChild = mChildren[f];
          Render.remove(mChild, f);
          return mChildren.splice(f, 1);
        };
      })(this));
    } else {
      return _.times(s - f, (function(_this) {
        return function(si) {
          var childsId, dChild, id;
          dChild = dChildren[si + f];
          dChild.parent = model;
          id = model.attributes[hk];
          childsId = id + '.' + (si + f);
          allocateIds(dChild, childsId);
          Render.add(model, dChild);
          return model.children.push(dChild);
        };
      })(this));
    }
  };

}).call(this);
